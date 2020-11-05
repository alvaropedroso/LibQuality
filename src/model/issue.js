const { Model, DataTypes } = require('sequelize');
const sequelize = require('./sequilize');

class Issue extends Model {}
Issue.init({
    githubCreationDate: {
        type: DataTypes.DATE,
        allowNull: false
    }
}, { sequelize, modelName: 'issue' });

module.exports = Issue;