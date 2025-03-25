const express = require('express');

const auth = require('./auth');

const router = (app) => {
  const router = express.Router();
  app.use('/api/v1', router);
  router.use('/auth', auth);
}


module.exports = router;