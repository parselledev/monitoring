import { useGate, useUnit } from "effector-react";
import moment from "moment";
import { ControlsContainer } from "./styled";
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
  ListItemIcon,
  ListItemText,
} from "@mui/material";

export const Controls = () => {
  useGate(ControlsGate);

  const { data, pending }: any = useUnit(tracksQuery);
  const [currentTrackId] = useUnit([$currentTrackId]);

  if (pending || !data) return <CircularProgress />;

  const handleTrackClick = (id: number) => {
    setCurrentTrackId(id);
  };

  const renderTracks = () =>
    data.map((track: any, index: number) => (
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
          primary={`${moment
            .unix(track.start / 1000)
            .format("h:m")} --- ${moment
            .unix(track.stop / 1000)
            .format("h:m")}`}
        />
      </ListItemButton>
    ));

  return (
    <ControlsContainer>
      <List>{renderTracks()}</List>
    </ControlsContainer>
  );
};
