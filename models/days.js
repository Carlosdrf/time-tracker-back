"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Days extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Days.belongsToMany(models.schedules, { foreignKey: 'day_id', through: 'schedules_days' })
    }
  }
  Days.init(
    {
      name: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "days",
      timestamps: false,
    }
  );

  Days.addHook('afterSync', async (options) => {
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    for (const day of days) {
      await Days.findOrCreate({ where: { name: day } });
    }
  })

  return Days;
};
