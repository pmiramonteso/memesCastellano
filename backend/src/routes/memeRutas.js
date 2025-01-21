const express = require('express');
const { authenticateToken } = require('../middlewares/authenticateToken.js');
const memeController = require('../controllers/memeController');
const { uploadFileMiddleware } = require("../middlewares/upload");

const router = express.Router();

router.get('/', memeController.obtenerMemes);
router.get('/:id', memeController.obtenerMemePorId);
router.get('/categorias/:categoria', memeController.obtenerMemesPorCategoria);
router.post('/', uploadFileMiddleware, memeController.agregarMeme);
router.patch('/:id', uploadFileMiddleware, memeController.actualizarMeme);
router.delete('/:id', authenticateToken, memeController.eliminarMeme);

module.exports = router;
