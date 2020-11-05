const { Sequelize } = require('sequelize');
let sequelize;

if (process.env.MYSQL_DATABASE && process.env.MYSQL_USER && process.env.MYSQL_PASSWORD) {
    console.log('Connecting to mysqlDB')
    sequelize = new Sequelize(process.env.MYSQL_DATABASE,process.env.MYSQL_USER, process.env.MYSQL_PASSWORD, {
        host: 'localhost',
        dialect: 'mysql'
    });
} else {
    console.log('Connecting to memory')
    sequelize = new Sequelize('sqlite::memory:');
}

module.exports = sequelize;