const { DataTypes } = require('sequelize');
const { sequelize } = require('../db.js');

const Memes = sequelize.define('memes', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
  titulo: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  descripcion: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  imagen: {
    type: DataTypes.BLOB('long'),
    allowNull: false,
  },
  categoria: {
    type: DataTypes.STRING(50),
    allowNull: false,
  },
  fecha_creacion: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
}, {
  tableName: 'memes',
  timestamps: false,
});

module.exports = Memes;
