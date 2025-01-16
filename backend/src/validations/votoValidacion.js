const express = require('express');
const router = express.Router();
const { obtenerTodos, obtenerMemeById, crearMeme, actualizarMeme, eliminarMeme } = require('../controllers/memes');

router.get('/collections/:categoria', obtenerTodos);
router.get('/item/:id', obtenerMemeById);
router.post('/item', crearMeme);
router.put('/item/:id', actualizarMeme);
router.delete('/item/:id', eliminarMeme);

module.exports = router;
