const express = require('express');
const { authenticateToken } = require('../middlewares/authenticateToken.js');
const { uploadFileMiddleware } = require("../middlewares/upload");
const categoriaController = require('../controllers/categoriaController');

const router = express.Router();

router.get('/', categoriaController.obtenerCategorias);
router.get('/:id', categoriaController.obtenerCategoriaPorId);
router.post('/', uploadFileMiddleware, categoriaController.agregarCategoria);
router.patch('/:id', uploadFileMiddleware, categoriaController.actualizarCategoria);
router.delete('/:id', categoriaController.eliminarCategoria);

module.exports = router;
