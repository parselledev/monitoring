const mongoose = require('mongoose');

const signalSchema = new mongoose.Schema(
  {
    timestamp: Number,
    geo: {
      lat: Number,
      lon: Number,
    },
    guard: String,
    ignition: Boolean,
    driver_door: String,
    front_pass_door: String,
    rear_left_door: String,
    rear_right_door: String,
    trunk: String,
    hood: String,
  },
  {
    timestamps: true,
  }
);

signalSchema.index({ createdAt: 1 }, { expireAfterSeconds: 60 * 60 * 24 });

module.exports = mongoose.model('Signal', signalSchema, 'signals');
