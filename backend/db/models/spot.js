'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Spot extends Model {
    static associate(models) {
      Spot.belongsTo(User, {foreignKey: 'ownerId'})
      Spot.hasMany(SpotImage, {foreignKey: 'spotId'})
      Spot.hasMany(Booking, {foreignKey: 'spotId'})
      Spot.hasMany(Review, {foreignKey: 'spotId'})
    }
  }
  Spot.init({
    ownerId:{
    type: DataTypes.INTEGER,
    references: { model: 'Review', key: 'userId' },
    },
    address: {
      type: DataTypes.STRING,
      notEmpty: true,
      allowNull: false
    },
    city: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    state: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    country: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    lat: {
      type: DataTypes.FLOAT,
    },
    lng: {
      type: DataTypes.FLOAT
    },
    name: {
      type: DataTypes.STRING
    },
    description: {
      type: DataTypes.STRING
    },
    price: {
      type: DataTypes.INTEGER
    },
  }, {
    sequelize,
    modelName: 'Spot',
  });
  return Spot;
};