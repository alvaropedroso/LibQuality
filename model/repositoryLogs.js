const { Model, DataTypes } = require('sequelize');
const sequelize = require('./sequilize');
const Issue = require('./issue');
const User = require('./user');

class RepositoryLogs extends Model {}
RepositoryLogs.init({
    stars: {
        type: DataTypes.NUMBER,
        allowNull: false
    },
    forks: {
        type: DataTypes.NUMBER,
        allowNull: false
    },
    contributors: {
        type: DataTypes.NUMBER,
    },
    cron_execution:{
        type: DataTypes.BOOLEAN,
        defaultValue: false
    }
}, { sequelize, modelName: 'repositoryLog' });

(async () => {
    await sequelize.sync();
})();

RepositoryLogs.Issues = RepositoryLogs.hasMany(Issue);
RepositoryLogs.User = RepositoryLogs.hasOne(User);

module.exports = RepositoryLogs;