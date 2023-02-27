'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Spot extends Model {
    static associate(models) {
      Spot.belongsTo(models.User, { foreignKey: 'ownerId' });
      Spot.hasMany(models.Booking, { foreignKey: 'spotId', onDelete: "CASCADE" })
      Spot.hasMany(models.Review, { foreignKey: 'spotId', onDelete: "CASCADE" } )
      Spot.hasMany(models.SpotImage, { foreignKey: 'spotId', onDelete: "CASCADE" })
    }
  }
  Spot.init({
    ownerId:{ type: DataTypes.INTEGER },

    address: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: { msg: "Street address is required" }
      }
    },
    city: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: { msg: "City is required" }
      }
    },
    state: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: { msg: "State is required" }
      }
    },
    country: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: { msg: "Country is required" }
      }
    },
    lat: {
      type: DataTypes.FLOAT,
      validate: {
        isFloat: { msg: "Latitude is not valid" }
      }
    },
    lng: {
      type: DataTypes.FLOAT,
      validate: {
        isFloat: { msg: "Longitude is not valid" }
      }
    },
    name: {
      type: DataTypes.STRING,
      validate: {
        len: { args: [0, 50], msg: "Name must be less than 50 characters" }
      }
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: { msg: "Description is required" }
      }
    },
    price: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notEmpty: { msg: 'Price per day is required' }
      }
    }
  }, {
    sequelize,
    modelName: 'Spot',
  });
  return Spot;
};