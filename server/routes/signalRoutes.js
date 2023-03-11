const express = require('express');
const router = express.Router();
const signalController = require('../controllers/signalController');

router
  .route('/')
  .get(signalController.getSignals)
  .post(signalController.createSignal);

module.exports = router;
