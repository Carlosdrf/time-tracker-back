'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Schedules extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Schedules.init({
    employee_id: DataTypes.INTEGER,
    start_time: DataTypes.DATEONLY,
    end_time: DataTypes.DATEONLY,
    approved_by: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'schedules',
  });
  return Schedules;
};