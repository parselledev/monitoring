const mongoose = require('mongoose');
const autoIncrement = require('mongoose-sequence')(mongoose);

const signalSchema = new mongoose.Schema(
  {
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
    rpm: Number,
    driver_door: String,
    front_pass_door: String,
    rear_left_door: String,
    rear_right_door: String,
    trunk: String,
    hood: String,
    service_state_ext_update_time: String,
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Signal', signalSchema, 'signals');
