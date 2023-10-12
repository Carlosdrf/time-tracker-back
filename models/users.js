'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Users extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Users.hasMany(models.Payments, {foreignKey: 'user_id'})
      Users.hasMany(models.companies_users, {foreignKey: 'user_id'})
      Users.hasMany(models.employees, {foreignKey: 'user_id'})
      Users.hasMany(models.user_roles, {foreignKey: 'user_id'})
    }
  }
  Users.init({
    name: DataTypes.STRING,
    last_name: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    last_active: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'Users',
    timestamps: false
  });
  return Users;
};