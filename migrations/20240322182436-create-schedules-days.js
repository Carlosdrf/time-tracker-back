"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("schedules_days", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      schedule_id: {
        type: Sequelize.INTEGER,
        references: {
          model: "schedules",
          key: "id",
        },
        onDelete: "CASCADE",
      },
      day_id: {
        type: Sequelize.INTEGER,
        references: {
          model: "days",
          key: "id",
        },
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("schedules_days");
  },
};
