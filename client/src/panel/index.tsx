import { Button, Pagination, Paper, Typography } from "@mui/material";
import React from "react";
import { Car } from "../car";
import { useUnit } from "effector-react";
import {
  $currentSegment,
  $currentSegmentId,
  $currentTrack,
  setCurrentMark,
  setCurrentSegmentId,
} from "../controls/model";

export const Panel = () => {
  const [currentSegment, currentSegmentId, currentTrack] = useUnit([
    $currentSegment,
    $currentSegmentId,
    $currentTrack,
  ]);

  if (!currentTrack) return null;

  const panelData = currentTrack.signals.filter(
    (signal: any) =>
      signal.driver_door === "Open" ||
      signal.front_pass_door === "Open" ||
      signal.rear_left_door === "open" ||
      signal.rear_right_door === "Open" ||
      signal.hood === "Open" ||
      signal.trunk === "Open"
  );

  const handleChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setCurrentSegmentId(panelData[value - 1]._id);
  };

  const handleMarkClick = () => {
    setCurrentMark([currentSegment.geo.lon, currentSegment.geo.lat]);
  };

  return (
    <Paper
      elevation={0}
      style={{
        padding: 15,
        display: "grid",
        gap: 10,
        gridTemplateColumns: "250px",
      }}
    >
      <Typography variant="h5" gutterBottom>
        Ключевые моменты
      </Typography>

      <Pagination
        count={panelData.length}
        page={
          panelData.findIndex(
            (signal: any) => signal._id === currentSegmentId
          ) + 1
        }
        onChange={handleChange}
      />

      {currentSegment ? (
        <>
          <Car />
          <Button variant="contained" onClick={handleMarkClick}>
            Показать на карте
          </Button>
        </>
      ) : null}
    </Paper>
  );
};
