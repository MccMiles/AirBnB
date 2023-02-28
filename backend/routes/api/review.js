const express = require('express');
const router = express.Router();

const { Review, User, Spot, ReviewImage, SpotImage } = require('../../db/models');
const { check } = require('express-validator');
const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { handleValidationErrors } = require('../../utils/validation');

const validateReviews = [
    check('review')
    .exists({checkFalsy: true})
    .withMessage("Review text is required"),
    check('stars')
    .exists({checkFalsy: true})
    .isDecimal()
    .withMessage("Stars must be an integer from 1 to 5"),
    handleValidationErrors
];


//Get All Reviews of Current User

router.get('/current', requireAuth, async (req, res) => {
    const reviews = await Review.findAll({
      attributes: ['id', 'userId', 'spotId', 'review', 'stars', 'createdAt', 'updatedAt'],
      include: [
        {
          model: User,
          attributes: ['id', 'firstName', 'lastName']
        },
        {
          model: Spot,
          attributes: ['id', 'ownerId', 'address', 'city', 'state', 'country', 'lat', 'lng', 'name', 'price'],
          include: [{ model: SpotImage, attributes: ['previewImage', 'url'] }]
        },
        {
          model: ReviewImage,
          attributes: ['id', 'url']
        }
      ]
    });
  
    const formattedReviews = reviews.map(review => {
      const formattedReview = {
        id: review.id,
        userId: review.userId,
        spotId: review.spotId,
        review: review.review,
        stars: review.stars,
        createdAt: review.createdAt,
        updatedAt: review.updatedAt,
        User: {
          id: review.User.id,
          firstName: review.User.firstName,
          lastName: review.User.lastName
        },
        Spot: {
          id: review.Spot.id,
          ownerId: review.Spot.ownerId,
          address: review.Spot.address,
          city: review.Spot.city,
          state: review.Spot.state,
          country: review.Spot.country,
          lat: review.Spot.lat,
          lng: review.Spot.lng,
          name: review.Spot.name,
          price: review.Spot.price,
          previewImage: review.Spot.SpotImages.find(image => image.previewImage === true)?.url || null
        },
        ReviewImages: review.ReviewImages
      };
      return formattedReview;
    });
  
    return res.json({ Reviews: formattedReviews });
  });
  
  


//Add an Image to Review on Review id

router.post('/:reviewId/images', requireAuth, async(req, res) => {
    const currentReview = await Review.findByPk(req.params.reviewId);
    if(!currentReview) return res.status(404).json({ message: "Review couldn't be found", statusCode: 404 });

    const reviewImages = await ReviewImage.findAll({ where: { reviewId: req.params.reviewId } });
    if (reviewImages.length >= 10) {
        return res.status(403).json({ message: "Maximum number of images for this resource was reached", statusCode: 403 });
    }

    const { url } = req.body;
    const reviewImage = await ReviewImage.create({ url, reviewId: req.params.reviewId });

    const resObj = {
        id: reviewImage.id,
        url: reviewImage.url
    }
    return res.status(200).json(resObj);
});

  

// Edit a Review
router.put('/:reviewId', requireAuth, async (req, res) => {

    const review = await Review.findByPk(req.params.reviewId);
  
    if (!review) {
      return res.status(404).json({ message: "Review couldn't be found", statusCode: 404 });
    }
  
    const { review: updatedReview, stars: updatedStars } = req.body;
    const errors = {};
  
    if (!updatedReview) {
      errors.review = "Review text is required";
    }
  
    if (!Number.isInteger(parseInt(updatedStars)) || updatedStars < 1 || updatedStars > 5) {
      errors.stars = "Stars must be an integer from 1 to 5";
    }
  
    if (Object.keys(errors).length > 0) {
      return res.status(400).json({ message: "Validation error", statusCode: 400, errors });
    }
  
    await review.update({ review: updatedReview, stars: updatedStars });
  
    const { id, userId, spotId, review: text, stars, createdAt, updatedAt } = review;
    const resObj = { id, userId, spotId, review: text, stars, createdAt, updatedAt };
  
    return res.status(200).json(resObj);
  });
  
  

// Delete a Review
router.delete('/:reviewId', requireAuth, async(req, res) => {

    const user = req.user.id;
    const toDelete =  await Review.findByPk(req.params.reviewId);
    
    if(toDelete && user === toDelete.userId) {
        await toDelete.destroy();

        return res.status(200).json({ message: "Successfully deleted", statusCode: 200 })
    } else {

        return res.status(404).json({ message: "Review couldn't be found", statusCode: 404 })
    }
});


module.exports = router;