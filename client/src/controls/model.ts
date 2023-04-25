import { createQuery } from "@farfetched/core";
import {
  combine,
  createEffect,
  createEvent,
  createStore,
  sample,
} from "effector";
import { tracksApi } from "./api";
import { createGate } from "effector-react";
import { debug, reset } from "patronum";

export const ControlsGate = createGate();
export const { open: controlsMounted, close: controlsUnmounted } = ControlsGate;

const fxGetTracks = createEffect().use(tracksApi.getTracks);

export const tracksQuery = createQuery({
  effect: fxGetTracks,
  mapData: ({ result, params }: any) =>
    result.reverse().map((track: any) => {
      const signals = track.signals;
      const lastSignal = signals[signals.length - 1];

      let alert = null;

      signals.forEach((signal: any) => {
        if (
          signal.front_pass_door === "true" ||
          signal.rear_right_door === "true" ||
          signal.hood === "true" ||
          signal.trunk === "true"
        ) {
          alert = true;
        }
      });

      return {
        ...track,
        alert: alert,
        segments: [
          {
            color: "#e84646",
            label: "A",
            coords: [
              ...signals.map((signal: any) => [signal.geo.lon, signal.geo.lat]),
            ],
          },
          {
            color: "#43e843",
            label: "B",
            coords: [[lastSignal.geo.lon, lastSignal.geo.lat]],
          },
        ],
      };
    }),
});

export const $currentTrackId = createStore<number | null>(null);
export const $currentTrack = combine(
  tracksQuery.$data,
  $currentTrackId,
  (tracks: any, currentId) =>
    tracks?.find((track: any) => track.id === currentId)
);
export const $currentSegmentId = createStore<number | null>(null);
export const $currentSegment = combine(
  $currentTrack,
  $currentSegmentId,
  (currentTrack, currentSegmentId) => {
    if (!currentSegmentId) return null;

    return currentTrack?.signals.find(
      (signal: any) => signal._id === currentSegmentId
    );
  }
);
export const $currentMark = createStore<any>(null);

debug({ $currentTrack });

export const setCurrentTrackId = createEvent<number>();
export const setCurrentSegmentId = createEvent<number>();
export const setCurrentMark = createEvent<any>();

/** Запрос треков при маунте */
sample({
  clock: controlsMounted,
  target: tracksQuery.start,
});

/** Обработка текущего трека */
$currentTrackId.on(setCurrentTrackId, (_, value) => value);

/** Обработка текущего сегмента */
$currentSegmentId.on(setCurrentSegmentId, (_, value) => value);

$currentMark.on(setCurrentMark, (_, value) => value);

reset({
  clock: setCurrentTrackId,
  target: [$currentSegmentId, $currentMark],
});

// result.length
//   ? result
//   : [
//     {
//       id: temp[0]?._id || null,
//       start: temp[0]?.createdAt || null,
//       stop: temp[temp.length - 1]?.createdAt || null,
//       signals: temp || null,
//     },
//   ]

// const getTracks = async (req, res) => {
//   const signalsData = await signal.find();
//
//   const result = [];
//   let temp = [];
//   let currentType = null;
//
//   signalsData.filter(
//     (signal) => !signal.geo?.lat || !signal.geo?.lon || !signal.ignition
//   );
//
//   signalsData.forEach((signal, index) => {
//     if (index === 0 && signalsData.length === 1) {
//       temp.push(signal);
//       currentType = signal.ignition;
//       result.push({
//         id: temp[0]._id || 'asd',
//         type: currentType === ENGINE_OFF ? 'parking' : 'moving',
//         start: temp[0].createdAt,
//         stop: temp[0].createdAt,
//         signals: temp,
//       });
//       temp = [];
//       return;
//     }
//
//     if (index === 0) {
//       temp.push(signal);
//       currentType = signal.ignition;
//       return;
//     }
//
//     if (currentType === signal.ignition && index === signalsData.length - 1) {
//       temp.push(signal);
//       result.push({
//         id: temp[0]._id || 'asd',
//         type: currentType === ENGINE_OFF ? 'parking' : 'moving',
//         start: temp[0].createdAt,
//         stop: temp[temp.length - 1].createdAt,
//         signals: temp,
//       });
//       temp = [];
//     } else if (currentType === signal.ignition) {
//       temp.push(signal);
//     } else if (currentType !== signal.ignition) {
//       result.push({
//         id: temp[0]._id || 'asd',
//         type: currentType === ENGINE_OFF ? 'parking' : 'moving',
//         start: temp[0].createdAt,
//         stop: temp[temp.length - 1].createdAt,
//         signals: temp,
//       });
//       temp = [];
//       temp.push(signal);
//       currentType = signal.ignition;
//     }
//   });
