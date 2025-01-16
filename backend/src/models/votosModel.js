const { DataTypes } = require('sequelize');
const { sequelize } = require('../db.js');
const Memes = require('./memeModel.js');

const Voto = sequelize.define('Voto', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true, // Valores únicos incrementales
  },
  tipo_voto: {
    type: DataTypes.INTEGER, // 1: "No me gusta", 2: "Me gusta", 3: "Me encanta"
    allowNull: false,
  },
}, {
  tableName: 'votos',
  timestamps: false,
});

// Relación: Un meme puede tener muchos votos
Memes.hasMany(Voto, { foreignKey: 'meme_id', onDelete: 'CASCADE' });
Voto.belongsTo(Memes, { foreignKey: 'meme_id' });

module.exports = Voto;
