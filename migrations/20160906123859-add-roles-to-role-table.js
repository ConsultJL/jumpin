'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return [
      queryInterface.bulkInsert("Roles", [
        { id: 1, name: "Student", createdAt: Date.now(), updatedAt: Date.now() },
        { id: 2, name: "Teacher", createdAt: Date.now(), updatedAt: Date.now() }
      ])
    ];
  },

  down: function (queryInterface, Sequelize) {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.dropTable('users');
    */
  }
};
