const { Model, DataTypes } = require('sequelize');
const sequelize = require('./sequilize');
const Issue = require('./issue');
const User = require('./user');
const Repository = require('./repository');

class RepositoryLog extends Model {}
RepositoryLog.init({
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
    cron:{
        type: DataTypes.BOOLEAN,
        defaultValue: false
    }
}, { sequelize, modelName: 'repositoryLog' });

(async () => {
    await sequelize.sync();
})();

RepositoryLog.Issues = RepositoryLog.hasMany(Issue);
RepositoryLog.User = RepositoryLog.hasOne(User);
RepositoryLog.Repository = RepositoryLog.belongsTo(Repository);
Repository.RepositoryLog = Repository.hasMany(RepositoryLog);


module.exports = RepositoryLog;