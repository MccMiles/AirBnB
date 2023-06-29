'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class SpotImage extends Model {

    
    static associate(models) {
      SpotImage.belongsTo(models.Spot, { foreignKey: 'spotId' })
    }

    static async newImage({ url, previewImage }) {
      const img = await SpotImage.create({ url, previewImage });
      return await SpotImage.findByPk(img.id)
    }
  
  }
  SpotImage.init({
    spotId: { 
      type: DataTypes.INTEGER,
      allowNull: false
    },
    url:{ 
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isUrl: true
      }
    },
    previewImage: {
      type: DataTypes.BOOLEAN,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'SpotImage',
    defaultScope: {
      attributes: {
        exclude: [ 'spotId', 'createdAt', 'updatedAt' ]
      }

    }
  });
  return SpotImage;
};