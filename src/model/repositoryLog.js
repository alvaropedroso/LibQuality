const { Model, DataTypes } = require('sequelize');
const sequelize = require('./sequilize');

class RepositoryLog extends Model {}
RepositoryLog.init({
    open_issues_count:{
        type: DataTypes.INTEGER,
        allowNull: false
    },
    avgAge: {
        type: DataTypes.DOUBLE,
        allowNull: false
    },
    stdAge: {
        type: DataTypes.DOUBLE,
        allowNull: false
    },
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

module.exports = RepositoryLog;