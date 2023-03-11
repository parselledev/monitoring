import { WebSocket } from "ws";
import { auth } from "./auth.js";
import { database } from "./database.js";
import { initialDeviceState } from "./entities/initialDeviceState.js";

export const watcher = async () => {
  const dozor = await auth();
  const connectionTocken = encodeURIComponent(
    dozor._dozor._garage._signal._connection_token
  );
  const sessionId = encodeURIComponent(dozor._dozor._garage._session_id);
  const lkId = dozor._dozor._garage._profile_id;
  const endpoint = `wss://monitoring.tecel.ru/url_signal_r/connect?transport=webSockets&clientProtocol=1.5&connectionToken=${connectionTocken}&connectionData=%5B%7B%22name%22%3A%22ControlService%22%7D%5D&tid=0&Lang=ru&SessionGuid=${sessionId}&ClientData=%7B%22AppName%22%3A%22Prizrak+WEB+Monitoring%22%2C%22AppVersion%22%3A%221.0.65%22%2C%22AppHost%22%3A%22monitoring.tecel.ru%22%2C%22IsUserDataAvailable%22%3Atrue%2C%22AdditionalInfo%22%3A%7B%7D%7D`;
  const url = endpoint.trim();
  const ws = await new WebSocket(url);

  let deviceState = initialDeviceState;
  let prevDeviceState = initialDeviceState;
  let intervalCount = 1;

  ws.on("open", () => {
    setInterval(async () => {
      if (JSON.stringify(deviceState) !== JSON.stringify(prevDeviceState)) {
        await database.addSignal(deviceState);
        prevDeviceState = deviceState;
      }
    }, 5000);

    ws.on("message", function (data) {
      try {
        const signal = JSON.parse(
          JSON.parse(data.toString())?.M[0]?.A[0]
        ).device_state;

        const mergedSignal = {};

        for (const [key, value] of Object.entries(deviceState)) {
          mergedSignal[key] = signal[key] || value;
        }

        deviceState = { ...mergedSignal, timestamp: Date.now() };

        console.log(deviceState);
      } catch {
        console.log("[X] Ошибка в сигнале");
      }
    });
  });
};

// clearInterval(databaseInterval);
// clearInterval(confirmationInterval);
// tempSignals.length = 0;

// const confirmationInterval = setInterval(() => {
//   if (ws)
//     ws.send({
//       H: "ControlService",
//       M: "SetConnectionActivity",
//       A: [
//         {
//           session_id: sessionId,
//           lk_id: lkId,
//           api_version: "1",
//         },
//       ],
//       I: intervalCount,
//     });
//   intervalCount++;
//   console.log(`Отправлен сигнал поддержки соединения`);
// });
