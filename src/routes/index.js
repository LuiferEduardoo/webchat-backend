const express = require('express');

const auth = require('./auth');
const user = require('./user');
const group = require('./group');
const message = require('./message');

const router = (app) => {
  const router = express.Router();
  app.use('/api/v1', router);
  router.use('/auth', auth);
  router.use('/users', user);
  router.use('/groups', group);
  router.use('/messages', message);
}


module.exports = router;