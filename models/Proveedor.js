const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Proveedor = sequelize.define('Proveedor', {
    nombre: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            isEmail: true
        }
    },
    telefono: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    tableName: 'proveedores', // Fuerza el nombre correcto en la base de datos
    timestamps: true
});

module.exports = Proveedor;

