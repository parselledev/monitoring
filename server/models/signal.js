const mongoose = require('mongoose');

const signalSchema = new mongoose.Schema(
  {
    createdAt: { type: Date, expires: 60 * 60 * 24 * 2 }, // Каждые 2 дня
    timestamp: Number,
    geo: {
      lat: Number,
      lon: Number,
    },
    guard: String,
    central_lock: String,
    parking_brake: String,
    engine_block: String,
    immobilizer: String,
    ignition_switch: String,
    gear_in_park_mode: String,
    speed: Number,
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

module.exports = mongoose.model('Signal', signalSchema, 'signals');
