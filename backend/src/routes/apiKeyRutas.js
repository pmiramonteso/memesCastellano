const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middlewares/authenticateToken');
const { 
  obtenerApiKey, 
  revocarApiKey 
} = require('../controllers/apiKeyController');
const { verificarApiKey } = require('../middlewares/verificarApiKey');

router.post('/generate', authenticateToken(['usuario', 'admin']), obtenerApiKey);
router.post('/revoke', verificarApiKey, revocarApiKey);

module.exports = router;