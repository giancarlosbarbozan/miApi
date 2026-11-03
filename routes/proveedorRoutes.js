const express = require('express');
const router = express.Router();
const proveedorController = require('../controllers/proveedorController');
const autenticar = require('../middleware/authMiddleware');

// Ruta POST: /api/proveedores
// Protegida: Solo los roles Administrador y Almacenero pueden acceder
router.post('/', autenticar(['Administrador', 'Almacenero']), proveedorController.crearProveedor);

module.exports = router;
