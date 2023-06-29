// backend/routes/api/index.js
const router = require("express").Router();
const sessionRouter = require("./session.js");
const userRouter = require("./user.js");
const spotRouter = require("./spot.js");
const reviewRouter = require("./review.js");
const bookingRouter = require("./booking.js");
const spotImageRouter = require("./spotimage.js");
const reviewImageRouter = require("./reviewimage.js");
const { restoreUser } = require("../../utils/auth");

router.use(restoreUser);
router.use("/session", sessionRouter);
router.use("/users", userRouter);
router.use("/spots", spotRouter);
router.use("/reviews", reviewRouter);
router.use("/bookings", bookingRouter);
router.use("/review-images", reviewImageRouter);
router.use("/spot-images", spotImageRouter);

router.post("/test", function (req, res) {
  res.json({ requestBody: req.body });
});

module.exports = router;
