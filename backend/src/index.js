const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');

const authRutas = require('./routes/authRutas');
const usuarioRutas = require('./routes/usuarioRutas');
const testRoutes = require('./routes/testRutas');
const memeRutas = require('./routes/memeRutas');
const votosRutas = require('./routes/votosRutas');
const { testConnection } = require('./db');

const { insertInitialUserData } = require('./start_data');
const dotenv = require('dotenv');

const app = express();

// Middlewares
app.use(cors({
  origin: 'http://localhost:4200',
  credentials: true,
}));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

(async () => {
  await testConnection();
  await insertInitialUserData();
})();

// Configuracion de rutas
app.use('/auth', authRutas);
app.use('/usuario', usuarioRutas);
app.use('/test', testRoutes);
app.use('/api/memes', memeRutas);
app.use('/api/votos', votosRutas);

app.listen(3000, () => {
  console.log(`Servidor de Express escuchando en el puerto 3000`);
});


