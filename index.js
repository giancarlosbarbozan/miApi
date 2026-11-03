const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const sequelize = require('./config/db');
require('dotenv').config();

// Importar Modelos para que Sequelize los registre
const Producto = require('./models/Producto');

const app = express();

// (Conserva los imports y configuraciones previas)

const authRoutes = require('./routes/authRoutes');
const autenticar = require('./middleware/authMiddleware');

// Registrar un modelo más para el syncing
const Usuario = require('./models/Usuario');


// Parsear el body de las peticiones a JSON
app.use(express.json());

// 1. Importar las rutas del proveedor (Agrégalo debajo de tus otras importaciones de rutas)
const proveedorRoutes = require('./routes/proveedorRoutes');

// 2. Importar el Modelo para que Sequelize lo sincronice (cree la tabla)
const Proveedor = require('./models/Proveedor');

// 3. Registrar la ruta base (Agrégalo donde defines app.use('/api/auth', ...))
app.use('/api/proveedores', proveedorRoutes);



// --- MIDDLEWARES ---
// --- PROTECCIÓN CONTRA ATAQUES COMUNES ---

// 1. HELMET: Protege contra XSS y otras vulnerabilidades de cabecera HTTP
app.use(helmet());

// Habilitar CORS para permitir peticiones desde el frontend (React)
// 2. CORS: Configuración restrictiva (reemplazar por la URL de tu React cuando esté en producción)
// Por ahora permitimos localhost:5173 (Vite), lo cual previene peticiones de orígenes no autorizados.
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// Rutas de autenticación abiertas para todos
app.use('/api/auth', authRoutes);

// 3. RATE LIMIT: Previene ataques de Fuerza Bruta y DoS limitando las peticiones por IP
const limitador = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutos
    max: 100, // Máximo 100 peticiones por IP en ese lapso
    message: 'Demasiadas peticiones desde esta IP, por favor intente más tarde.'
});

app.use('/api/', limitador); // Aplica a todas las rutas que comiencen con /api/

 

// --- RUTAS BÁSICAS DE PRUEBA ---
app.get('/', (req, res) => {
    res.send('¡API Backend funcionando exitosamente!');
});

// --- SINCRONIZACIÓN Y ARRANQUE ---
const PORT = process.env.PORT || 3306;

// --- RUTAS CRUD PARA PRODUCTOS ---

// --- EJEMPLO DE RUTA PROTEGIDA ---
// Solo administradores o almaceneros pueden ver la lista

// 1. POST: Crear un nuevo producto (Hace funcionar el botón Guardar)
app.post('/api/productos', async (req, res) => {
    try {
        const nuevoProducto = await Producto.create(req.body);
        res.status(201).json(nuevoProducto);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// 2. GET: Obtener todos los productos (Hace funcionar la Lista de Productos)
app.get('/api/productos', autenticar(['Administrador', 'Almacenero']), async (req, res) => {
    try {
        const productos = await Producto.findAll();
        res.json(productos);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// 3. PUT: Actualizar un producto existente (Hace funcionar el botón Editar)
app.put('/api/productos/:id', autenticar(['Administrador', 'Almacenero']), async (req, res) => {
    try {
        await Producto.update(req.body, {
            where: { id: req.params.id }
        });
        res.json({ message: 'Producto actualizado' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// 4. DELETE: Eliminar un producto (Hace funcionar el botón Eliminar)
app.delete('/api/productos/:id', autenticar(['Administrador', 'Almacenero']), async (req, res) => {
    try {
        await Producto.destroy({
            where: { id: req.params.id }
        });
        res.json({ message: 'Producto eliminado' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


// force: false evita que se borren los datos cada vez que se reinicia el servidor
sequelize.sync({ force: false }) 
    .then(() => {
        console.log('Base de datos conectada y sincronizada.');
        app.listen(PORT, () => {
            console.log(`Servidor corriendo en http://localhost:${PORT}`);
        });
    })
    .catch(error => {
        console.error('Error al conectar con la base de datos:', error);
    });




