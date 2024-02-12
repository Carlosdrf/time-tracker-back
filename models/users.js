'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class users extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      users.hasMany(models.payments, {foreignKey: 'user_id'})
      users.hasMany(models.companies_users, {foreignKey: 'user_id'})
      users.hasMany(models.employees, {foreignKey: 'user_id'})
      users.hasMany(models.user_roles, {foreignKey: 'user_id'})
      users.hasMany(models.entries, {foreignKey: 'user_id'})
    }
  }
  users.init({
    name: DataTypes.STRING,
    last_name: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    last_active: DataTypes.DATE,
    active: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'users',
    timestamps: false
  });
  return users;
};