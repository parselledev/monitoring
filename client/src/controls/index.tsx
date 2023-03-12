import { useGate, useUnit } from "effector-react";
import moment from "moment";
import { ControlsHeader } from "./styled";
import {
  $currentTrackId,
  ControlsGate,
  setCurrentTrackId,
  tracksQuery,
} from "./model";
import React from "react";
import {
  Chip,
  CircularProgress,
  List,
  ListItemButton,
  ListItemText,
  Paper,
  Typography,
} from "@mui/material";

export const Controls = () => {
  useGate(ControlsGate);

  const { data, pending }: any = useUnit(tracksQuery);
  const [currentTrackId] = useUnit([$currentTrackId]);

  if (pending) return <CircularProgress />;
  if (!data) return <Typography variant="h6">Нет треков</Typography>;

  const handleTrackClick = (id: number) => {
    setCurrentTrackId(id);
  };

  const renderTracks = () =>
    data.map((track: any, index: number) => {
      const startDate = moment.unix(track.start / 1000);
      const stopDate = moment.unix(track.stop / 1000);
      const duration = moment.duration(stopDate.diff(startDate)).minutes();

      return (
        <ListItemButton
          key={track.id}
          selected={currentTrackId === track.id}
          onClick={(event) => handleTrackClick(track.id)}
        >
          <Chip
            label={moment.unix(track.start / 1000).format("DD.MM")}
            style={{ marginRight: 10 }}
          />
          <ListItemText
            primary={`${startDate.format("h:m")} - ${stopDate.format("h:m")}`}
          />
          <Chip label={`${duration} минут`} variant="outlined" />
        </ListItemButton>
      );
    });

  return (
    <Paper elevation={0}>
      <ControlsHeader>
        <Typography variant="h5" gutterBottom>
          Треки
        </Typography>
      </ControlsHeader>

      <List>{renderTracks()}</List>
    </Paper>
  );
};
