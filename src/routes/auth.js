const express = require("express");
const passport = require("passport");

const Auth = require("../services/Auth");

const instanceAuth = new Auth();

const router = express.Router();

router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/callback",
  passport.authenticate("google", { session: false, failureRedirect: "/" }),
  async (req, res, next) => {
    try {
      await instanceAuth.callback(req, res);
    } catch (error) {
      next(error);
    }
  }
);

module.exports = router;
