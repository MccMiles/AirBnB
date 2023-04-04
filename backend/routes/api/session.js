// backend/routes/api/session.js
const express = require("express");
const router = express.Router();

const { User } = require("../../db/models");
const { check } = require("express-validator");
const {
  setTokenCookie,
  restoreUser,
  requireAuth,
} = require("../../utils/auth");
const { handleValidationErrors } = require("../../utils/validation");

const validateLogin = [
  check("credential")
    .exists({ checkFalsy: true })
    .notEmpty()
    .withMessage("Please provide a valid email or username."),
  check("password")
    .exists({ checkFalsy: true })
    .withMessage("Please provide a password."),
  handleValidationErrors,
];

// Get Current User
router.get("/", requireAuth, (req, res) => {
  const { user } = req;
  if (!user) {
    return res.status(200).json({
      user: null,
    });
  } else {
    return res.status(200).json({
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        username: user.username,
      },
    });
  }
});

// Log in
router.post("/", validateLogin, async (req, res, next) => {
  const { credential, password } = req.body;

  const user = await User.login({ credential, password });

  // if (!user) {
  //   const err = new Error("Login failed");
  //   err.status = 401;
  //   err.title = "Login failed";
  //   err.errors = ["The provided credentials were invalid."];
  //   return next(err);
  // }

  await setTokenCookie(res, user);

  return res.json({
    user: {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      username: user.username,
    },
  });
});

//Log out
router.delete("/", (_req, res) => {
  res.clearCookie("token");
  return res.json({ message: "success" });
});

//Restore session user
router.get("/", restoreUser, (req, res) => {
  const { user } = req;
  if (user) return res.json({ user: user.toSafeObject() });

  return res.json({ user: null });
});

module.exports = router;
