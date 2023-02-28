"use strict";

let options = { };
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA; 
}

  module.exports = {
    async up(queryInterface, Sequelize) {
      options.tableName = 'Users';
      await queryInterface.createTable(options, {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true
      },
      firstName:{
        type: Sequelize.STRING,
        unique: true,
        allowNull: false,
      },
      lastName:{
        type: Sequelize.STRING,
        allowNull: false
      },
      username: {
        type: Sequelize.STRING(30),
        allowNull: false,
        unique: true
      },
      email: {
        type: Sequelize.STRING(256),
        allowNull: false,
        unique: true
      },
      hashedPassword: {
        type: Sequelize.STRING.BINARY,
        allowNull: false
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    }, options);
  },
  async down(queryInterface, Sequelize) {
    options.tableName = 'Users';
    await queryInterface.dropTable(options);
  }
};