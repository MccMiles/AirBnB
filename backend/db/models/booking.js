'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class booking extends Model {

    static associate(models) {
      Booking.belongsTo('User', { foreignKey: 'userId' });
      Booking.belongsTo('Spot', { foreignKey: 'spotId' });
    }
  }
  booking.init({
    spotId: {
      type: DataTypes.INTEGER,
      references: { model: 'Spot', key: 'id'},
      onDelete: 'CASCADE'
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'User', key: 'id'},
      onDelete: 'CASCADE'
    },
    startDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    endDate: {
      type: DataTypes.DATE,
      allowNull: false,
      validate: {
        message: "Validation Error",

        isAfterStartDate: function(currDate) {
          if (currDate <= this.startDate) {
            throw new Error('endDate cannot be on or before startDate');
          }
        }
      },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false
    }
  },
    sequelize,
    modelName: 'Booking',
  });
  return booking;

};