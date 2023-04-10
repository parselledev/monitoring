const mongoose = require('mongoose');

const deviceStateSchema = new mongoose.Schema(
  {
    geo: {
      lat: Number,
      lon: Number,
    },
    guard: String,
    ignition_switch: String,
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

module.exports = mongoose.model(
  'DeviceState',
  deviceStateSchema,
  'deviceState'
);
