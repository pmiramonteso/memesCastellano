const { validationResult } = require('express-validator');
const fs = require('fs');
const path = require('path');

const obtenerUsuario = async (req, res) => {
  try {
    const user_data = {
      "id_usuario": req.usuario.id_usuario,
      "nombre": req.usuario.nombre,
      "apellidos": req.usuario.apellidos,
      "email": req.usuario.email,
      "roles": req.usuario.roles,
      "created_at": req.usuario.created_at,
      "updated_at": req.usuario.updated_at
    };

    res.status(200).json({
      code: 1,
      message: 'Detalle Usuario',
      data: user_data 
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      code: -100,
      message: 'Ocurrio un error para obtener el usuario'
    });
  }
};

module.exports = {
  obtenerUsuario
};
