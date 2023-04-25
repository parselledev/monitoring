const signal = require('../models/signal');
const deviceState = require('../models/deviceState');
const { sign } = require('jsonwebtoken');

const getSignals = async (req, res) => {
  const signalsData = await signal.find();

  if (!signalsData) {
    return res.status(400).json({ message: 'No Signals found' });
  }

  res.json(signalsData);
};

const getDeviceState = async (req, res) => {
  const deviceStateData = await deviceState.findOne();

  if (!deviceStateData) {
    return res.status(400).json({ message: 'deviceState not found' });
  }

  res.json(deviceStateData);
};

module.exports = {
  getSignals,
  getDeviceState,
};
