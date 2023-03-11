const express = require('express');
const router = express.Router();
const signalController = require('../controllers/signalController');

router.route('/tracks').get(signalController.getTracks);

module.exports = router;
