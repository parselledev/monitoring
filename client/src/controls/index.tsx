import { useGate } from "effector-react";
import { ControlsContainer } from "./styled";
import { ControlsGate } from "./model";

export const Controls = () => {
  useGate(ControlsGate);

  return <ControlsContainer>features controls</ControlsContainer>;
};
