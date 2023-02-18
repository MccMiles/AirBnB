'use strict';
/** @type {import('sequelize-cli').Migration} */

let options = { };
if(process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;}

  module.exports = {
    async up(queryInterface, Sequelize) {
      options.tableName = 'SpotImage'
      await queryInterface.createTable(options, {
        id: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          autoIncrement: true,
          allowNull: false
        },
        spotId: {
          type: Sequelize.INTEGER,
          references: { model: 'Spot', key: 'id' },
          allowNull: false,
          onDelete: 'CASCADE'
        },
        url: {
          type: Sequelize.STRING,
          allowNull: false
        },
        previewImg: {
          type: Sequelize.BOOLEAN,
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
      options.tableName = 'SpotImage'
      await queryInterface.dropTable(options);
    }
  };