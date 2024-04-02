'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class users_notifications extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      users_notifications.belongsTo(models.users, {foreignKey: 'user_id'})
      users_notifications.belongsTo(models.notifications, {foreignKey: 'notification_id'})
      users_notifications.belongsTo(models.notifications_status, {foreignKey: 'status'})
    }
  }
  users_notifications.init({
    user_id: DataTypes.INTEGER,
    notification_id: DataTypes.INTEGER,
    status: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'users_notifications',
  });
  return users_notifications;
};