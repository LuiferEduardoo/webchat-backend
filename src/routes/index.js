const express = require('express');

const auth = require('./auth');
const user = require('./user');

const router = (app) => {
  const router = express.Router();
  app.use('/api/v1', router);
  router.use('/auth', auth);
  router.use('/users', user);
}


module.exports = router;