const { Model, DataTypes } = require('sequelize');
const Label = require('./labels');
const sequelize = require('./sequilize');

class Issue extends Model {}
Issue.init({
    githubId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    githubCreationDate: {
        type: DataTypes.DATE,
        allowNull: false
    }
}, { sequelize, modelName: 'issue' });

Issue.Labels = Issue.hasMany(Label);

module.exports = Issue;