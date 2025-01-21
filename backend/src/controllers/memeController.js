const Meme = require('../models/memeModel');
const Categorias = require('../models/categoriaModel');

const obtenerMemes = async (req, res) => {
    try {
        const memes = await Meme.findAll({
            include: { 
                model: Categorias, 
                as: 'categoria', 
                attributes: ['id', 'nombre'] 
            },
        });
        res.status(200).json(memes);
    } catch (error) {
        console.error('Error al obtener los memes:', error);
        res.status(500).json({ message: 'Error al obtener los memes.' });
    }
};

const obtenerMemePorId = async (req, res) => {
    try {
        const meme = await Meme.findByPk(req.params.id, {
            include: { 
                model: Categorias, 
                as: 'categoria', 
                attributes: ['id', 'nombre'] 
            }
        });
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
        // Obtener el nombre de la categoría desde los parámetros de la URL
        const categoriaNombre = req.params.categoria;

        // Buscar la categoría por nombre
        const categoria = await Categorias.findOne({
            where: { nombre: categoriaNombre }
        });

        // Si la categoría no se encuentra, responder con un error 404
        if (!categoria) {
            return res.status(404).json({ message: 'Categoría no encontrada' });
        }

        // Obtener los memes relacionados con esa categoría
        const memes = await Meme.findAll({
            where: {
                categoria_nombre: categoria.nombre, // Filtrar por el nombre de la categoría
            },
            include: { 
                model: Categorias, 
                as: 'categoria', 
                attributes: ['id', 'nombre'] // Incluir la categoría en los resultados
            }
        });

        // Si no hay memes en esta categoría, responder con un mensaje
        if (memes.length === 0) {
            return res.status(200).json({ message: 'No hay memes en esta categoría', memes: [] });
        }

        // Responder con los memes encontrados
        res.status(200).json(memes);
    } catch (error) {
        // Manejar cualquier error que ocurra
        console.error('Error al obtener los memes por categoría:', error);
        res.status(500).json({ message: 'Error al obtener los memes por categoría', error });
    }
};
const agregarMeme = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'La imagen es obligatoria' });
        }
        
        const { titulo, descripcion, categoria_nombre } = req.body;
        const imagen = req.file.originalname;

        // Buscar la categoría por nombre
        const categoria = await Categorias.findOne({ 
            where: { nombre: categoria_nombre }
        });

        if (!categoria) {
            return res.status(400).json({ message: 'La categoría especificada no existe.' });
        }

        // Crear el nuevo meme, usando categoria_nombre
        const nuevoMeme = await Meme.create({
            titulo,
            descripcion,
            imagen,
            categoria_nombre  // Usar categoria_nombre directamente aquí
        });

        // Traer el meme con la categoría asociada
        const memeConCategoria = await Meme.findByPk(nuevoMeme.id, {
            include: [{
                model: Categorias,
                as: 'categoria',
                attributes: ['id', 'nombre']
            }]
        });

        res.status(201).json({ 
            message: 'Meme creado con éxito.',
            meme: memeConCategoria
        });
    } catch (error) {
        console.error('Error en agregarMeme:', error);
        res.status(500).json({ message: 'Error al agregar el meme', error: error.message });
    }
};

const actualizarMeme = async (req, res) => {
    try {
        const { titulo, descripcion, categoria_nombre } = req.body;
        const imagen = req.file ? req.file.originalname : null;
        
        const meme = await Meme.findByPk(req.params.id);
        if (!meme) {
            return res.status(404).json({ message: 'Meme no encontrado' });
        }

        let categoria_id = meme.categoria_id;
        if (categoria_nombre) {
            const categoria = await Categorias.findOne({ 
                where: { nombre: categoria_nombre }
            });
            if (!categoria) {
                return res.status(400).json({ message: 'La categoría especificada no existe.' });
            }
            categoria_id = categoria.id;
        }

        meme.titulo = titulo || meme.titulo;
        meme.descripcion = descripcion || meme.descripcion;
        if (imagen) meme.imagen = imagen;
        meme.categoria_id = categoria_id;

        await meme.save();

        const memeActualizado = await Meme.findByPk(meme.id, {
            include: [{
                model: Categorias,
                as: 'categoria',
                attributes: ['id', 'nombre']
            }]
        });

        res.status(200).json({ 
            message: 'Meme actualizado correctamente', 
            meme: memeActualizado 
        });
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