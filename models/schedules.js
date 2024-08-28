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
      Schedules.belongsTo(models.employees, { foreignKey: 'employee_id' })
      Schedules.belongsTo(models.users, { foreignKey: 'approved_by' })
      Schedules.belongsToMany(models.days, {foreignKey: 'schedule_id', through: 'schedules_days'})
    }
  }
  Schedules.init({
    employee_id: DataTypes.INTEGER,
    start_time: {
      type: DataTypes.TIME,
      // get() {
      //   return this.getDataValue('start_time').toTimeString().split(" ")[0]
      // },
      // set(value) {
      //   this.setDataValue('start_time', `1970-01-01T${value}:00Z`); // Usar una fecha fija
      // }
    },
    end_time: {
      type: DataTypes.TIME,
      // get() {
      //   return this.getDataValue('end_time').toTimeString().split(' ')[0]; // Solo devolver la parte del tiempo
      // },
      // set(value) {
      //   this.setDataValue('end_time', `1970-01-01T${value}:00Z`); // Usar una fecha fija
      // }
    },
    approved_by: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'schedules',
  });
  return Schedules;
};