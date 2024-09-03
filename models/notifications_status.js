"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class notifications_status extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      notifications_status.hasMany(models.users_notifications, {
        foreignKey: "status",
      });
    }
  }
  notifications_status.init(
    {
      name: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "notifications_status",
      freezeTableName: true,
    }
  );
  return notifications_status;
};
