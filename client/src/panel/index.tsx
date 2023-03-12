import {
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Pagination,
  Paper,
  Typography,
} from "@mui/material";
import SpeedIcon from "@mui/icons-material/Speed";
import RotateLeftOutlinedIcon from "@mui/icons-material/RotateLeftOutlined";
import React from "react";
import { Car } from "../car";
import { useUnit } from "effector-react";
import {
  $currentSegment,
  $currentSegmentId,
  $currentTrack,
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

  return (
    <Paper elevation={0}>
      <Typography variant="h5" gutterBottom>
        Ключевые моменты трека
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

          <List>
            <ListItem>
              <ListItemIcon>
                <SpeedIcon />
              </ListItemIcon>
              <ListItemText primary="Скорость" />
              <ListItemText primary={`${currentSegment?.speed} км/ч`} />
            </ListItem>

            <ListItem>
              <ListItemIcon>
                <RotateLeftOutlinedIcon />
              </ListItemIcon>
              <ListItemText primary="Обороты" />
              <ListItemText primary={`${currentSegment?.rpm}`} />
            </ListItem>
          </List>
        </>
      ) : null}
    </Paper>
  );
};
