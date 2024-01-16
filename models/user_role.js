'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class user_roles extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      user_roles.belongsTo(models.users, {foreignKey: 'user_id'})
      user_roles.belongsTo(models.Roles, {foreignKey: 'role_id'})
    }
  }
  user_roles.init({
    user_id: DataTypes.INTEGER,
    role_id: DataTypes.INTEGER,
  }, {
    sequelize,
    modelName: 'user_roles',
    timestamps: false
  });
  return user_roles;
};