const signal = require('../models/signal');
const deviceState = require('../models/deviceState');
const { sign } = require('jsonwebtoken');

const PARK_ON = 'On';
const PARK_OFF = 'off';

const getTracks = async (req, res) => {
  const signalsData = await signal.find();

  const result = [];
  let temp = [];
  let currentType = null;

  signalsData.filter(
    (signal) =>
      !signal.geo?.lat || !signal.geo?.lon || !signal.gear_in_park_mode
  );

  signalsData.forEach((signal, index) => {
    if (index === 0) {
      temp.push(signal);
      currentType = signal.gear_in_park_mode;
      return;
    }

    if (
      currentType === signal.gear_in_park_mode &&
      index === signalsData.length - 1
    ) {
      temp.push(signal);
      result.push({
        id: temp[0]._id || 'asd',
        type: currentType === PARK_ON ? 'parking' : 'moving',
        start: temp[0].timestamp,
        stop: temp[temp.length - 1].timestamp,
        signals: temp,
      });
      temp = [];
    } else if (currentType === signal.gear_in_park_mode) {
      temp.push(signal);
    } else if (currentType !== signal.gear_in_park_mode) {
      result.push({
        id: temp[0]._id || 'asd',
        type: currentType === PARK_ON ? 'parking' : 'moving',
        start: temp[0].timestamp,
        stop: temp[temp.length - 1].timestamp,
        signals: temp,
      });
      temp = [];
      temp.push(signal);
      currentType = signal.gear_in_park_mode;
    }
  });

  if (!result) {
    return res.status(400).json({ message: 'No Signals found' });
  }

  /** Если за проход была всего одна поездка, то руками формируем ответ
   * Если несколько треков, то отправляем сразу result */
  res.json(
    result.length
      ? result
      : [
          {
            id: temp[0]._id,
            start: temp[0].timestamp,
            stop: temp[temp.length - 1].timestamp,
            signals: temp,
          },
        ]
  );

  // if (!signalsData) {
  //   return res.status(400).json({ message: 'No Notes found' });
  // }
  // res.json(signalsData);
};

const getDeviceState = async (req, res) => {
  const deviceStateData = await deviceState.findOne();

  if (!deviceStateData) {
    return res.status(400).json({ message: 'deviceState not found' });
  }

  res.json(deviceStateData);
};

module.exports = {
  getTracks,
  getDeviceState,
};
