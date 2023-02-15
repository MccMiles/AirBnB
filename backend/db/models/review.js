'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class review extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Review.belongsTo(model.User, { foreignKey: 'userId' });
      Review.hasMany(model.ReviewImage, { foreignKey: 'reviewId' });
      Review.belongsTo(model.Spot, { foreignKey: 'ownerId' });
    }
  }
  review.init({
    userId: {
      type: DataTypes.INTEGER,
      references: { model: 'user', key: 'id'},
      allowNull: false,
    },
    spotId: {
      type: DataTypes.INTEGER,
      references: { model: 'spot', key: 'id'},
      allowNull: false,
    },
    review: {
      type: DataTypes.STRING,
      allowNull:false,
      validate: {
        notEmpty: {
          msg: 'a written review is required'
        }
      }
      
    } ,
    stars: {
      type: DataTypes.DECIMAL,
      allowNull: false,
      validate: {
        isInt: true,
        min: 1,
        max: 5,
        msg: 'review must be between 1 and 5 stars'
      }
  },
    sequelize,
    modelName: 'review',
  });
  return review;
};