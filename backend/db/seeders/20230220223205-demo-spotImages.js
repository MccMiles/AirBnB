'use strict';

/** @type {import('sequelize-cli').Migration} */

let options = { };
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;
}

const si = 
[
  {
    spotId: 1,
    url: 'Image.url',
    previewImage: true
  },
  {
    spotId: 2,
    url: 'Image.url',
    previewImage: true
  },
  {
    spotId: 3,
    url: 'Image.url',
    previewImage: true
  },
  {
    spotId: 4,
    url: 'Image.url',
    previewImage: true
  },
  {
    spotId: 5,
    url: 'Image.url',
    previewImage: true
  },
  {
    spotId: 6,
    url: 'Image.url',
    previewImage: true
  },
]
  


module.exports = {
  async up (queryInterface, Sequelize) {

    options.tableName = 'SpotImages'
    await queryInterface.bulkInsert(options, si)
  },

  async down (queryInterface, Sequelize) {

    options.tableName = 'SpotImages'
    await queryInterface.bulkDelete(options, si)
  }
};
