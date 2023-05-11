"use strict";

/** @type {import('sequelize-cli').Migration} */

let options = {};
if (process.env.NODE_ENV === "production") {
  options.schema = process.env.SCHEMA;
}

const si = [
  {
    spotId: 1,
    url: "https://source.unsplash.com/random/1080x720/?beachfront,property",
    previewImage: true,
  },
  {
    spotId: 1,
    url: "https://source.unsplash.com/random/1080x720/?beachfront,property",
    previewImage: false,
  },
  {
    spotId: 1,
    url: "https://source.unsplash.com/random/1080x720/?beachfront,property",
    previewImage: false,
  },
  {
    spotId: 1,
    url: "https://source.unsplash.com/random/1080x720/?beachfront,property",
    previewImage: false,
  },
  {
    spotId: 1,
    url: "https://source.unsplash.com/random/1080x720/?beachfront,property",
    previewImage: false,
  },
  {
    spotId: 2,
    url: "https://source.unsplash.com/random/1080x720/?apartments,skyline",
    previewImage: true,
  },
  {
    spotId: 2,
    url: "https://source.unsplash.com/random/1080x720/?apartments,skyline",
    previewImage: false,
  },
  {
    spotId: 2,
    url: "https://source.unsplash.com/random/1080x720/?apartments,skyline",
    previewImage: false,
  },
  {
    spotId: 2,
    url: "https://source.unsplash.com/random/1080x720/?apartments,skyline",
    previewImage: false,
  },
  {
    spotId: 2,
    url: "https://source.unsplash.com/random/1080x720/?apartments,skyline",
    previewImage: false,
  },
  {
    spotId: 3,
    url: "https://source.unsplash.com/random/1080x720/?highrise,apartment",
    previewImage: true,
  },
  {
    spotId: 3,
    url: "https://source.unsplash.com/random/1080x720/?highrise,apartment",
    previewImage: false,
  },
  {
    spotId: 3,
    url: "https://source.unsplash.com/random/1080x720/?highrise,apartment",
    previewImage: false,
  },
  {
    spotId: 3,
    url: "https://source.unsplash.com/random/1080x720/?highrise,apartment",
    previewImage: false,
  },
  {
    spotId: 3,
    url: "https://source.unsplash.com/random/1080x720/?highrise,apartment",
    previewImage: false,
  },
  {
    spotId: 4,
    url: "https://source.unsplash.com/random/1080x720/?contemporary,loft,apartment",
    previewImage: true,
  },
  {
    spotId: 4,
    url: "https://source.unsplash.com/random/1080x720/?contemporary,loft,apartment",
    previewImage: false,
  },
  {
    spotId: 4,
    url: "https://source.unsplash.com/random/1080x720/?contemporary,loft,apartment",
    previewImage: false,
  },
  {
    spotId: 4,
    url: "https://source.unsplash.com/random/1080x720/?contemporary,loft,apartment",
    previewImage: false,
  },
  {
    spotId: 4,
    url: "https://source.unsplash.com/random/1080x720/?contemporary,loft,apartment",
    previewImage: false,
  },
  {
    spotId: 5,
    url: "https://source.unsplash.com/random/1080x720/?wilderness,cabin",
    previewImage: true,
  },
  {
    spotId: 5,
    url: "https://source.unsplash.com/random/1080x720/?wilderness,cabin",
    previewImage: false,
  },
  {
    spotId: 5,
    url: "https://source.unsplash.com/random/1080x720/?wilderness,cabin",
    previewImage: false,
  },
  {
    spotId: 5,
    url: "https://source.unsplash.com/random/1080x720/?wilderness,cabin",
    previewImage: false,
  },
  {
    spotId: 5,
    url: "https://source.unsplash.com/random/1080x720/?wilderness,cabin",
    previewImage: false,
  },
  {
    spotId: 6,
    url: "https://source.unsplash.com/random/1080x720/?rural,mountain,home",
    previewImage: true,
  },
  {
    spotId: 6,
    url: "https://source.unsplash.com/random/1080x720/?rural,mountain,home",
    previewImage: false,
  },
  {
    spotId: 6,
    url: "https://source.unsplash.com/random/1080x720/?rural,mountain,home",
    previewImage: false,
  },
  {
    spotId: 6,
    url: "https://source.unsplash.com/random/1080x720/?rural,mountain,home",
    previewImage: false,
  },
  {
    spotId: 6,
    url: "https://source.unsplash.com/random/1080x720/?rural,mountain,home",
    previewImage: false,
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
//
