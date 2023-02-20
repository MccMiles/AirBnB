'use strict';

/** @type {import('sequelize-cli').Migration} */

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

const locations = [
    {
      ownerId: 1,
      address: "456 Market St",
      city: "San Francisco",
      state: "California",
      country: "United States",
      lat: 37.791487,
      lng: -122.398399,
      name: "The Ocean Retreat",
      description: "A serene and luxurious beachfront property perfect for relaxation and rejuvenation",
      price: 470
    },
    {
      ownerId: 2,
      address: "789 Broadway",
      city: "New York",
      state: "New York",
      country: "United States",
      lat: 40.738527,
      lng: -73.985688,
      name: "The Sunflower Tower",
      description: "A bright and modern spot with stunning views of the city skyline",
      price: 340
    },
    {
      ownerId: 3,
      address: "321 Cherry St",
      city: "Atlanta",
      state: "Georgia",
      country: "United States",
      lat: 33.749001,
      lng: -84.385874,
      name: "The Skyline Suite",
      description: "A spacious and elegant high-rise apartment with breathtaking views of the city",
      price: 281
    },
    {
      ownerId: 4,
      address: "222 Oak St",
      city: "Chicago",
      state: "Illinois",
      country: "United States",
      lat: 41.878114,
      lng: -87.629798,
      name: "The Modern Loft",
      description: "A stylish and contemporary loft in the heart of the city, with plenty of natural light",
      price: 230
    },
    {
      ownerId: 5,
      address: "1234 Forest Ave",
      city: "Boulder Creek",
      state: "California",
      country: "United States",
      lat: 37.129764,
      lng: -122.130096,
      name: "Boulder Creek Garden Cottage",
      description: "A cozy and rustic cottage in the heart of the redwoods, perfect for a nature retreat",
      price: 195
    },
    {
      ownerId: 6,
      address: "456 Mountain Rd",
      city: "Silver City",
      state: "New Mexico",
      country: "United States",
      lat: 33.308542,
      lng: -108.611025,
      name: "Silver City Mountain Retreat",
      description: "A secluded and peaceful retreat in the mountains, with breathtaking views and hiking trails",
      price: 200
    }
]

module.exports = {
  async up (queryInterface, Sequelize) {
    options.tableName = 'Spots'
    await queryInterface.bulkInsert(options, locations)
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'Spots'
    await queryInterface.bulkInsert(options, locations)
  }
};