'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class status extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      // status.belongsTo('Payments', {foreignKey: 'id'})
      status.hasOne(models.payments, {foreignKey: 'status_id'})

    }
  }
  status.init({
    name: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'status',
    tableName:'status',
    timestamps: false
  });
  return status;
};