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
      signal.driver_door === "Open" ||
      signal.front_pass_door === "Open" ||
      signal.rear_left_door === "open" ||
      signal.rear_right_door === "Open" ||
      signal.hood === "Open" ||
      signal.trunk === "Open" ||
      signal.guard === "SafeGuardOn"
  );

  const handleMarkClick = (segment: any) => {
    setCurrentMark([segment.geo.lon, segment.geo.lat]);
  };

  const renderSegments = () =>
    panelData.map((segment: any, index: number) => (
      <ListItemButton
        key={segment.timestamp}
        onClick={() => handleMarkClick(segment)}
        style={{ display: "grid", gridTemplateColumns: "auto auto", gap: 15 }}
      >
        <Chip label={`${moment(segment.timestamp).format("HH:mm")}`} />
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
