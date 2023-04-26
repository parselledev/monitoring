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
    // signals.filter(
    //   (signal) => !signal.geo?.lat || !signal.geo?.lon || !signal.ignition
    // );

    const groupedSignals = signals
      .reduce((acc, signal) => {
        if (acc.length && acc[acc.length - 1][0].ignition === signal.ignition) {
          acc[acc.length - 1].push(signal);
        } else {
          acc.push([signal]);
        }

        return acc;
      }, [])
      .reverse();

    return groupedSignals.map((group, index) => {
      const firstSignal = group[0];
      const lastSignal = group[group.length - 1];
      const nextGroup = groupedSignals[index - 1] || null;

      return {
        id: firstSignal._id,
        type: firstSignal.ignition === false ? "parking" : "moving",
        start: firstSignal.createdAt,
        stop: nextGroup ? nextGroup[0].createdAt : lastSignal.createdAt,
        segments: group,
        markers: [
          {
            color: "#e84646",
            label: "A",
            coords: [
              ...group.map((signal: any) => [signal.geo.lon, signal.geo.lat]),
            ],
          },
          {
            color: "#43e843",
            label: "B",
            coords: [[lastSignal.geo.lon, lastSignal.geo.lat]],
          },
        ],
        alert: group.some(
          (signal) =>
            signal.front_pass_door === "true" ||
            signal.rear_right_door === "true" ||
            signal.hood === "true" ||
            signal.trunk === "true"
        ),
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

debug($currentTrack);

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
