const { Model, DataTypes } = require('sequelize');
const sequelize = require('./sequilize');
const Issue = require('./issue');

class Repository extends Model {}
Repository.init({
    githubId: {
        type: DataTypes.NUMBER,
        allowNull: false
    },
    stars: {
        type: DataTypes.NUMBER,
        allowNull: false
    },
    forks: {
        type: DataTypes.NUMBER,
        allowNull: false
    },
    contributors: {
        type: DataTypes.NUMBER
    }
}, { sequelize, modelName: 'repository' });

(async () => {
    await sequelize.sync();
})();

Repository.Issues = Repository.hasMany(Issue);

module.exports = Repository;