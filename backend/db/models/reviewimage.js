'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class ReviewImage extends Model {

    static associate(models) {
      ReviewImage.belongsTo(Review, {foreignKey: 'reviewId'})
    }
  }
  ReviewImage.init({
    reviewId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'Review', key: 'id' }
    },
    url: { 
      type: DataTypes.STRING
    },

  }, {
    sequelize,
    modelName: 'ReviewImage',
  });
  return ReviewImage;
};