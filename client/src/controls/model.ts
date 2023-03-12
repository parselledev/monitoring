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

export const ControlsGate = createGate();
export const { open: controlsMounted, close: controlsUnmounted } = ControlsGate;

const fxGetTracks = createEffect().use(tracksApi.getTracks);

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

export const $currentTrackId = createStore<number | null>(null);
export const $currentTrack = combine(
  tracksQuery.$data,
  $currentTrackId,
  (tracks: any, currentId) =>
    tracks?.find((track: any) => track.id === currentId)
);
export const $currentSegmentId = createStore<number>(0);
export const $currentSegment = combine(
  $currentTrack,
  $currentSegmentId,
  (currentTrack, currentSegmentId) =>
    currentTrack?.signals.find((signal: any) => signal._id === currentSegmentId)
);

export const setCurrentTrackId = createEvent<number>();
export const setCurrentSegmentId = createEvent<number>();

/** Запрос треков при маунте */
sample({
  clock: controlsMounted,
  target: tracksQuery.start,
});

/** Обработка текущего трека */
$currentTrackId.on(setCurrentTrackId, (_, value) => value);

/** Обработка текущего сегмента */
$currentSegmentId.on(setCurrentSegmentId, (_, value) => value);
