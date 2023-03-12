import { Slider } from "@mui/material";
import { TimelineContainer } from "./styled";
import { useUnit } from "effector-react";
import {
  $currentSegmentIndex,
  $currentTrack,
  setCurrentSegmentIndex,
} from "../controls/model";

export const Timeline = () => {
  const [currentTrack, currentSegmentIndex] = useUnit([
    $currentTrack,
    $currentSegmentIndex,
  ]);

  if (!currentTrack) return null;

  const handleChange = (event: Event, newValue: number | number[]) => {
    if (typeof newValue === "number") {
      setCurrentSegmentIndex(newValue);
    }
  };

  return (
    <TimelineContainer>
      <Slider
        onChange={handleChange}
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
