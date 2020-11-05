const { Model, DataTypes } = require('sequelize');
const sequelize = require('./sequilize');

class UserRepository extends Model {}
UserRepository.init({}, { sequelize, modelName: 'userRepository' });

module.exports = UserRepository;