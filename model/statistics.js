const { Model, DataTypes } = require('sequelize');
const Repository = require('./repository');
const sequelize = require('./sequilize');

class Statistics extends Model {}
Statistics.init({
    executionTime: {
        type: DataTypes.DATE,
        allowNull: false
    }
}, { sequelize, modelName: 'statistics' });

(async () => {
    await sequelize.sync();
})();

Statistics.Repositories = Issue.hasMany(Repository);

module.exports = Statistics;