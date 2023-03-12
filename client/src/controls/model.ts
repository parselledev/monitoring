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
import { debug } from "patronum";

export const ControlsGate = createGate();
export const { open: controlsMounted, close: controlsUnmounted } = ControlsGate;

const fxGetTracks = createEffect().use(tracksApi.getTracks);

// [
//   {
//     color: "#e84646",
//     label: "A",
//     coords: [
//       [20.537042, 54.711877],
//       [20.537693, 54.709871],
//       [20.549342, 54.709811],
//     ],
//   },
//   {
//     color: "#43e843",
//     label: "B",
//     coords: [[20.549342, 54.709811]],
//   },
// ]

export const tracksQuery = createQuery({
  effect: fxGetTracks,
  mapData: ({ result, params }: any) =>
    result.map((track: any) => {
      const signals = track.signals;
      const firstSignal = signals[0];
      const lastSignal = signals[signals.length - 1];

      return {
        ...track,
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

export const $currentTrackId = createStore<Number | null>(null);
export const $currentTrack = combine(
  tracksQuery.$data,
  $currentTrackId,
  (tracks: any, currentId) =>
    tracks?.find((track: any) => track.id === currentId)
);

debug({ $currentTrack, $currentTrackId });

export const setCurrentTrackId = createEvent<Number>();

/** Запрос треков при маунте */
sample({
  clock: controlsMounted,
  target: tracksQuery.start,
});

/** Обработка текущего трека */
$currentTrackId.on(setCurrentTrackId, (_, value) => value);
