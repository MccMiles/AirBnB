// backend/routes/index.js
const express = require("express");
const router = express.Router();
const sessionRouter = require('./api/session.js');
const usersRouter = require('./api/user.js');
const { restoreUser } = require('../utils/auth.js')

// .................................
router.get('/test', (req, res) => {
  res.json({ message: 'success' });
});
// .................................


// Add a XSRF-TOKEN cookie
router.get("/api/csrf/restore", (req, res) => {
  const csrfToken = req.csrfToken();
  res.cookie("XSRF-TOKEN", csrfToken);
  res.status(200).json({
    "XSRF-Token": csrfToken,
  });
});
// ...

router.use(restoreUser);

router.use('/session', sessionRouter);

//routes
router.use('/users', usersRouter);
//routes


router.get('/test', function (req, res) {
  res.json({ requestBody: req.body });
});



const apiRouter = require('./api');

router.use('/api', apiRouter);


//routes


module.exports = router;