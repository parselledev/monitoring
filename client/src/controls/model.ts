import { createQuery } from "@farfetched/core";
import { createEffect, createEvent, createStore, sample } from "effector";
import { tracksApi } from "./api";
import { createGate } from "effector-react";

export const ControlsGate = createGate();
export const { open: controlsMounted, close: controlsUnmounted } = ControlsGate;

const fxGetTracks = createEffect().use(tracksApi.getTracks);

export const tracksQuery = createQuery({
  effect: fxGetTracks,
});

export const $currentTrack = createStore<Number | null>(null);

export const setCurrentTrack = createEvent<Number>();

/** Запрос треков при маунте */
sample({
  clock: controlsMounted,
  target: tracksQuery.start,
});

/** Обработка текущего трека */
$currentTrack.on(setCurrentTrack, (_, value) => value);
