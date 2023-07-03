'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    return await queryInterface.sequelize.transaction(t=>{
      return Promise.all([
        queryInterface.addColumn('users', 'name', {
          type: Sequelize.DataTypes.STRING, after: 'id'}, {transaction: t}),
        // queryInterface.sequelize.query("ATLER TABLE `users` ADD `name` varchar(100) AFTER `id`;", {raw: true}),
        queryInterface.removeColumn('users', 'first_name', {transaction: t})
      ])
    })
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    return await queryInterface.sequelize.transaction(t=>{
      return Promise.all([
        queryInterface.removeColumn('users', 'name', {transaction:t}),
        queryInterface.addColumn('users', 'first_name', {type: Sequelize.DataTypes.STRING, after: 'id'}, {transaction: t})
      ])
    })
  }
};
