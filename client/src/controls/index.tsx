import { useGate, useUnit } from "effector-react";
import moment from "moment";
import { ControlsContainer } from "./styled";
import {
  $currentSignal,
  ControlsGate,
  setCurrentSignal,
  signalsQuery,
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

  const { data, pending }: any = useUnit(signalsQuery);
  const [currentSignal] = useUnit([$currentSignal]);

  if (pending || !data) return <CircularProgress />;

  const handleSignalClick = (number: number) => {
    setCurrentSignal(number);
  };

  const renderSignals = () =>
    data.map((signal: any, index: number) => (
      <ListItemButton
        key={signal.id}
        selected={currentSignal === index}
        onClick={(event) => handleSignalClick(index)}
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
      <List>{renderSignals()}</List>
    </ControlsContainer>
  );
};
