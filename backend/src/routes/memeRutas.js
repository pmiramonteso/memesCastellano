const express = require('express');
const router = express.Router();
const memeController = require('../controllers/memeController');

router.get('/', memeController.obtenerMemes);
router.get('/:id', memeController.obtenerMemePorId);
router.get('/categoria/:categoria', memeController.obtenerMemesPorCategoria);
router.post('/', memeController.agregarMeme);
router.patch('/:id', memeController.actualizarMeme);
router.delete('/:id', memeController.eliminarMeme);

module.exports = router;
