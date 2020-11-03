const { Model, DataTypes } = require('sequelize');
const Label = require('./labels');
const Repository = require('./repository');
const sequelize = require('./sequilize');
const UserRepository = require('./userRepository');

class User extends Model {}
User.init({
    username: {
        type: DataTypes.STRING, 
        allowNull: false
    }
}, { sequelize, modelName: 'user' });


Repository.belongsToMany(User, {through: UserRepository});
User.belongsToMany(Repository, {through: UserRepository});

module.exports = User;