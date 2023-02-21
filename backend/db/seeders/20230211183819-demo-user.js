'use strict';
const bcrypt = require("bcryptjs");

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}


const newUsers = [

  {
    firstName: 'Miles',
    lastName: 'Morales',
    email: 'milesmorales@avengers.com',
    username: 'WebHeaded',
    hashedPassword: bcrypt.hashSync('password')
  },
  {
    firstName: 'Sam',
    lastName: 'Wilson',
    email: 'WingedWarrior@avengers.com',
    username: 'notFalcon',
    hashedPassword: bcrypt.hashSync('password2')
  },
  {
    firstName: 'Ororo',
    lastName: 'Munroe',
    email: 'ororomunroe@xmen.com',
    username: 'Lightning_Queen',
    hashedPassword: bcrypt.hashSync('password3')
  },
  {
    firstName: 'Johnny',
    lastName: 'Blaze',
    email: 'johnnyblaze@riders.com',
    username: 'HellOnWheels',
    hashedPassword: bcrypt.hashSync('password3')
  },
  {
    firstName: 'Monica',
    lastName: 'Rambeau',
    email: 'monicarambeau@avengers.com',
    username: 'SpectrumSiren',
    hashedPassword: bcrypt.hashSync('password3')
  },
  {
    firstName: 'Kurt',
    lastName: 'Wagner',
    email: 'kurtwagner@xmen.com',
    username: 'nightKrawlerrr',
    hashedPassword: bcrypt.hashSync('password3')
  }

]


module.exports = {
  up: async (queryInterface, Sequelize) => {
    options.tableName = 'Users';
    await queryInterface.bulkInsert(options, newUsers) ;
  },

  down: async (queryInterface, Sequelize) => {
    options.tableName = 'Users';
    await queryInterface.bulkDelete(options, newUsers);
  }
};