'use strict';

let options = { };
if(process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA; }

  module.exports = {
    async up(queryInterface, Sequelize) {
      options.tableName = 'SpotImages'
      await queryInterface.createTable(options, {
        id: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          autoIncrement: true,
          allowNull: false
        },
        spotId: {
          type: Sequelize.INTEGER,
          references: { model: 'Spots' },
          allowNull: false,
          onDelete: 'CASCADE'
        },
        url: {
          type: Sequelize.STRING,
          allowNull: false
        },
        previewImage: {
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
      options.tableName = 'SpotImages'
      await queryInterface.dropTable(options);
    }
  };