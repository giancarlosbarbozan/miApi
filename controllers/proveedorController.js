const Proveedor = require('../models/Proveedor');

exports.crearProveedor = async (req, res) => {
    try {
        // Obtenemos los datos enviados desde el frontend (Axios/Formik)
        const { nombre, email, telefono } = req.body;

        // Validamos si el proveedor ya existe por su email
        const existeProveedor = await Proveedor.findOne({ where: { email } });
        if (existeProveedor) {
            return res.status(400).json({ error: 'El correo de este proveedor ya está registrado.' });
        }

        // Creamos el registro en la base de datos
        const nuevoProveedor = await Proveedor.create({ nombre, email, telefono });
        
        res.status(201).json({
            message: 'Proveedor registrado exitosamente',
            proveedor: nuevoProveedor
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Hubo un error al guardar el proveedor.' });
    }
};
