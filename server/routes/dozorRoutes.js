const express = require('express');
const router = express.Router();
const dozorController = require('../controllers/dozorController');

router.route('/signals').get(dozorController.getSignals);
router.route('/deviceState').get(dozorController.getDeviceState);

module.exports = router;
