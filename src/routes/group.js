const express = require("express");
const passport = require("passport");

const Group = require("../services/Group");
const instanceGroup = new Group();
const router = express.Router();
const validate = require("../middleware/validate");
const { createGroupDto, updateGroupDto, deleteGroupDto } = require("../dto/group.dto");

router.get(
  "/me",
  passport.authenticate('jwt', { session: false }),
  async (req, res, next) => {
    try {
      return await instanceGroup.getGroupsByUser(req.user.sub, res);
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
      return await instanceGroup.getGroup(req.params.id, res);
    } catch (error) {
      next(error);
    }
  }
);

router.post(
  "/",
  passport.authenticate('jwt', { session: false }),
  validate(createGroupDto),
  async (req, res, next) => {
    try {
      return await instanceGroup.create(req, req.user.sub, res);
    } catch (error) {
      next(error);
    }
  }
);

router.put(
  "/:id",
  passport.authenticate('jwt', { session: false }),
  validate(updateGroupDto),
  async (req, res, next) => {
    try {
      return await instanceGroup.update(req.params.id, req.user.sub, req, res);
    } catch (error) {
      next(error);
    }
  }
);

router.delete(
  "/:id",
  passport.authenticate('jwt', { session: false }),
  async (req, res, next) => {
    try {
      return await instanceGroup.delete(req.params.id, req.user.sub, res);
    } catch (error) {
      next(error);
    }
  }
);

module.exports = router;