// backend/routes/api/index.js
const router = require('express').Router();
const sessionRouter = require('./session.js');
const userRouter = require('./user.js');
const spotRouter = require('./spot.js');
const reviewRouter = require('./review.js');
const bookingRouter = require('./booking.js');
const spotImageRouter = require('./spotimage.js');
const reviewImageRouter = require('./reviewImage.js');
const { restoreUser } = require('../../utils/auth');


router.use(restoreUser);
router.use('/session', sessionRouter);
router.use('/users', userRouter);
router.use('/spots', spotRouter);
router.use('/reviews', reviewRouter);
router.use('/bookings', bookingRouter);
router.use('/review-images', reviewImageRouter);
router.use('/spot-images', spotImageRouter);

router.post('/test', function(req, res) {
    res.json({ requestBody: req.body });
});



// // GET /api/restore-user

// router.get(
//   '/restore-user',
//   (req, res) => { return res.json(req.user) });

  
// // GET /api/set-token-cookie
// const { setTokenCookie } = require('../../utils/auth.js');
// const { User } = require('../../db/models');
// router.get('/set-token-cookie', async (_req, res) => {
//   const user = await User.findOne({
//       where: {
//         username: 'Demo-lition'
//       }
//     });
//   setTokenCookie(res, user);
//   return res.json({ user: user });
// });

// ...
// backend/routes/api/index.js
// ...

// GET /api/require-auth
  // const { requireAuth } = require('../../utils/auth.js');
  // router.get(
  //   '/require-auth',
  //   requireAuth,
  //   (req, res) => { return res.json(req.user) });
  

module.exports = router;
  