"use strict";

/** @type {import('sequelize-cli').Migration} */

let options = {};
if (process.env.NODE_ENV === "production") {
  options.schema = process.env.SCHEMA;
}

const si = [
  {
    spotId: 1,
    url: "https://source.unsplash.com/random/?beachfront,property",
    previewImage: true,
  },
  {
    spotId: 2,
    url: "https://source.unsplash.com/random/?apartments,skyline",
    previewImage: true,
  },
  {
    spotId: 3,
    url: "https://source.unsplash.com/random/?highrise,apartment",
    previewImage: true,
  },
  {
    spotId: 4,
    url: "https://source.unsplash.com/random/?contemporary,loft,apartment",
    previewImage: true,
  },
  {
    spotId: 5,
    url: "https://source.unsplash.com/random/?wilderness,cabin",
    previewImage: true,
  },
  {
    spotId: 6,
    url: "https://source.unsplash.com/random/?rural,mountain,home",
    previewImage: true,
  },
];

module.exports = {
  async up(queryInterface, Sequelize) {
    options.tableName = "SpotImages";
    await queryInterface.bulkInsert(options, si);
  },

  async down(queryInterface, Sequelize) {
    options.tableName = "SpotImages";
    await queryInterface.bulkDelete(options, si);
  },
};
