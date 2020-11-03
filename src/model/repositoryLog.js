const { Model, DataTypes } = require('sequelize');
const sequelize = require('./sequilize');
const Issue = require('./issue');
const User = require('./user');
const Repository = require('./repository');

class RepositoryLog extends Model {}
RepositoryLog.init({
    stars: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    forks: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    contributors: {
        type: DataTypes.INTEGER,
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
RepositoryLog.User = RepositoryLog.belongsTo(User);
RepositoryLog.Repository = RepositoryLog.belongsTo(Repository);
Repository.RepositoryLog = Repository.hasMany(RepositoryLog);


module.exports = RepositoryLog;