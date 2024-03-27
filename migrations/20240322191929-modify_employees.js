"use strict";

const { DataTypes } = require("sequelize");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */

    await queryInterface.addColumn("employees", "position_id", {
      type: DataTypes.INTEGER,
      references: { model: "positions", key: "id", onDelete: "SET NULL" },
    });
    await queryInterface.addColumn("employees", "hourly_rate", {
      type: DataTypes.FLOAT,
    });
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.removeConstraint(
      "employees",
      "employees_position_id_foreign_idx"
    );
    await queryInterface.removeColumn("employees", "position_id");
    await queryInterface.removeColumn("employees", "hourly_rate");
  },
};
