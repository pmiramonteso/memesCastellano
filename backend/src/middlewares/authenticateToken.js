const jwt = require('jsonwebtoken');
const Usuario = require('../models/usuarioModel.js');

const authenticateToken = (allowedRoles) => async (req, res, next) => {
  try {
    const { cookies } = req;
    const accessToken = cookies.token;

    if (!accessToken) {
      return res.status(401).json({
        code: -50,
        message: 'No se ha proporcionado un token de acceso'
      });
    }

    const decodedToken = jwt.verify(accessToken, process.env.JWT_SECRET);
    const usuario = await Usuario.findByPk(decodedToken.id_usuario);
    if (!usuario) {
      return res.status(401).json({
        code: -70,
        message: 'Token de acceso no válido'
      });
    }
    const userRoles = Array.isArray(usuario.roles) 
    ? usuario.roles 
    : usuario.roles.split(',').map(role => role.trim());

    const hasPermission = allowedRoles.some(role => 
      usuario.roles.includes(role) || usuario.roles.split(',').includes(role)
    );
    if (!hasPermission) {
      return res.status(403).json({
        code: -10,
        message: 'No tiene los permisos necesarios.'
      });
    }

    req.usuario = usuario;
    next();
  } catch (error) {
    console.error('Error en authenticateToken:', error);
    res.status(500).json({
      code: -100,
      message: 'Ha ocurrido un error al autenticar el token de acceso'
    });
  }
};

module.exports = { authenticateToken };
