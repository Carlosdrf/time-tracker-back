'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class tasks extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      tasks.hasOne(models.entries, {foreignKey: 'task_id'})
    }
  }
  tasks.init({
    description: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'tasks',
    timestamps: false
  });
  return tasks;
};