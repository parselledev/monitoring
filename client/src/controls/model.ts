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
import { reset } from "patronum";

export const ControlsGate = createGate();
export const { open: controlsMounted, close: controlsUnmounted } = ControlsGate;

const fxGetTracks = createEffect().use(tracksApi.getTracks);

export const tracksQuery = createQuery({
  effect: fxGetTracks,
  mapData: ({ result, params }: any) =>
    result.reverse().map((track: any) => {
      const signals = track.signals;
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
