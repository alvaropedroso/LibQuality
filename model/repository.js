const { Model, DataTypes } = require('sequelize');
const sequelize = require('./sequilize');
const Issue = require('./issue');

class Repository extends Model {}
Repository.init({
    owner: {
        type: DataTypes.STRING,
        allowNull: false
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, { sequelize, modelName: 'repository' });


module.exports = Repository;