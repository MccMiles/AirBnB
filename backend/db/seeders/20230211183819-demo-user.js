"use strict";
/** @type {import('sequelize-cli').Migration} */

const bcrypt = require("bcryptjs");

let options = {};
if (process.env.NODE_ENV === "production") {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}


const newUsers = [

  {
    firstName: "Miles",
    lastName: "Morales",
    username: "WebHeaded",
    email: "milesmorales@gmail.com",
    hashedPassword: bcrypt.hashSync("PD2by7pk-mtTpjnD2WVBMvPBdQ41hoJbw1SM")
  },
  {
    firstName: "Sam",
    lastName: "Wilson",
    username: "notFalcon",
    email: "WingedWarrior@gmail.com",
    hashedPassword: bcrypt.hashSync("LhDjU1P4-huZKRem7bNkmBpFUAV_IEjO_ZnY")
  },
  {
    firstName: "Ororo",
    lastName: "Munroe",
    username: "LightQueen",
    email: "ororomunroe@gmail.com",
    hashedPassword: bcrypt.hashSync("QdIV02ip-ZcQ21qBesLj8wBr1qPJuT9ovK1k")
  },
  {
    firstName: "Johnny",
    lastName: "Blaze",
    username: "HellOnWheels",
    email: "johnnyblaze@gmail.com",
    hashedPassword: bcrypt.hashSync("hjsFsYev-WxscHjL5F_JB2OrLILoY4EHOJUE")
  },
  {
    firstName: "Monica",
    lastName: "Rambeau",
    username: "SpectraSiren",
    email: "monicarambeau@gmail.com",
    hashedPassword: bcrypt.hashSync("8Zadj3c2-3MGUL6cTokfIPvNnba8-Jaezfsg")
  },
  {
    firstName: "Kurt",
    lastName: "Wagner",
    username: "nightKrawl",
    email: "kurtwagner@gmail.com",
    hashedPassword: bcrypt.hashSync("EdoWl7ZM-yU596Rcldg4b3XC4VQZl7hzXfIs")
  }

]


module.exports = {
  up: async (queryInterface, Sequelize) => {
    options.tableName = "Users";
    await queryInterface.bulkInsert(options, newUsers) ;
  },

  down: async (queryInterface, Sequelize) => {
    options.tableName = "Users";
    await queryInterface.bulkDelete(options, newUsers);
  }
};