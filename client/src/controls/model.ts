import { createQuery } from "@farfetched/core";
import { createEffect, sample } from "effector";
import { signalsApi } from "./api";
import { createGate } from "effector-react";

export const ControlsGate = createGate();
export const { open: controlsMounted, close: controlsUnmounted } = ControlsGate;

const fxGetSignals = createEffect().use(signalsApi.getSignals);

export const signalsQuery = createQuery({
  effect: fxGetSignals,
});

sample({
  clock: controlsMounted,
  filter: (data) => Boolean(data),
  target: signalsQuery.start,
});
