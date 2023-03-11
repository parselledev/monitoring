import { createQuery } from "@farfetched/core";
import { createEffect, createEvent, createStore, sample } from "effector";
import { signalsApi } from "./api";
import { createGate } from "effector-react";

export const ControlsGate = createGate();
export const { open: controlsMounted, close: controlsUnmounted } = ControlsGate;

const fxGetSignals = createEffect().use(signalsApi.getSignals);

export const signalsQuery = createQuery({
  effect: fxGetSignals,
});

export const $currentSignal = createStore<Number | null>(null);

export const setCurrentSignal = createEvent<Number>();

/** Запрос сигналов при маунте */
sample({
  clock: controlsMounted,
  target: signalsQuery.start,
});

/** Обработка текущего сигнала */
$currentSignal.on(setCurrentSignal, (_, value) => value);
