import { Chip, List, ListItemButton, Paper, Typography } from "@mui/material";
import React from "react";
import { useUnit } from "effector-react";
import { $currentTrack, setCurrentMark } from "../tracks/model";
import moment from "moment/moment";
import { Car } from "../car";

export const Panel = () => {
  const [currentTrack] = useUnit([$currentTrack]);

  if (!currentTrack) return null;

  const panelData = currentTrack.segments.filter(
    (signal: any) =>
      signal.driver_door === "true" ||
      signal.front_pass_door === "true" ||
      signal.rear_left_door === "true" ||
      signal.rear_right_door === "true" ||
      signal.hood === "true" ||
      signal.trunk === "true" ||
      signal.guard === "true"
  );

  const handleMarkClick = (segment: any) => {
    setCurrentMark([segment.geo.lon, segment.geo.lat]);
  };

  const renderSegments = () =>
    panelData.map((segment: any, index: number) => {
      const nextSegment = panelData[index + 1];
      let dif, duration;

      if (nextSegment) {
        dif = moment.duration(
          moment(nextSegment.createdAt).diff(moment(segment.createdAt))
        );

        duration =
          dif.hours() === 0
            ? `${dif.minutes()} мин`
            : `${dif.hours()} ч : ${dif.minutes()} мин`;
      }

      return (
        <div
          style={{
            display: "grid",
            justifyItems: "center",
          }}
        >
          <ListItemButton
            key={segment.createdAt}
            onClick={() => handleMarkClick(segment)}
            style={{ position: "relative", padding: 0 }}
          >
            <Chip
              label={`${moment(segment.createdAt).format("HH:mm")}`}
              style={{ position: "absolute", left: 12, zIndex: 10 }}
            />
            <Car segment={segment} />
          </ListItemButton>

          {nextSegment && dif && dif.minutes() > 0 ? (
            <Chip label={duration} />
          ) : null}
        </div>
      );
    });

  return (
    <Paper
      elevation={0}
      style={{
        padding: 15,
        display: "grid",
        alignContent: "start",
        gap: 10,
        gridTemplateColumns: "250px",
        justifyItems: "start",
        justifyContent: "start",
        overflowY: "scroll",
      }}
    >
      <Typography variant="h5" gutterBottom>
        Ключевые моменты
      </Typography>

      <List>{renderSegments()}</List>
    </Paper>
  );
};
