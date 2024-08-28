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
      users.hasMany(models.payments, { foreignKey: 'user_id' })
      users.belongsToMany(models.companies, {foreignKey: 'user_id', through: models.companies_users})
      users.hasMany(models.employees, { foreignKey: 'user_id' })
      users.belongsToMany(models.roles, { foreignKey: 'user_id', through: models.user_roles })
      users.hasMany(models.entries, { foreignKey: 'user_id' })
      users.belongsToMany(models.notifications, { through: models.users_notifications, foreignKey: 'user_id' })
      users.hasMany(models.schedules, { foreignKey: 'approved_by' })
      users.belongsToMany(models.projects, {through: 'users_projects'})
    }
  }
  users.init({
    name: DataTypes.STRING,
    last_name: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    active: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'users',
    // timestamps: true,
    defaultScope: {
      attributes: { exclude: ['password'] }
    }
  });
  return users;
};