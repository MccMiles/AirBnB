const express = require("express");
const router = express.Router();
const { setTokenCookie } = require("../../utils/auth");
const { User } = require("../../db/models");

router.post("/demo-user", async (req, res, next) => {
  const { credential, password } = req.body;

  // Find the demo user in the database
  const user = await User.findOne({
    where: { username: "demouser" },
  });

  if (!user) {
    const err = new Error("Demo user does not exist");
    err.status = 404;
    next(err);
  }

  // Log in the demo user
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
