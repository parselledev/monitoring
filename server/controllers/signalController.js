const signal = require('../models/signal');

const getTracks = async (req, res) => {
  const signals = await signal.find();

  const result = [];
  let temp = [];

  signals.forEach((signal, index) => {
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
    } else if (signal.guard === 'SafeGuardOff') {
      temp.push(signal);
    }
  });

  if (!result) {
    return res.status(400).json({ message: 'No Signals found' });
  }
  res.json(result);

  // if (!signals) {
  //   return res.status(400).json({ message: 'No Notes found' });
  // }
  // res.json(signals);
};

module.exports = {
  getTracks,
};
