const express = require('express');
const { Spot, Review, SpotImage, User, ReviewImage, Booking} = require('../../db/models');
const { setTokenCookie, requireAuth, restoreUser } = require('../../utils/auth');
const { Sequelize, Op, DATE } = require('sequelize');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const router = express.Router();


//Get all of the Current User's Bookings
router.get('/current', requireAuth, async (req, res) => {
    const userId = req.user.id;
  
    try {
      const bookings = await Booking.findAll({
        where: { userId },
        include: [
          {
            model: Spot,
            include: [
              {
                model: SpotImage,
                attributes: ['url'],
              },
            ],
          },
          {
            model: User,
            attributes: ['id', 'firstName', 'lastName'],
          },
        ],
      });
  
      const formattedBookings = bookings.map((booking) => {
        const previewImage = booking.Spot.SpotImages.length > 0 ? booking.Spot.SpotImages[0].url : null;
        const { SpotImages, ...spot } = booking.Spot.toJSON();
        return {
          id: booking.id,
          spotId: booking.spotId,
          Spot: {
            ...spot,
            previewImage,
          },
          userId: booking.userId,
          startDate: booking.startDate,
          endDate: booking.endDate,
          createdAt: booking.createdAt,
          updatedAt: booking.updatedAt,
        };
      });
  
      res.json({ Bookings: formattedBookings });
    } catch (err) {
      res.status(500).json({ message: 'Something went wrong' });
    }
  });
  


//Edit a booking

router.put('/:bookingId', requireAuth, async (req, res) => {
    const { startDate, endDate } = req.body;
    const bookingId = req.params.bookingId;
    const userId = req.user.id;

    const newStartDate = new Date(startDate);
    const newEndDate = new Date(endDate);

    if (newEndDate <= newStartDate) {
      return res.status(400).json({
        message: "Validation error",
        statusCode: 400,
        errors: {
          endDate: "endDate cannot come before startDate",
        },
      });
    }

    if (new Date() > newEndDate) {
        return res.status(403).json({
          message: "Past bookings can't be modified",
          statusCode: 403,
        });
      }
      
  
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