const Meme = require('../models/memeModel');

const obtenerMemes = async (req, res) => {
  try {
    const memes = await Meme.findAll();
    res.status(200).json(memes);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener los memes', error });
  }
};

const obtenerMemePorId = async (req, res) => {
  try {
    const meme = await Meme.findByPk(req.params.id);
    if (!meme) {
      return res.status(404).json({ message: 'Meme no encontrado' });
    }
    res.status(200).json(meme);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener el meme', error });
  }
};

const obtenerMemesPorCategoria = async (req, res) => {
  try {
    const memes = await Meme.findAll({
      where: {
        categoria: req.params.categoria, // Filtrar por la categoría en la URL
      },
    });
    if (memes.length === 0) {
      return res.status(404).json({ message: 'No se encontraron memes en esta categoría' });
    }
    res.status(200).json(memes);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener los memes por categoría', error });
  }
};

const agregarMeme = async (req, res) => {
  try {
    const { titulo, descripcion, imagen, categoria } = req.body;
    const nuevoMeme = await Meme.create({ titulo, descripcion, imagen, categoria });
    res.status(201).json(nuevoMeme);
  } catch (error) {
    res.status(500).json({ message: 'Error al agregar el meme', error });
  }
};

const actualizarMeme = async (req, res) => {
  try {
    const { titulo, descripcion, imagen, categoria } = req.body;
    const meme = await Meme.findByPk(req.params.id);
    if (!meme) {
      return res.status(404).json({ message: 'Meme no encontrado' });
    }

    // Actualizar los campos
    meme.titulo = titulo || meme.titulo;
    meme.descripcion = descripcion || meme.descripcion;
    meme.imagen = imagen || meme.imagen;
    meme.categoria = categoria || meme.categoria;

    await meme.save();
    res.status(200).json({ message: 'Meme actualizado correctamente', meme });
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar el meme', error });
  }
};

const eliminarMeme = async (req, res) => {
  try {
    const meme = await Meme.findByPk(req.params.id);
    if (!meme) {
      return res.status(404).json({ message: 'Meme no encontrado' });
    }

    await meme.destroy();
    res.status(200).json({ message: 'Meme eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar el meme', error });
  }
};

module.exports = {
  obtenerMemes,
  obtenerMemePorId,
  obtenerMemesPorCategoria,
  agregarMeme,
  actualizarMeme,
  eliminarMeme,
};
