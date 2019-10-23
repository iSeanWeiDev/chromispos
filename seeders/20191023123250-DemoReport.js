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

    return queryInterface.bulkInsert('Reports', [
      {
        name: 'salesbyday',
        detail: 'Sales by day',
        isAdmin: true,
        isUser: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'salesbymonth',
        detail: 'Sales by month',
        isAdmin: true,
        isUser: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'salesbyyear',
        detail: 'Sales by year',
        isAdmin: true,
        isUser: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'categorysales',
        detail: 'Category Sales',
        isAdmin: true,
        isUser: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'inventory',
        detail: 'Inventory',
        isAdmin: true,
        isUser: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'timeclock',
        detail: 'Time Clock',
        isAdmin: true,
        isUser: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'stockdiary',
        detail: 'Stock Diary',
        isAdmin: true,
        isUser: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'productsales',
        detail: 'Product Sales',
        isAdmin: true,
        isUser: true,
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
