'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    await queryInterface.changeColumn('schedules', 'start_time', {
      type: Sequelize.TIME,
      allowNull: false,
    });
    await queryInterface.changeColumn('schedules', 'end_time', {
      type: Sequelize.TIME,
      allowNull: false
    })
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.changeColumn('schedules', 'start_time', {
      type: Sequelize.DATE,
      allowNull: false,
    });
    await queryInterface.changeColumn('schedules', 'end_time', {
      type: Sequelize.DATE,
      allowNull: false,
    });
  }
};
