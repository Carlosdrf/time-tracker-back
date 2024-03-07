'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class entries extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      entries.belongsTo(models.users, {foreignKey: 'user_id'})
      entries.belongsTo(models.tasks, {foreignKey: "task_id"})
    }
  }
  entries.init({
    start_time: DataTypes.DATE,
    end_time: DataTypes.DATE,
    date: DataTypes.DATE,
    status: DataTypes.INTEGER,
  }, {
    sequelize,
    modelName: 'entries',
    timestamps: false
  });
  return entries;
};