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
  Paper,
  Typography,
} from "@mui/material";
import LocalParkingIcon from "@mui/icons-material/LocalParking";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";

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
          style={{
            display: "grid",
            gridTemplateColumns: "auto auto auto 1fr auto",
            gap: 5,
            cursor: "pointer",
          }}
        >
          {track.type === "parking" ? (
            <LocalParkingIcon />
          ) : (
            <DirectionsCarIcon />
          )}

          <span style={{ marginRight: 10 }}>
            {moment.unix(track.start / 1000).format("DD.MM")}
          </span>
          <div
            style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}
          >
            <Chip label={`${startDate.format("HH:MM")}`} />
            <Chip label={`${stopDate.format("HH:MM")}`} />
          </div>

          <Chip label={`${duration} мин`} variant="outlined" />
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
