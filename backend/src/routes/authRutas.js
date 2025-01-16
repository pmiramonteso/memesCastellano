const { Router } = require('express');
const { registro, login, logout, forgotPassword, changePassword } = require('../controllers/authController.js');
const { registroValidator, loginValidator, forgotPasswordValidator, changePasswordValidator } = require('../validations/authValidacion.js');
const router = Router();

// Rutas para registrarse e iniciar sesión
router.post('/registro', registroValidator, registro);
router.post('/login', loginValidator, login);
router.post('/forgot-password', forgotPasswordValidator, forgotPassword);
router.post('/change-password', changePasswordValidator, changePassword);
router.post('/logout', logout);

module.exports = router;