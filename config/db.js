const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(
    process.env.DB_NAME, 
    process.env.DB_USER, 
    process.env.DB_PASS, 
    {
        host: process.env.DB_HOST,
        port: process.env.DB_PORT, // Sequelize ahora usará el 11267
        dialect: 'mysql',
        //logging: false // Para no saturar la consola con consultas SQL
        dialectOptions: {
            ssl: {
                require: true,
                rejectUnauthorized: false // Necesario para conexiones seguras en la nube
            }
        }
    }
);

module.exports = sequelize;