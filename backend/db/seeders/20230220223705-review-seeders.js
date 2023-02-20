'use strict';

/** @type {import('sequelize-cli').Migration} */


const reviews = 
[
  {
    userId: 1,
    spotId: 4,
    review: "I had an amazing time at this Airbnb. The place was spotless and had everything I needed. The location was also great with easy access to public transportation.",
    stars: 5,
  },
  {
    userId: 2,
    spotId: 3,
    review: "I had a wonderful stay at this Airbnb. The host was very welcoming and the place was exactly as described. It was clean, comfortable, and had a great view.",
    stars: 4,
  },
  {
    userId: 3,
    spotId: 2,
    review: "I enjoyed my stay at this Airbnb. The location was convenient and the apartment had all the amenities I needed. The only downside was that the street noise was a bit loud at times.",
    stars: 3,
  },
  {
    userId: 4,
    spotId: 6,
    review: "I had a great time at this Airbnb. The cabin was cozy and secluded, which was exactly what I was looking for. The host was also very helpful with recommendations for local activities.",
    stars: 5,
  },
  {
    userId: 5,
    spotId: 1,
    review: "I had a nice stay at this Airbnb. The room was comfortable and the host was friendly. The location was a bit far from the city center, but the public transportation made it easy to get around.",
    stars: 4,
  },
  {
    userId: 6,
    spotId: 5,
    review: "I had an excellent experience at this Airbnb. The space was clean and stylishly decorated, and the host was very accommodating. I would definitely recommend this place to others.",
    stars: 5,
  },
];



module.exports = {
  async up (queryInterface, Sequelize) {

    options.tableName = 'Reviews'
    await queryInterface.bulkInsert(options, reviews)
  },

  async down (queryInterface, Sequelize) {

    options.tableName = 'Reviews'
    await queryInterface.bulkDelete(options, reviews)
  }
};
