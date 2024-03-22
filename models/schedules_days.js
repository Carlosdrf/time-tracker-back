"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Schedules_Days extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Schedules_Days.init(
    {
      schedule_id: DataTypes.INTEGER,
      day_id: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "schedules_days",
      timestamps: false,
    }
  );
  return Schedules_Days;
};
