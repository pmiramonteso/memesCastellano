const bcrypt = require('bcrypt');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const Usuario = require('../models/usuarioModel');
const RecoveryToken = require('../models/recoveryTokenModel');
const sendEmail = require("../utils/email/sendEmail");
const { validationResult } = require('express-validator');
const { serialize } = require('cookie');

const usuarioURL = process.env.USER_URL;

const registro = async (req, res) => {
//  console.log('Headers received:', req.headers);
  //  console.log('Body received:', req.body);
    try {
      const errors = validationResult(req);
  
      // Si hay errores de validación, responde con un estado 400 Bad Request
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
     
      const { nombre, apellidos, email, password, roles } = req.body;

      // Verificar si ya existe un usuario con el mismo correo electrónico
      const existingUser = await Usuario.findOne({ where: { email } });
      if (existingUser) {
        return res.status(400).json({
          code: -2,
          message: 'Ya existe un usuario con el mismo correo electrónico'
        });
      }
      
      // Crear un nuevo usuario
      const hashedPassword = await bcrypt.hash(password, Number(process.env.BCRYPT_SALT));
      const nuevoUsuario = new Usuario({ nombre, apellidos, email, password: hashedPassword, roles: 'usuario', status: 1 });
      await nuevoUsuario.save();
  
      // Generar un token de acceso y lo guardo en un token seguro (httpOnly)
      const accessToken = jwt.sign({ id_usuario: nuevoUsuario.id_usuario, nombre: nuevoUsuario.nombre }, process.env.JWT_SECRET,
      { expiresIn: '2h' });
      const token = serialize('token', accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'none',
        maxAge: 60 * 60 * 24 * 30,
        path: '/',
      });
      res.setHeader('Set-Cookie', token);
  
      // Enviar una respuesta al cliente
      res.status(200).json({
        code: 1,
        message: 'Usuario registrado correctamente',
        accessToken: accessToken,  // Incluye el token
        data: {
          usuario: {
            id_usuario: nuevoUsuario.id_usuario,
            nombre: nuevoUsuario.nombre,
            apellidos: nuevoUsuario.apellidos,
            email: nuevoUsuario.email,
            roles: nuevoUsuario.roles,
          }
        }
      });

    } catch (error) {
      console.error(error);
      res.status(500).json({
        code: -100,
        message: 'Ha ocurrido un error al registrar el usuario',
        error: error,
      });
    }
    console.log('Body received:', req.body);
};

const login = async (req, res) => {
    try {
      const errors = validationResult(req);
  
      // Si hay errores de validacion
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
  
      const { email, password } = req.body;
      
      // Verificar si el correo electrónico y la contraseña son correctos
      const usuario = await Usuario.findOne({ where: { email } });
      if (!usuario) {
        return res.status(401).json({
          code: -25,
          message: 'usuario no existe'
        });
      }
  
      const isPasswordValid = await bcrypt.compare(password, usuario.password);
      if (!isPasswordValid) {
        return res.status(401).json({
          code: -5,
          message: 'Credenciales incorrectas'
        });
      }
  
      // Generar un token de acceso y lo guardo en un token seguro (httpOnly)
      const accessToken = jwt.sign({ id_usuario: usuario.id_usuario, nombre: usuario.nombre }, process.env.JWT_SECRET,
        { expiresIn: '2h' });
      const token = serialize('token', accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'none',
        maxAge: 60 * 60 * 24 * 30,
        path: '/',
      });
      res.setHeader('Set-Cookie', token);
  
      // Enviar una respuesta al cliente
      res.status(200).json({
        code: 1,
        message: 'Login OK',
        data: {
          usuario: {
            id_usuario: usuario.id_usuario,
            nombre: usuario.nombre,
            apellidos: usuario.apellidos,
            email: usuario.email,
            roles: usuario.roles
          },
          accessToken: accessToken
        }
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        code: -100,
        message: 'Ha ocurrido un error al iniciar sesión',
        error: error
      });
    }
};

const forgotPassword = async (req, res) => {
    try {
      const errors = validationResult(req);
        // Si hay error de validacion
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
  
      const { email } = req.body;
  
      const usuario = await Usuario.findOne({ where: { email } });
      if (!usuario) {
        return res.status(404).json({
          code: -8,
          message: 'Email no existe'
        });
      }
  
      let resetToken = crypto.randomBytes(32).toString("hex");
  
      await new RecoveryToken({
        usuario_id: usuario.id_usuario,
        token: resetToken,
        created_at: Date.now(),
      }).save();
  
      const link = `${usuarioURL}/change-password?token=${resetToken}&id=${usuario.id_usuario}`;
  
      await sendEmail(
        usuario.email,
        "Password Reset Request",
        {
          nombre: usuario.nombre,
          link: link,
        },
        "email/template/requestResetPassword.handlebars"
      ).then(response => {
        console.log("Resultado del envío del correo:", response);
        res.status(200).json({
          code: 100,
          message: 'Email enviado',
          data: {
            token: resetToken,
            link: link
          }
        });
  
      }, error => {
        console.error (error);
        res.status(200).json({
          code: -80,
          message: 'Email no ha podido ser enviado',
          data: {error}
        });
      });
  
    } catch (error) {
      console.error(error);
      res.status(500).json({
        code: -100,
        message: 'Ha ocurrido un error al actualizar el usuario',
        error: error
      });
    }
};

const changePassword = async (req, res) => {
    try {
      const errors = validationResult(req);
  
      // Si hay error de validacion
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
  
      const { token, password } = req.body;
  
      //Reviso si el Token existe
      let token_row = await RecoveryToken.findOne({ where: { token } });
      if (!token_row) {
        return res.status(404).json({
          code: -3,
          message: 'Token Incorrecto'
        });
      } 
  
      // Buscar un usuario por su ID en la base de datos
      const usuario = await Usuario.findOne({ where: { id_usuario: token_row.usuario_id } });
      if (!usuario) {
        return res.status(404).json({
          code: -10,
          message: 'Usuario no encontrado'
        });
      }
  
      // Actualizar la contraseña del usuario
      usuario.password = await bcrypt.hash(password, Number(process.env.BCRYPT_SALT));
      await usuario.save();
  
      // Elimino el token
      await RecoveryToken.destroy({
        where: {
          usuario_id: token_row.usuario_id
        }
      });
  
      // Generar un token de acceso y lo guardo en un token seguro (httpOnly)
      const accessToken = jwt.sign({ id_usuario: usuario.id_usuario, nombre: usuario.nombre }, process.env.JWT_SECRET);
      const token_jwt = serialize('token', accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'none',
        maxAge: 60 * 60 * 24 * 30,
        path: '/',
      });
      res.setHeader('Set-Cookie', token_jwt);
  
      // Enviar una respuesta al cliente
      res.status(200).json({
        code: 1,
        message: 'Usuario Detail',
        data: {
          usuario: {
            nombre: usuario.nombre,
            apellidos: usuario.apellidos,
            email: usuario.email
          } 
        }
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        code: -100,
        message: 'Ha ocurrido un error al actualizar el usuario',
        error: error
      });
    }
};

const logout = async (req, res) => {
    const { cookies } = req;
    const jwt = cookies.token;
  
    const token = serialize('token', null, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'none',
      maxAge: -1,
      path: '/',
    });
    res.setHeader('Set-Cookie', token);
    res.status(200).json({
      code: 0,
      message: 'Logged out - Delete Token',
    });
};

module.exports = {
  registro,
  login,
  forgotPassword,
  changePassword,
  logout
};
