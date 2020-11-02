const { Sequelize } = require('sequelize');
let sequelize = new Sequelize('sqlite::memory:');

if(false){
    sequelize = new Sequelize('libQualityDB', 'root', 'admin', {
        host: 'localhost',
        dialect: 'mysql'
    });
}

module.exports = sequelize;