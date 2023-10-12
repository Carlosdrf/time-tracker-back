'use strict';

const { sequelize } = require('../models');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // await queryInterface.removeConstraint('companies', 'fk_company_user_id')
    // await queryInterface.removeColumn('companies', 'user_id')
    await queryInterface.createTable('companies_users', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      company_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'companies',
          key: 'id'
        },
        onDelete: 'CASCADE'
      },
      user_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'users',
          key: 'id'
        },
        onDelete: 'CASCADE'
      }
    });
  },
  async down(queryInterface, Sequelize) {
    // await queryInterface.addColumn('companies', 'user_id', { type: Sequelize.STRING, references: { model: 'users', key: 'id' }, onDelete: 'CASCADE' })
    await queryInterface.dropTable('companies_users');
  }
};