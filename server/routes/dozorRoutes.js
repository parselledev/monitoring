const express = require('express');
const router = express.Router();
const dozorController = require('../controllers/dozorController');

router.route('/tracks').get(dozorController.getTracks);
router.route('/deviceState').get(dozorController.getDeviceState);

module.exports = router;
