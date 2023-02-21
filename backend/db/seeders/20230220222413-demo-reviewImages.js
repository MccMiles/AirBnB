'use strict';

/** @type {import('sequelize-cli').Migration} */

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;
}

const ri = [
  {
    reviewId: 1,
    url: 'image.url'
  },
  {
    reviewId: 2,
    url: 'image.url'
  },
  {
    reviewId: 3,
    url: 'image.url'
  },
  {
    reviewId: 4,
    url: 'image.url'
  },
  {
    reviewId: 5,
    url: 'image.url'
  },
  {
    reviewId: 6,
    url: 'image.url'
  },
]

module.exports = {
  async up (queryInterface, Sequelize) {

   options.tableName = 'ReviewImages'
   await queryInterface.bulkInsert(options, ri)
  },

  async down (queryInterface, Sequelize) {

    options.tableName = 'ReviewImages'
    await queryInterface.bulkDelete(options, ri)
  }
};
