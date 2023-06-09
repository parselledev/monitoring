import { useGate, useUnit } from "effector-react";
import moment from "moment";
import {
  $currentTrackId,
  ControlsGate,
  setCurrentTrackId,
  signalsQuery,
} from "./model";
import React, { useRef } from "react";
import {
  Chip,
  CircularProgress,
  List,
  ListItemButton,
  Typography,
} from "@mui/material";
import LocalParkingIcon from "@mui/icons-material/LocalParking";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import WarningIcon from "@mui/icons-material/Warning";
import { Panel } from "../panel";

export const Tracks = () => {
  useGate(ControlsGate);

  const { data, pending }: any = useUnit(signalsQuery);
  const [currentTrackId] = useUnit([$currentTrackId]);
  const windowSize = useRef([window.innerWidth, window.innerHeight]);
  const windowWidth = windowSize.current[0];

  console.log(windowSize);

  if (pending) return <CircularProgress style={{ margin: "50px auto" }} />;
  if (!data) return <Typography variant="h6">Нет треков</Typography>;

  const handleTrackClick = (id: number) => {
    setCurrentTrackId(id);
  };

  const renderTracks = () =>
    data.map((track: any, index: number) => {
      const isFirstTrack = index === 0;
      const isParking = track.type === "parking";
      const startDate = moment(track.start);
      const stopDate =
        isParking && isFirstTrack ? moment() : moment(track.stop);

      const dif = moment.duration(stopDate.diff(startDate));
      const duration =
        dif.hours() === 0
          ? `${dif.minutes()} мин`
          : `${dif.hours()} ч : ${dif.minutes()} мин`;

      return (
        <ListItemButton
          key={track.id}
          selected={currentTrackId === track.id}
          onClick={(event) => handleTrackClick(track.id)}
          style={{
            display: "grid",
            gridTemplateColumns: "auto auto auto auto auto auto",
            gap: 5,
            cursor: "pointer",
          }}
        >
          {isParking ? (
            <LocalParkingIcon style={{ opacity: 0.3 }} />
          ) : (
            <DirectionsCarIcon />
          )}

          <span style={{ marginRight: 10 }}>
            {moment(track.start).format("DD.MM")}
          </span>
          <div
            style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}
          >
            <Chip label={`${startDate.format("HH:mm")}`} />
            <Chip label={`${stopDate.format("HH:mm")}`} />
          </div>

          <Chip label={duration} variant="outlined" />

          {track.alert ? <WarningIcon color="warning" /> : null}
        </ListItemButton>
      );
    });

  return (
    <div
      style={{
        height: "100%",
        overflow: "hidden",
        display: windowWidth > 500 ? "grid" : "unset",
        gridTemplateColumns: "1fr 1fr",
      }}
    >
      <List style={{ maxHeight: "100%", overflowY: "scroll" }}>
        {renderTracks()}
      </List>

      {windowWidth > 500 ? <Panel /> : null}
    </div>
  );
};
