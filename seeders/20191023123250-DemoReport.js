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
        type: 'desktop',
        isAdmin: true,
        isUser: false,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'salesbymonth',
        detail: 'Sales by month',
        type: 'desktop',
        isAdmin: true,
        isUser: false,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'salesbyyear',
        detail: 'Sales by year',
        type: 'desktop',
        isAdmin: true,
        isUser: false,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'categorysales',
        detail: 'Category Sales',
        type: 'desktop',
        isAdmin: true,
        isUser: false,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'inventory',
        detail: 'Inventory',
        type: 'desktop',
        isAdmin: true,
        isUser: false,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'timeclock',
        detail: 'Time Clock',
        type: 'desktop',
        isAdmin: true,
        isUser: false,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'stockdiary',
        detail: 'Stock Diary',
        type: 'desktop',
        isAdmin: true,
        isUser: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'productsales',
        detail: 'Product Sales',
        type: 'desktop',
        isAdmin: true,
        isUser: false,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'warehousemover',
        detail: 'Warehouse Mover',
        type: 'desktop',
        isAdmin: true,
        isUser: false,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'inventorytransfer',
        detail: 'Inventory Transfer',
        type: 'desktop',
        isAdmin: true,
        isUser: false,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'mstockdiary',
        detail: 'Stock Diary',
        type: 'mobile',
        isAdmin: true,
        isUser: false,
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
