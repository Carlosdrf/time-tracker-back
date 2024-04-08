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
    await queryInterface.addColumn('entries', 'project_id',
      { type: Sequelize.INTEGER, references: { model: 'projects', key: 'id', onDelete: 'SET NULL' } }
    );
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.removeConstraint('entries', 'entries_project_id_foreign_idx')
    await queryInterface.removeColumn('entries', 'project_id')
  }
};
