import { Slider } from "@mui/material";
import { TimelineContainer } from "./styled";
import { useUnit } from "effector-react";
import { $currentTrack } from "../controls/model";

export const Timeline = () => {
  const [currentTrack] = useUnit([$currentTrack]);

  if (!currentTrack) return null;

  return (
    <TimelineContainer>
      <Slider
        defaultValue={0}
        step={1}
        marks
        min={0}
        max={currentTrack.signals.length}
        valueLabelDisplay="auto"
      />
    </TimelineContainer>
  );
};
