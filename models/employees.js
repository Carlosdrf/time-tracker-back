"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class employees extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      employees.belongsTo(models.users, { foreignKey: "user_id" });
      employees.belongsTo(models.companies, { foreignKey: "company_id" });
      employees.belongsTo(models.positions, { foreignKey: "position_id" });
      employees.hasMany(models.schedules, { foreignKey: 'employee_id' })
    }
  }
  employees.init(
    {
      user_id: DataTypes.INTEGER,
      company_id: DataTypes.INTEGER,
      position_id: DataTypes.INTEGER,
      hourly_rate: DataTypes.FLOAT,
    },
    {
      sequelize,
      modelName: "employees",
      timestamps: false,
      hooks: {
        beforeUpdate: async (employee, options) => {
          const previous = await sequelize.models.employees.findByPk(employee.id)

          if (employee.company_id != previous.company_id) {
            const user = await sequelize.models.users.findByPk(employee.user_id)
            const projects = await user.getProjects()
            await user.removeProjects(projects);      
            console.log('xd?')    
          }
        }
      }
    }
  );
  return employees;
};
