'use strict';

/** @type {import('sequelize-cli').Migration} */

let options = { };
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA; 
};

const bookingDates = [
  {
    spotId: 1,
    userId: 1,
    startDate: new Date('2023-10-12'),
    endDate: new Date('2023-10-17')
  },
  {
    spotId: 2,
    userId: 2,
    startDate: new Date('2023-11-23'),
    endDate: new Date('2023-11-27')
  },
  {
    spotId: 3,
    userId: 3,
    startDate: new Date('2023-12-08'),
    endDate: new Date('2023-12-13')
  },
  {
    spotId: 4,
    userId: 4,
    startDate: new Date('2023-09-21'),
    endDate: new Date('2023-09-25')
  },
  {
    spotId: 5,
    userId: 5,
    startDate: new Date('2023-08-15'),
    endDate: new Date('2023-08-20')
  },
  {
    spotId: 6,
    userId: 6,
    startDate: new Date('2023-07-02'),
    endDate: new Date('2023-07-06')
  },
];

module.exports = {
  async up (queryInterface, Sequelize) {

    options.tableName = 'Bookings'
    await queryInterface.bulkInsert(options, bookingDates)
  },

  async down (queryInterface, Sequelize) {

    options.tableName = 'Bookings'
    await queryInterface.bulkDelete(options, bookingDates)
  }
};
