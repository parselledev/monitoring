const signal = require('../models/signal');
const deviceState = require('../models/deviceState');

const getTracks = async (req, res) => {
  const signalsData = await signal.find();

  const result = [];
  let temp = [];

  signalsData.forEach((signal, index) => {
    if (signal.guard === 'SafeGuardOn') {
      if (temp.length) {
        result.push({
          id: temp[0]._id,
          start: temp[0].timestamp,
          stop: temp[temp.length - 1].timestamp,
          signals: temp,
        });
      }
      temp = [];
    } else if (signal.guard === 'SafeGuardOff' || signal.guard === null) {
      temp.push(signal);
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
