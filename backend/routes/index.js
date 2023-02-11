

// backend/routes/index.js
const express = require("express");
const router = express.Router();
const sessionRouter = require('./api/session.js');
const usersRouter = require('./api/user.js');
const { restoreUser } = require('../utils/auth.js')

// ...
const apiRouter = require('./api');

router.use('/api', apiRouter);
// ...



// backend/routes/index.js
// ...
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

router.use('/users', usersRouter);

router.post('/test', (req, res) => {
  res.json({ requestBody: req.body });
});





module.exports = router;