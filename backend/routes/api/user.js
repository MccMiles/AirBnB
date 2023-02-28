// backend/routes/api/users.js
const express = require('express')
const router = express.Router();

const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { User } = require('../../db/models');


const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

// ...
const validateSignup = [
  check('email')
    .exists({ checkFalsy: true })
    .isEmail()
    .withMessage('Please provide a valid email.'),
  check('username')
    .exists({ checkFalsy: true })
    .isLength({ min: 4 })
    .withMessage('Please provide a username with at least 4 characters.'),
  check('username')
    .not()
    .isEmail()
    .withMessage('Username cannot be an email.'),
  check('password')
    .exists({ checkFalsy: true })
    .isLength({ min: 6 })
    .withMessage('Password must be 6 characters or more.'),
  handleValidationErrors
];


//Sign up
router.post('/', validateSignup, async (req, res) => {
  const { firstName, lastName, email, username, password } = req.body;

  const emailExists = await User.findOne({ where: { email } });
  if (emailExists) {
    return res.status(403).json({
      message: 'User already exists',
      statusCode: 403,
      errors: {
        email: 'User with that email already exists',
      },
    });
  } else {
    const userExists = await User.findOne({ where: { username } });
    if (userExists) {
      return res.status(403).json({
        message: 'User already exists',
        statusCode: 403,
        errors: {
          username: 'User with that username already exists',
        },
      });
    } else {
      const user = await User.signup({ firstName, lastName, email, username, password });
      const newToken = await setTokenCookie(res, user);

  return res.json({ 
    id: user.id,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    username: user.username,
    token: newToken
});
    }
  }
});



module.exports = router;