'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Review extends Model {

    static associate(models) {
      Review.belongsTo(models.Spot, { foreignKey: 'spotId' })
      Review.belongsTo(models.User, { foreignKey: 'userId' })
      Review.hasMany(models.ReviewImage, { foreignKey: 'reviewId', onDelete: "CASCADE" })
    }
  }
    Review.init({
      userId: {
        type: DataTypes.INTEGER
      },
      spotId: {
        type: DataTypes.INTEGER
      },
      review: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      stars: {
        type: DataTypes.INTEGER,
        validate: {
          isInt: true,
          min: 1,
          max: 5,
        }
      }      
    }, {
      sequelize,
      modelName: 'Review'
    });
  
  return Review;
};

