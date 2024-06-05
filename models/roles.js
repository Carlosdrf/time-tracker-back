'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class roles extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      roles.belongsToMany(models.users, { foreignKey: 'role_id', through: models.user_roles })
    }
  }
  roles.init({
    name: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'roles',
    timestamps: false
  });

  roles.addHook('afterSync', async () => {
    const roleList = ['Admin', 'Employee', 'Employer'];
    for (let role of roleList) {
      await roles.findOrCreate({ where: { name: role } })
    }
  })
  return roles;
};