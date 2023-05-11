"use strict";

/** @type {import('sequelize-cli').Migration} */

let options = {};
if (process.env.NODE_ENV === "production") {
  options.schema = process.env.SCHEMA;
}

const ri = [
  {
    reviewId: 1,
    url: "https://source.unsplash.com/random/1080x1728/?beachfront,property",
  },
  {
    reviewId: 2,
    url: "https://source.unsplash.com/random/1080x1728/?apartments,skyline",
  },
  {
    reviewId: 3,
    url: "https://source.unsplash.com/random/1080x1728/?highrise,apartment",
  },
  {
    reviewId: 4,
    url: "https://source.unsplash.com/random/1080x1728/?contemporary,loft,apartment",
  },
  {
    reviewId: 5,
    url: "https://source.unsplash.com/random/1080x1728/?wilderness,cabin",
  },
  {
    reviewId: 6,
    url: "https://source.unsplash.com/random/1080x1728/?rural,mountain,home",
  },
];

module.exports = {
  async up(queryInterface, Sequelize) {
    options.tableName = "ReviewImages";
    await queryInterface.bulkInsert(options, ri);
  },

  async down(queryInterface, Sequelize) {
    options.tableName = "ReviewImages";
    await queryInterface.bulkDelete(options, ri);
  },
};
//
