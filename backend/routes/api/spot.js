const express = require("express");

const { requireAuth } = require("../../utils/auth");
const { SpotImage, Review, ReviewImage, Booking } = require("../../db/models");
const { User } = require("../../db/models");
const { Spot } = require("../../db/models");

const { check } = require("express-validator");
const { handleValidationErrors } = require("../../utils/validation");

const router = express.Router();
// res.status(201).json(data);

const validateSpot = [
  check("address")
    .exists({ checkFalsy: true })
    .withMessage("Street address is required"),
  check("city")
    .exists({ checkFalsy: true })
    .isString()
    .withMessage("City is required"),
  check("state")
    .exists({ checkFalsy: true })
    .isString()
    .withMessage("State is required"),
  check("country")
    .exists({ checkFalsy: true })
    .isString()
    .withMessage("Country is required"),
  check("lat")
    .exists({ checkFalsy: true })
    .isDecimal()
    .withMessage("Latitude is not valid"),
  check("lng")
    .exists({ checkFalsy: true })
    .isDecimal()
    .withMessage("Longitude is not valid"),
  check("name")
    .exists({ checkFalsy: true })
    .isString()
    .withMessage("Name must be less than 50 characters"),
  check("description")
    .exists({ checkFalsy: true })
    .isString()
    .withMessage("Description is required"),
  check("price")
    .exists({ checkFalsy: true })
    .isNumeric()
    .withMessage("Price per day is required"),
  handleValidationErrors,
];

// module.exports = {
//   validateSpot,
// };

const validateReview = (req, res, next) => {
  const { review, stars } = req.body;

  const errors = {};

  if (!review || review.trim().length === 0) {
    errors.review = "Review text is required";
  }

  if (!stars || stars < 1 || stars > 5) {
    errors.stars = "Stars must be an integer from 1 to 5";
  }

  if (Object.keys(errors).length > 0) {
    return res.status(400).json({
      message: "Validation error",
      statusCode: 400,
      errors,
    });
  }

  next();
};

const validateBooking = [
  check("startDate")
    .exists()
    .isBefore("endDate")
    .isDate()
    .withMessage("endDate cannot be on or before startDate"),

  check("endDate")
    .exists()
    .isAfter("startDate")
    .isDate()
    .withMessage("endDate cannot be on or before startDate"),
];

// const validateBooking = [
//     check('startDate')
//       .exists()
//       .isISO8601()
//       .isBefore('endDate')
//       .withMessage('endDate cannot be on or before startDate'),

//Get All Spots

router.get("/", async (req, res) => {
  let { page, size } = req.query;

  page = Number(page);
  size = Number(size);

  if (Number.isNaN(page) || size < 0) page = 1;
  if (Number.isNaN(size) || size < 0) size = 20;

  let Spots = [];

  Spots = await Spot.findAll({
    limit: size,
    offset: Math.abs(size * (page - 1)),
    attributes: [
      "id",
      "ownerId",
      "address",
      "city",
      "state",
      "country",
      "lat",
      "lng",
      "name",
      "description",
      "price",
      "createdAt",
      "updatedAt",
    ],
  });

  for await (let spot of Spots) {
    const data = await Review.findAll({
      where: { spotId: spot.id },
    });

    if (data.length) {
      let sum = 0;

      data.forEach((rate) => {
        sum += rate.stars;
      });

      let avg = sum / data.length;

      spot.dataValues.avgRating = avg;
    } else {
      spot.dataValues.avgRating = null;
    }

    const previewImage = await SpotImage.findOne({
      where: { spotId: spot.id, previewImage: true },
    });

    if (previewImage) spot.dataValues.previewImage = previewImage.url;
  }

  return res.json({ Spots, page, size });
});

//Get All spots owned by Current User

router.get("/current", requireAuth, async (req, res) => {
  const userId = req.user.id;

  const ownedSpots = await Spot.findAll({
    where: {
      ownerId: userId,
    },
    attributes: [
      "id",
      "ownerId",
      "address",
      "city",
      "state",
      "country",
      "lat",
      "lng",
      "name",
      "description",
      "price",
      "createdAt",
      "updatedAt",
    ],
  });

  for await (const spot of ownedSpots) {
    const previewImage = await SpotImage.findOne({
      where: { spotId: spot.id, previewImage: true },
    });

    if (previewImage) {
      spot.dataValues.previewImage = previewImage.url;
    } else {
      spot.dataValues.previewImage = null;
    }

    const data = await Review.findAll({ where: { spotId: spot.id } });

    if (data.length) {
      const sum = data.reduce((acc, rate) => acc + rate.stars, 0);
      const avg = sum / data.length;
      spot.dataValues.avgRating = avg;
    } else {
      spot.dataValues.avgRating = null;
    }
  }

  return res.json({ Spots: ownedSpots });
});

//Get details of a Spot From An id
router.get("/:spotId", async (req, res) => {
  try {
    const selected = await Spot.findByPk(req.params.spotId, {
      include: [{ model: User }, { model: SpotImage }],
    });

    if (!selected) {
      return res
        .status(404)
        .json({ message: "Spot couldn't be found", statusCode: 404 });
    }

    const resObj = {
      id: selected.id,
      ownerId: selected.ownerId,
      address: selected.address,
      city: selected.city,
      state: selected.state,
      country: selected.country,
      lat: selected.lat,
      lng: selected.lng,
      name: selected.name,
      description: selected.description,
      price: selected.price,
      createdAt: selected.createdAt,
      updatedAt: selected.updatedAt,
      numReviews: 0,
      avgStarRating: 0,
      SpotImages: selected.SpotImages.map((image) => ({
        id: image.id,
        url: image.url,
        preview: image.previewImage,
      })),
      Owner: {
        id: selected.User.id,
        firstName: selected.User.firstName,
        lastName: selected.User.lastName,
      },
    };

    const { rows: reviews, count } = await Review.findAndCountAll({
      where: {
        spotId: selected.id,
      },
    });

    if (count > 0) {
      let sum = 0;

      reviews.forEach((review) => {
        sum += review.stars;
      });

      resObj.avgStarRating = sum / count;
    }

    resObj.numReviews = count;

    res.json(resObj);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", statusCode: 500 });
  }
});

//Create a Spot
router.post("/", requireAuth, async (req, res, next) => {
  const id = req.user.id;
  const { address, city, state, country, lat, lng, name, description, price } =
    req.body;
  if (!address || !city || !state || !country || !description || !price) {
    res.status(400).json({
      message: "Validation Error",
      statusCode: 400,
      errors: {
        address: "Street address is required",
        city: "City is required",
        state: "State is required",
        country: "Country is required",
        lat: "Latitude is not valid",
        lng: "Longitude is not valid",
        name: "Name must be less than 50 characters",
        description: "Description is required",
        price: "Price per day is required",
      },
    });
  }
  const spot = await Spot.create({
    ownerId: id,
    address: address,
    city: city,
    state: state,
    country: country,
    lat: lat,
    lng: lng,
    name: name,
    description: description,
    price: price,
  });
  res.status(201).json(spot);
});

//Add an Image to a Spot based on Spot's id

router.post("/:spotId/images", requireAuth, async (req, res) => {
  const search = await Spot.findByPk(req.params.spotId);

  if (!search) {
    res.status(404);
    return res.json({ message: "Spot couldn't be found", statusCode: 404 });
  }

  const { url } = req.body;
  const img = await SpotImage.create({
    previewImage: true,
    url,
    spotId: search.id,
  });

  const resObj = {
    id: img.id,
    url: img.url,
    preview: img.previewImage,
  };

  return res.status(201).json(resObj);
});

//Edit a Spot

router.put("/:spotId", requireAuth, async (req, res) => {
  const { address, city, state, country, lat, lng, name, description, price } =
    req.body;
  const toUpdate = await Spot.findByPk(req.params.spotId);

  const errors = {};

  if (!address) {
    errors.address = "Street address is required";
  }

  if (!city) {
    errors.city = "City is required";
  }

  if (!state) {
    errors.state = "State is required";
  }

  if (!country) {
    errors.country = "Country is required";
  }

  if (lat && (isNaN(lat) || lat < -90 || lat > 90)) {
    errors.lat = "Latitude is not valid";
  }

  if (lng && (isNaN(lng) || lng < -180 || lng > 180)) {
    errors.lng = "Longitude is not valid";
  }

  if (!name || name.length > 50) {
    errors.name = "Name must be less than 50 characters";
  }

  if (!description) {
    errors.description = "Description is required";
  }

  if (!price) {
    errors.price = "Price per day is required";
  }

  if (Object.keys(errors).length > 0) {
    return res.status(400).json({
      message: "Validation Error",
      statusCode: 400,
      errors: errors,
    });
  }

  if (toUpdate) {
    if (address) toUpdate.address = address;
    if (city) toUpdate.city = city;
    if (state) toUpdate.state = state;
    if (country) toUpdate.country = country;
    if (lat) toUpdate.lat = lat;
    if (lng) toUpdate.lng = lng;
    if (name) toUpdate.name = name;
    if (description) toUpdate.description = description;
    if (price) toUpdate.price = price;

    await toUpdate.save();

    return res.json({
      id: toUpdate.id,
      ownerId: toUpdate.ownerId,
      address: toUpdate.address,
      city: toUpdate.city,
      state: toUpdate.state,
      country: toUpdate.country,
      lat: toUpdate.lat,
      lng: toUpdate.lng,
      name: toUpdate.name,
      description: toUpdate.description,
      price: toUpdate.price,
      createdAt: toUpdate.createdAt,
      updatedAt: toUpdate.updatedAt,
    });
  } else {
    return res
      .status(404)
      .json({ message: "Spot couldn't be found", statusCode: 404 });
  }
});

//Delete a Spot

router.delete("/:spotId", requireAuth, async (req, res) => {
  const user = req.user.id;
  const toDelete = await Spot.findByPk(req.params.spotId);

  if (toDelete) {
    await toDelete.destroy();
    res.status(200).json({ message: "Successfully deleted", statusCode: 200 });
  } else {
    res
      .status(404)
      .json({ message: "Spot couldn't be found", statusCode: 404 });
  }
});

//Get All Reviews by a Spot's id

router.get("/:spotId/reviews", async (req, res) => {
  try {
    const spot = await Spot.findByPk(req.params.spotId);

    if (!spot) {
      return res
        .status(404)
        .json({ message: "Spot couldn't be found", statusCode: 404 });
    }

    const reviews = await Review.findAll({
      where: { spotId: req.params.spotId },
      attributes: [
        "id",
        "userId",
        "spotId",
        "review",
        "stars",
        "createdAt",
        "updatedAt",
      ],
      include: [
        { model: User, attributes: ["id", "firstName", "lastName"] },
        { model: ReviewImage, attributes: ["id", "url"] },
      ],
    });

    return res.status(200).json({ Reviews: reviews });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Something went wrong", statusCode: 500 });
  }
});

//Create a Review for spot on Spot's id

router.post(
  "/:spotId/reviews",
  requireAuth,
  validateReview,
  async (req, res) => {
    const { review, stars } = req.body;

    const reviewStatus = await Review.findOne({
      where: {
        userId: req.user.id,
        spotId: req.params.spotId,
      },
    });

    if (reviewStatus) {
      return res.status(403).json({
        message: "User already has a review for this spot",
        statusCode: 403,
      });
    }

    const spot = await Spot.findByPk(req.params.spotId);

    if (!spot) {
      return res.status(404).json({
        message: "Spot couldn't be found",
        statusCode: 404,
      });
    }

    const newReview = await Review.create({
      review,
      stars,
      userId: req.user.id,
      spotId: req.params.spotId,
    });

    return res.status(201).json({
      id: newReview.id,
      userId: newReview.userId,
      spotId: newReview.spotId,
      review: newReview.review,
      stars: newReview.stars,
      createdAt: newReview.createdAt,
      updatedAt: newReview.updatedAt,
    });
  }
);

//Get all Bookings for a Spot based on Spot id

router.get("/:spotId/bookings", requireAuth, async (req, res) => {
  const searched = await Spot.findByPk(req.params.spotId);

  if (!searched) {
    return res
      .status(404)
      .json({ message: "Spot couldn't be found", statusCode: 404 });
  }

  if (searched.ownerId === req.user.id) {
    const bookings = await Booking.findAll({
      where: { spotId: req.params.spotId },
      include: {
        model: User,
        attributes: ["id", "firstName", "lastName"],
        exclude: [
          "username",
          "email",
          "hashedPassword",
          "createdAt",
          "updatedAt",
        ],
      },
    });

    const formattedBookings = bookings
      .map((booking) => ({
        User: {
          id: booking.User.id,
          firstName: booking.User.firstName,
          lastName: booking.User.lastName,
        },
        id: booking.id,
        spotId: booking.spotId,
        userId: booking.userId,
        startDate: booking.startDate,
        endDate: booking.endDate,
        createdAt: booking.createdAt,
        updatedAt: booking.updatedAt,
      }))
      .reverse();

    return res.status(200).json({ Bookings: formattedBookings });
  } else {
    const bookings = await Booking.findAll({
      where: { spotId: req.params.spotId },
      attributes: ["spotId", "startDate", "endDate"],
    });

    const formattedBookings = bookings
      .map((booking) => ({
        spotId: booking.spotId,
        startDate: booking.startDate,
        endDate: booking.endDate,
      }))
      .reverse();

    return res.status(200).json({ Bookings: formattedBookings });
  }
});

//Create a Booking from a Spot based on Spot's id

router.post(
  "/:spotId/bookings",
  requireAuth,
  validateBooking,
  async (req, res, next) => {
    const spot = await Spot.findByPk(req.params.spotId);

    if (!spot) {
      const errorResponse = {
        message: "Spot couldn't be found",
        statusCode: 404,
      };
      return res.status(404).json(errorResponse);
    }

    const { startDate, endDate } = req.body;

    const start = new Date(startDate);
    const end = new Date(endDate);

    if (end <= start) {
      const errorResponse = {
        message: "Validation error",
        statusCode: 400,
        errors: {
          endDate: "endDate cannot be on or before startDate",
        },
      };
      return res.status(400).json(errorResponse);
    }

    const allBookings = await Booking.findAll({
      include: {
        model: Spot,
        where: {
          id: req.params.spotId,
        },
      },
    });

    const isBooked = allBookings.some(
      (booking) =>
        (start.getTime() <= booking.startDate.getTime() &&
          booking.startDate.getTime() <= end.getTime()) ||
        (booking.startDate.getTime() <= start.getTime() &&
          end.getTime() <= booking.endDate.getTime()) ||
        (start.getTime() <= booking.endDate.getTime() &&
          booking.endDate.getTime() <= end.getTime())
    );

    if (isBooked) {
      const errorResponse = {
        message: "Sorry, this spot is already booked for the specified dates",
        statusCode: 403,
        errors: {
          startDate: "Start date conflicts with an existing booking",
          endDate: "End date conflicts with an existing booking",
        },
      };
      return res.status(403).json(errorResponse);
    }

    const newEvent = await Booking.create({
      userId: req.user.id,
      spotId: req.params.spotId,
      startDate,
      endDate,
    });

    const response = {
      message: "Booking created successfully",
      statusCode: 200,
      booking: {
        id: newEvent.id,
        spotId: newEvent.spotId,
        userId: newEvent.userId,
        startDate: newEvent.startDate,
        endDate: newEvent.endDate,
        createdAt: newEvent.createdAt,
        updatedAt: newEvent.updatedAt,
      },
    };

    res.status(200).json(response);
  }
);

module.exports = router;
