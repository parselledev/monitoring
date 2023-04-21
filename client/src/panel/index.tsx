import { Chip, List, ListItemButton, Paper, Typography } from "@mui/material";
import React from "react";
import { useUnit } from "effector-react";
import {
  $currentSegment,
  $currentSegmentId,
  $currentTrack,
  setCurrentMark,
} from "../controls/model";
import moment from "moment/moment";
import { Car } from "../car";

export const Panel = () => {
  const [currentSegment, currentSegmentId, currentTrack] = useUnit([
    $currentSegment,
    $currentSegmentId,
    $currentTrack,
  ]);

  if (!currentTrack) return null;

  const panelData = currentTrack.signals.filter(
    (signal: any) =>
      signal.driver_door === "true" ||
      signal.front_pass_door === "true" ||
      signal.rear_left_door === "true" ||
      signal.rear_right_door === "true" ||
      signal.hood === "true" ||
      signal.trunk === "true" ||
      signal.guard === "true"
  );

  const handleMarkClick = (segment: any) => {
    setCurrentMark([segment.geo.lon, segment.geo.lat]);
  };

  const renderSegments = () =>
    panelData.map((segment: any, index: number) => (
      <ListItemButton
        key={segment.createdAt}
        onClick={() => handleMarkClick(segment)}
        style={{ position: "relative", padding: 0 }}
      >
        <Chip
          label={`${moment(segment.createdAt).format("HH:mm")}`}
          style={{ position: "absolute", left: 12, zIndex: 10 }}
        />
        <Car segment={segment} />
      </ListItemButton>
    ));

  return (
    <Paper
      elevation={0}
      style={{
        padding: 15,
        display: "grid",
        gap: 10,
        gridTemplateColumns: "250px",
        justifyItems: "start",
        justifyContent: "start",
      }}
    >
      <Typography variant="h5" gutterBottom>
        Ключевые моменты
      </Typography>

      <List>{renderSegments()}</List>
    </Paper>
  );
};
