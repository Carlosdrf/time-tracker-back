'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class payments extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      payments.belongsTo(models.users, {foreignKey: 'user_id'})
      payments.belongsTo(models.status, {foreignKey: 'status_id'})
      payments.belongsTo(models.currencies, {foreignKey: 'currency_id'})
    }
  }


  payments.init({
    description: DataTypes.STRING,
    amount: DataTypes.FLOAT,
    user_id: DataTypes.INTEGER,
    status_id: DataTypes.INTEGER,
    created_at: DataTypes.DATE,
    updated_at: DataTypes.DATE
  }, {
    sequelize,
    timestamps: false,
    tableName:'payments',
    modelName: 'payments',
  });
  return payments;
};