'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkInsert('People', [{
        name: 'John Doe',
        isBetaMember: false
      }], {});
    */
    return queryInterface.bulkInsert('Users', [
      {
        userName: 'Steve Peters',
        email: 'admin@chromispos.com',
        password: '$2a$10$phblJQzrpY8oUVR0ldX5FOVIsvP082m6hwHQfcEGFGpdAj3wvnDQe',
        role: 'admin',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        userName: 'Employees',
        email: 'employee@chromispos.com',
        password: '$2a$10$pIDutHrn0lp08K8iq7x3j.AslEOjXlr41jqdd2yrhLvxNnwYoh0DW',
        role: 'user',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {});
  },

  down: (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkDelete('People', null, {});
    */
  }
};
