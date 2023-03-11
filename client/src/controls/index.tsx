import { useGate, useUnit } from "effector-react";
import moment from "moment";
import { ControlsContainer } from "./styled";
import {
  $currentTrack,
  ControlsGate,
  setCurrentTrack,
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
  const [currentTrack] = useUnit([$currentTrack]);

  if (pending || !data) return <CircularProgress />;

  const handleTrackClick = (number: number) => {
    setCurrentTrack(number);
  };

  const renderTracks = () =>
    data.map((signal: any, index: number) => (
      <ListItemButton
        key={signal.id}
        selected={currentTrack === index}
        onClick={(event) => handleTrackClick(index)}
      >
        <Chip
          label={moment.unix(signal.start / 1000).format("DD.MM")}
          style={{ marginRight: 10 }}
        />
        <ListItemText
          primary={`${moment
            .unix(signal.start / 1000)
            .format("h:m")} --- ${moment
            .unix(signal.stop / 1000)
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
