const { Model, DataTypes } = require('sequelize');
const sequelize = require('./sequilize');

class Label extends Model {}
Label.init({
    githubId: {
        type: DataTypes.NUMBER,
        allowNull: false
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, { sequelize, modelName: 'label' });

module.exports = Label;