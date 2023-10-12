'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class companies_users extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      companies_users.belongsTo(models.Users, {foreignKey: 'user_id'})
      companies_users.belongsTo(models.companies, {foreignKey: 'company_id'})
    }
  }
  companies_users.init({
    company_id: DataTypes.NUMBER,
    user_id: DataTypes.NUMBER
  }, {
    sequelize,
    modelName: 'companies_users',
    timestamps: false
  });
  return companies_users;
};