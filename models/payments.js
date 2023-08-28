'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Payments extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Payments.belongsTo(models.Users, {foreignKey: 'user_id'})
    }
  }


  Payments.init({
    description: DataTypes.STRING,
    amount: DataTypes.FLOAT,
    user_id: DataTypes.INTEGER,
    status_id: DataTypes.INTEGER
  }, {
    sequelize,
    timestamps: false,
    modelName: 'Payments',
  });
  return Payments;
};