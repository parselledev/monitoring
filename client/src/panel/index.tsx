import {
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Paper,
  Typography,
} from "@mui/material";
import SpeedIcon from "@mui/icons-material/Speed";
import RotateLeftOutlinedIcon from "@mui/icons-material/RotateLeftOutlined";
import React from "react";
import { Car } from "../car";
import { useUnit } from "effector-react";
import { $currentSegment } from "../controls/model";

export const Panel = () => {
  const [currentSegment] = useUnit([$currentSegment]);

  if (!currentSegment) return null;

  return (
    <Paper elevation={0}>
      <Typography variant="h5" gutterBottom>
        Информация по сегменту
      </Typography>

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
    </Paper>
  );
};
