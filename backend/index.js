const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('¡Hola desde el servidor!');
});

app.listen(PORT, () => {
  console.log(`Servidor de Express escuchando en el puerto ${PORT}`);
});
