const { Sequelize } = require('sequelize');
let sequelize;

if (process.env.MYSQL_DATABASE && process.env.MYSQL_USER && process.env.MYSQL_PASSWORD) {
    console.log('Connecting to mysqlDB')
    sequelize = new Sequelize(process.env.MYSQL_DATABASE, process.env.MYSQL_USER, process.env.MYSQL_PASSWORD, {
        host: process.env.DB_HOST ? process.env.DB_HOST : 'localhost',
        dialect: 'mysql',
        port: 3306,
        logging: false
    });
    console.log('Connected to mysqlDB')
} else {
    console.log('Connecting to memory')
    sequelize = new Sequelize('sqlite::memory:', {
        logging: false
    });
    console.log('Connected to memory')
}

module.exports = sequelize;