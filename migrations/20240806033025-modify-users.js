'use strict';

const { sequelize } = require('../models');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    await queryInterface.removeColumn('users', 'last_active');
    await queryInterface.addColumn('users', 'createdAt', {
      type: Sequelize.DATE, allowNull: false,
    });
    await queryInterface.addColumn('users', 'updatedAt', {
      type: Sequelize.DATE, allowNull: false,
      defaultValue: Sequelize.fn("NOW"),
    });
    await queryInterface.addColumn('users', 'username', {
      type: Sequelize.DATE, allowNull: false,
      defaultValue: Sequelize.fn("NOW"),
    });
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.addColumn('users', 'last_active', {
      type: Sequelize.DATE,
    });
    await queryInterface.removeColumn('users', 'username');
    await queryInterface.removeColumn('users', 'createdAt');
    await queryInterface.removeColumn('users', 'updatedAt');
  }
};
