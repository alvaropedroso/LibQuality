const { Model, DataTypes } = require('sequelize');
const Label = require('./labels');
const Repository = require('./repository');
const sequelize = require('./sequilize');

class UserRepository extends Model {}
UserRepository.init({}, { sequelize, modelName: 'userRepository' });

module.exports = UserRepository;