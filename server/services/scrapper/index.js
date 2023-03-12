const auth = require('./auth');
const initialDeviceState = require('./entities/initialDeviceState');
const signalModel = require('../../models/signal');
const WebSocket = require('ws');

const AUTH_INTERVAL_TIME = 1000 * 60 * 5; // 5 мин.
const DATABASE_INTERVAL_TIME = 500;

module.exports = () => {
  let deviceState = initialDeviceState;
  let prevDeviceState = initialDeviceState;

  const watcher = async () => {
    const dozor = await auth();

    /** --------------Watcher------------- */

    const connectionToken = encodeURIComponent(
      dozor._dozor._garage._signal._connection_token
    );
    const sessionId = encodeURIComponent(dozor._dozor._garage._session_id);
    const lkId = dozor._dozor._garage._profile_id;
    const endpoint = `wss://monitoring.tecel.ru/url_signal_r/connect?transport=webSockets&clientProtocol=1.5&connectionToken=${connectionToken}&connectionData=%5B%7B%22name%22%3A%22ControlService%22%7D%5D&tid=0&Lang=ru&SessionGuid=${sessionId}&ClientData=%7B%22AppName%22%3A%22Prizrak+WEB+Monitoring%22%2C%22AppVersion%22%3A%221.0.65%22%2C%22AppHost%22%3A%22monitoring.tecel.ru%22%2C%22IsUserDataAvailable%22%3Atrue%2C%22AdditionalInfo%22%3A%7B%7D%7D`;
    const url = endpoint.trim();
    const ws = await new WebSocket(url);

    ws.on('open', () => {
      setInterval(async () => {
        if (JSON.stringify(deviceState) !== JSON.stringify(prevDeviceState)) {
          await signalModel.create({ ...deviceState, timestamp: Date.now() });
          prevDeviceState = deviceState;
        }
      }, DATABASE_INTERVAL_TIME);

      ws.on('message', function (data) {
        try {
          const signal = JSON.parse(
            JSON.parse(data.toString())?.M[0]?.A[0]
          ).device_state;

          const mergedSignal = {};

          for (const [key, value] of Object.entries(deviceState)) {
            mergedSignal[key] = signal[key] || value;
          }

          if (mergedSignal.speed > 0) {
            mergedSignal.guard = 'SafeGuardOff';
          }

          deviceState = { ...mergedSignal };
        } catch {
          console.log('[X] Ошибка в сигнале');
        }
      });
    });

    /** ---------------------------------- */

    /** Разрыв связи с сокетом по истечении интервала */
    setTimeout(() => {
      ws.terminate();
    }, AUTH_INTERVAL_TIME);
  };

  watcher();

  const authInterval = setInterval(watcher, AUTH_INTERVAL_TIME);
};
