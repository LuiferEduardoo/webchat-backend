const express = require("express");
const passport = require("passport");

const Message = require("../services/Message");
const instanceMessage = new Message();
const router = express.Router();

router.get(
  "/users/:id",
  passport.authenticate('jwt', { session: false }),
  async (req, res, next) => {
    try {
      return await instanceMessage.getMessagesByUserId(req, res);
    } catch (error) {
      next(error);
    }
  }
);

router.get(
  "/groups/:id",
  passport.authenticate('jwt', { session: false }),
  async (req, res, next) => {
    try {
      return await instanceMessage.getMessagesByGroupId(req, res);
    } catch (error) {
      next(error);
    }
  }
);

router.get(
  "/senders",
  passport.authenticate('jwt', { session: false }),
  async (req, res, next) => {
    try {
      return await instanceMessage.getSendersWithLastMessage(req.user.sub, res);
    } catch (error) {
      next(error);
    }
  }
);

module.exports = router;