'use strict';
/** @type {import('sequelize-cli').Migration} */

let options = { };
if(process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA; }

module.exports = {
  async up(queryInterface, Sequelize) {
    options.tableName = 'Reviews'
    await queryInterface.createTable('options', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      userId: {
        type: Sequelize.INTEGER,
        references: { model: 'Users' },
        onDelete: 'CASCADE'
      },
      spotId: {
        type: Sequelize.INTEGER,
        references: { model: 'Spots' },
        onDelete: 'CASCADE'
      },
      review: {
        type: Sequelize.STRING,
        allowNull: false
      },
      stars: {
        type: Sequelize.INTEGER,
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
    options.tableName = 'Reviews'
    await queryInterface.dropTable(options);
  }
};