const WebSocket = require('ws');
const signalModel = require('../../models/signal');
const deviceStateModel = require('../../models/deviceState');
const auth = require('./auth');
const signalR = require('@microsoft/signalr');

const AUTH_INTERVAL_TIME = 1000 * 60 * 5; // 5 мин.

module.exports = async () => {
  let deviceStateRemote = await deviceStateModel.findOne().lean();

  if (!deviceStateRemote) {
    const createdRemote = {
      createdAt: null,
      geo: { lat: 0, lon: 0 },
      guard: 'SafeGuardOn',
      central_lock: null,
      parking_brake: null,
      engine_block: null,
      immobilizer: null,
      ignition_switch: null,
      gear_in_park_mode: null,
      speed: null,
      rpm: null,
      driver_door: null,
      front_pass_door: null,
      rear_left_door: null,
      rear_right_door: null,
      trunk: null,
      hood: null,
      service_state_ext_update_time: null,
    };
    await deviceStateModel.create(createdRemote);

    deviceStateRemote = createdRemote;
  }

  delete deviceStateRemote._id;
  delete deviceStateRemote.updatedAt;
  delete deviceStateRemote.createdAt;

  let deviceState = deviceStateRemote;
  let prevDeviceState = deviceStateRemote;

  const watcher = async () => {
    const dozor = await auth();

    // const ws = await new WebSocket(url.trim());

    // ws.on('message', async (data) => {
    //   try {
    //     const signal = JSON.parse(
    //       JSON.parse(data.toString())?.M[0]?.A[0]
    //     ).device_state;
    //
    //     const mergedSignal = {};
    //
    //     for (const [key, value] of Object.entries(deviceState)) {
    //       mergedSignal[key] = signal[key] || value;
    //     }
    //
    //     deviceState = { ...mergedSignal };
    //
    //     if (JSON.stringify(deviceState) !== JSON.stringify(prevDeviceState)) {
    //       await signalModel.create({ ...deviceState, timestamp: Date.now() });
    //       await deviceStateModel.findOneAndUpdate(deviceState);
    //
    //       prevDeviceState = deviceState;
    //     }
    //   } catch {}
    // });

    /** Разрыв связи с сокетом по истечении интервала */
    // setTimeout(() => {
    //   ws.terminate();
    // }, AUTH_INTERVAL_TIME);
  };

  watcher();

  const authInterval = setInterval(watcher, AUTH_INTERVAL_TIME);
};
