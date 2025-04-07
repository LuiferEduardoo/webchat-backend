const express = require("express");
const passport = require("passport");

// const validate = require("../middleware/validate");
const User = require("../services/User");

const instanceUser = new User();

const router = express.Router();

router.get(
  "/me",
  passport.authenticate('jwt', { session: false }),
  async (req, res, next) => {
    try {
      await instanceUser.getUserLogin(req.user.sub, res);
    } catch (error) {
      next(error);
    }
  }
);

router.get(
  "/:id",
  passport.authenticate('jwt', { session: false }),
  async (req, res, next) => {
    try {
      await instanceUser.getUserById(req.params.id, res);
    } catch (error) {
      next(error);
    }
  }
);

router.get(
  "/",
  passport.authenticate('jwt', { session: false }),
  async (req, res, next) => {
    try {
      await instanceUser.getUsers(res);
    } catch (error) {
      next(error);
    }
  }
);

module.exports = router;
