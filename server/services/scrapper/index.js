const WebSocket = require('ws');
const signalModel = require('../../models/signal');
const deviceStateModel = require('../../models/deviceState');
const auth = require('./auth');

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

    const connectionToken = encodeURIComponent(
      dozor._dozor._garage._signal._connection_token
    );
    const sessionId = encodeURIComponent(dozor._dozor._garage._session_id);
    const url = `wss://monitoring.tecel.ru/url_signal_r/connect?transport=webSockets&clientProtocol=1.5&connectionToken=${connectionToken}&connectionData=%5B%7B%22name%22%3A%22ControlService%22%7D%5D&tid=0&Lang=ru&SessionGuid=${sessionId}&ClientData=%7B%22AppName%22%3A%22Prizrak+WEB+Monitoring%22%2C%22AppVersion%22%3A%221.0.65%22%2C%22AppHost%22%3A%22monitoring.tecel.ru%22%2C%22IsUserDataAvailable%22%3Atrue%2C%22AdditionalInfo%22%3A%7B%7D%7D`;
    const ws = await new WebSocket(url.trim());

    ws.on('message', async (data) => {
      try {
        const signal = JSON.parse(
          JSON.parse(data.toString())?.M[0]?.A[0]
        ).device_state;

        const mergedSignal = {};

        for (const [key, value] of Object.entries(deviceState)) {
          mergedSignal[key] = signal[key] || value;
        }

        deviceState = { ...mergedSignal };

        if (JSON.stringify(deviceState) !== JSON.stringify(prevDeviceState)) {
          await signalModel.create({ ...deviceState, timestamp: Date.now() });
          await deviceStateModel.findOneAndUpdate(deviceState);

          prevDeviceState = deviceState;
        }
      } catch {}
    });

    /** Разрыв связи с сокетом по истечении интервала */
    setTimeout(() => {
      ws.terminate();
    }, AUTH_INTERVAL_TIME);
  };

  watcher();

  const authInterval = setInterval(watcher, AUTH_INTERVAL_TIME);
};
