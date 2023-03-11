const signal = require('../models/signal');

const getSignals = async (req, res) => {
  const signals = await signal.find().lean();
  if (!signals) {
    return res.status(400).json({ message: 'No Notes found' });
  }
  res.json(signals);
};

const createSignal = async (req, res) => {
  const { user, title, text } = req.body;
  //Confirm data
  if (!user.match(/^[0-9a-fA-F]{24}$/) || !title || !text) {
    return res
      .status(400)
      .json({ message: 'Verify your data and proceed again' });
  }
  //create new note
  const newNote = await note.create({
    user,
    title,
    text,
  });
  if (newNote) {
    res.json({
      message: `New note with title: ${title} created with success`,
    });
  } else {
    res.status(400).json({
      message: 'Note creation failed, please verify your data and try again',
    });
  }
};

module.exports = {
  getSignals,
  createSignal,
};
