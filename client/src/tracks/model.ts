// @ts-nocheck
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

const fxGetSignals = createEffect().use(tracksApi.getSignals);

export const signalsQuery = createQuery({
  effect: fxGetSignals,
  mapData: ({ result: signals, params }: any) => {
    const ENGINE_OFF = false;
    const tracks = [];
    let temp = [];
    let currentType = null;

    signals.filter(
      (signal) => !signal.geo?.lat || !signal.geo?.lon || !signal.ignition
    );

    signals.forEach((signal, index) => {
      if (index === 0 && signals.length === 1) {
        temp.push(signal);
        currentType = signal.ignition;
        tracks.push({
          id: temp[0]._id || "asd",
          type: currentType === ENGINE_OFF ? "parking" : "moving",
          start: temp[0].createdAt,
          stop: temp[0].createdAt,
          signals: temp,
        });
        temp = [];
        return;
      }

      if (index === 0) {
        temp.push(signal);
        currentType = signal.ignition;
        return;
      }

      if (currentType === signal.ignition && index === signals.length - 1) {
        temp.push(signal);
        tracks.push({
          id: temp[0]._id || "asd",
          type: currentType === ENGINE_OFF ? "parking" : "moving",
          start: temp[0].createdAt,
          stop: temp[temp.length - 1].createdAt,
          signals: temp,
        });
        temp = [];
      } else if (currentType === signal.ignition) {
        temp.push(signal);
      } else if (currentType !== signal.ignition) {
        tracks.push({
          id: temp[0]._id || "asd",
          type: currentType === ENGINE_OFF ? "parking" : "moving",
          start: temp[0].createdAt,
          stop: temp[temp.length - 1].createdAt,
          signals: temp,
        });
        temp = [];
        temp.push(signal);
        currentType = signal.ignition;
      }
    });

    return tracks.reverse().map((track: any) => {
      const readySignals = track.signals;
      const lastSignal = readySignals[readySignals.length - 1];

      let alert = null;

      readySignals.forEach((signal: any) => {
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
              ...readySignals.map((signal: any) => [
                signal.geo.lon,
                signal.geo.lat,
              ]),
            ],
          },
          {
            color: "#43e843",
            label: "B",
            coords: [[lastSignal.geo.lon, lastSignal.geo.lat]],
          },
        ],
      };
    });
  },
});

export const $currentTrackId = createStore<number | null>(null);
export const $currentTrack = combine(
  signalsQuery.$data,
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
  target: signalsQuery.start,
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

debug(signalsQuery.$data);

// tracks.length
//   ? tracks
//   : [
//     {
//       id: temp[0]?._id || null,
//       start: temp[0]?.createdAt || null,
//       stop: temp[temp.length - 1]?.createdAt || null,
//       signals: temp || null,
//     },
//   ]
