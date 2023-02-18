'use strict';
const { Model } = require('sequelize');
const bcrypt = require('bcryptjs');
const { User } = require('./user');
const { ReviewImage } = require('./reviewImage');
const { Spot } = require('./spot'); 


module.exports = (sequelize, DataTypes) => {
  class Review extends Model {

    static associate(models) {
      Review.belongsTo(User, { foreignKey: 'userId' });
      Review.hasMany(ReviewImage, { foreignKey: 'reviewId' });
      Review.belongsTo(Spot, { foreignKey: 'ownerId' });
    }
  }
    Review.init({
      userId: {
        type: DataTypes.INTEGER,
        references: { model: 'User', key: 'id' },
        allowNull: false,
      },
      spotId: {
        type: DataTypes.INTEGER,
        references: { model: 'Spot', key: 'id' },
        allowNull: false,
      },
      review: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: {
            msg: 'A written review is required'
          }
        }  
      },
      stars: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          isInt: true,
          inRange: (n) => {
            if (n < 1 || n > 5) {
              throw new Error('Review must be between 1 and 5 stars');
            }
          }
        }
      }
    }, {
      sequelize,
      modelName: 'Review'
    });
  
  return Review;
};