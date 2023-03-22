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
      const startDate = moment(track.start);
      const stopDate = moment(track.stop);

      const dif = moment.duration(stopDate.diff(startDate));
      const duration = [`${dif.hours()} ч`, `${dif.minutes()} мин`].join(" : ");
      // console.log('dif in Mins: ', (dif.hours() * 60) + dif.minutes());

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
            {moment(track.start).format("DD.MM")}
          </span>
          <div
            style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}
          >
            <Chip label={`${startDate.format("HH:mm")}`} />
            <Chip label={`${stopDate.format("HH:mm")}`} />
          </div>

          <Chip label={duration} variant="outlined" />
        </ListItemButton>
      );
    });

  return (
    <div>
      <ControlsHeader>
        <Typography variant="h5" gutterBottom>
          Треки
        </Typography>
      </ControlsHeader>

      <List style={{ maxHeight: "60vh", overflowY: "scroll" }}>
        {renderTracks()}
      </List>
    </div>
  );
};
