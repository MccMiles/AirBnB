'use strict';
/** @type {import('sequelize-cli').Migration} */

let options = { };
if(process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA; }

module.exports = {
  async up(queryInterface, Sequelize) {
    options.tableName = 'ReviewImage'
    await queryInterface.createTable(options, {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
     },
      reviewId: {
        type: Sequelize.INTEGER,
        allowNull: false, 
        references: { model: 'Reviews', key: 'id' },
        onDelete: 'CASCADE' 
      },
      url: {
        type: Sequelize.STRING, 
        allowNull: false 
      }, 
      createdAt: {
        type: Sequelize.DATE, 
        allowNull: false, 
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP")
      },
      updatedAt: {
        type: Sequelize.DATE, 
        allowNull: false, 
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP")
      }
    });
  },

  async down(queryInterface, Sequelize) {
    options.tableName = 'ReviewImages'
    await queryInterface.dropTable(options);
  }
};