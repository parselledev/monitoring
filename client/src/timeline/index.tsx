import { Slider } from "@mui/material";
import { TimelineContainer } from "./styled";
import { useUnit } from "effector-react";
import {
  $currentSegmentId,
  $currentTrack,
  setCurrentSegmentId,
} from "../controls/model";

export const Timeline = () => {
  const [currentTrack, currentSegmentId] = useUnit([
    $currentTrack,
    $currentSegmentId,
  ]);

  if (!currentTrack) return null;

  const timelineData = currentTrack.signals.filter(
    (signal: any) =>
      signal.speed === 20 ||
      signal.driver_door === "Open" ||
      signal.front_pass_door === "Open" ||
      signal.rear_left_door === "open" ||
      signal.rear_right_door === "Open" ||
      signal.hood === "Open" ||
      signal.trunk === "Open"
  );

  const handleChange = (event: Event, newValue: number | number[]) => {
    if (typeof newValue === "number") {
      setCurrentSegmentId(timelineData[newValue]._id);
    }
  };

  return (
    <TimelineContainer>
      {timelineData.length ? (
        <Slider
          value={timelineData.findIndex(
            (signal: any) => signal._id === currentSegmentId
          )}
          onChange={handleChange}
          defaultValue={0}
          step={1}
          marks
          min={0}
          max={timelineData.length - 1}
          valueLabelDisplay="auto"
        />
      ) : null}
    </TimelineContainer>
  );
};
