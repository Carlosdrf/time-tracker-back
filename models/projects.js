'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class projects extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      projects.belongsTo(models.companies, { foreignKey: 'company_id' })
      projects.hasOne(models.entries, { foreignKey: 'project_id' })
    }
  }
  projects.init({
    name: DataTypes.STRING,
    description: DataTypes.STRING,
    active: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'projects',
  });
  return projects;
};