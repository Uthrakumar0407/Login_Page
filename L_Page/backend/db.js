// db.js
const { Sequelize } = require('sequelize');
require('dotenv').config();

// Initialize Sequelize instance
const sequelize = new Sequelize(process.env.MYSQL_DB, process.env.MYSQL_USER, process.env.MYSQL_PASSWORD, {
    host: process.env.MYSQL_HOST || 'localhost',
    dialect: 'mysql',
    logging: false, // Set to true to see SQL queries
});

const connectDB = async () => {
    try {
        await sequelize.authenticate();
        console.log('MySQL connected');
    } catch (err) {
        console.error('MySQL connection error:', err);
        process.exit(1); // Exit the process if the connection fails
    }
};

module.exports = {
    sequelize,
    connectDB
};
