const express = require('express');
const { Spot, Review, SpotImage, User, ReviewImage, Booking} = require('../../db/models');
const { setTokenCookie, requireAuth, restoreUser } = require('../../utils/auth');
const { Sequelize, Op, DATE } = require('sequelize');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const router = express.Router();

//Get all of the Current User's Bookings
router.get('/current', requireAuth, async (req, res) => {
    const userId = req.user.id
    const cBooking = await Booking.findAll({
        where: {  userId: userId }, 

        include: [
        { model: Spot, include: {
            model: SpotImage,
            attributes: ['url']
        }}
    ]
})


const allBookings = cBooking.map(booking => {
    const { url } = booking.Spot.SpotImages[0];
    const { SpotImages, ...spot } = booking.Spot.toJSON();
    return {
      ...booking.toJSON(),
      Spot: {
        ...spot,
        previewImage: url,
      },
    };
  });
  
  res.json({ bookings: allBookings });
  
    
})


//Edit a spot

router.put('/:bookingId', requireAuth, async (req, res) => {
  const { startDate, endDate } = req.body;
  const bookingId = req.params.bookingId;
  const userId = req.user.id;

  try {
    const booking = await Booking.findByPk(bookingId);

    if (!booking) {
      return res.status(404).json({
        message: "Booking couldn't be found",
        statusCode: 404,
      });
    }

    if (booking.userId !== userId) {
      return res.status(403).json({
        message: 'User not authorized',
        statusCode: 403,
      });
    }

    const newStartDate = new Date(startDate);
    const newEndDate = new Date(endDate);

    if (newEndDate <= newStartDate) {
      return res.status(400).json({
        message: 'End date must be after start date',
        statusCode: 400,
      });
    }

    if (new Date() > newEndDate) {
      return res.status(400).json({
        message: 'End date must be in the future',
        statusCode: 400,
      });
    }

    const dateIsBooked = await Booking.findOne({
      where: {
        spotId: booking.spotId,
        startDate: {
          [Op.lte]: newEndDate,
        },
        endDate: {
          [Op.gte]: newStartDate,
        },
        id: {
          [Op.ne]: booking.id,
        },
      },
    });

    if (dateIsBooked) {
      return res.status(403).json({
        message:
          'Sorry, this spot is already booked for the specified dates',
        statusCode: 403,
        errors: {
          startDate: 'Start date conflicts with an existing booking',
          endDate: 'End date conflicts with an existing booking',
        },
      });
    }

    const updatedStatus = await booking.update({
      startDate: newStartDate,
      endDate: newEndDate,
    });

    res.json(updatedStatus);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: 'An error occurred while updating the booking',
      statusCode: 500,
    });
  }
});

module.exports = router;



//Delete a booking

router.delete('/:bookingId', requireAuth, async (req, res) => {
    const bookingId = req.params.bookingId;
    const userId = req.user.id;

    try {
        const booking = await Booking.findByPk(bookingId, { include: Spot });

        if (!booking) {
            return res.status(404).json({
                message: "Booking couldn't be found",
                statusCode: 404
            });
        }

        if (booking.startDate <= new Date()) {
            return res.status(403).json({
                message: "Bookings that have been started can't be deleted",
                statusCode: 403
            });
        }

        if (booking.userId !== userId && booking.Spot.ownerId !== userId) {
            return res.status(403).json({
                message: "User not authorized",
                statusCode: 403
            });
        }

        await booking.destroy();

        return res.status(200).json({
            message: "Successfully deleted",
            statusCode: 200
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Something went wrong",
            statusCode: 500
        });
    }
});


module.exports = router;