import { Paper } from "@mui/material";
import carImg from "./img/car.png";
import driverDoorImg from "./img/door-front-left-opened.png";
import frontPassDoorImg from "./img/door-front-right-opened.png";
import rearLeftDoorImg from "./img/door-back-left-opened.png";
import rearRightDoorImg from "./img/door-back-right-opened.png";
import hoodImg from "./img/hood.png";
import trunkImg from "./img/trunk.png";
import { useUnit } from "effector-react";
import { $currentSegment } from "../controls/model";

export const Car = () => {
  const [currentSegment] = useUnit([$currentSegment]);

  const {
    driver_door,
    front_pass_door,
    rear_left_door,
    rear_right_door,
    hood,
    trunk,
  } = currentSegment;

  const driverDoorSrc = driver_door === "Open" ? driverDoorImg : "";
  const frontPassDoorSrc = front_pass_door === "Open" ? frontPassDoorImg : "";
  const rearLeftDoorSrc = rear_left_door === "Open" ? rearLeftDoorImg : "";
  const rearRightDoorSrc = rear_right_door === "Open" ? rearRightDoorImg : "";
  const hoodSrc = hood === "Open" ? hoodImg : "";
  const trunkSrc = trunk === "Open" ? trunkImg : "";

  return (
    <Paper
      elevation={0}
      style={{
        position: "relative",
        width: 310,
        height: 200,
        background: `url(${carImg}) no-repeat 18px 40px`,
        transform: "scale(0.8) translateX(-40px)",
      }}
    >
      {driverDoorSrc && (
        <img
          src={driverDoorSrc}
          style={{
            position: "absolute",
            top: 142,
            right: 143,
            height: 53,
          }}
        />
      )}

      <img
        src={frontPassDoorSrc}
        style={{
          position: "absolute",
          top: 5,
          right: 143,
          height: 53,
        }}
      />
      {rearLeftDoorSrc && (
        <img
          src={rearLeftDoorSrc}
          style={{
            position: "absolute",
            top: 142,
            right: 84,
            height: 53,
          }}
        />
      )}

      {rearRightDoorSrc && (
        <img
          src={rearRightDoorSrc}
          style={{
            position: "absolute",
            top: 5,
            right: 84,
            height: 53,
          }}
        />
      )}

      {hoodSrc && (
        <img
          src={hoodSrc}
          style={{
            position: "absolute",
            top: 56,
            right: 210,
            width: 72,
            height: 90,
          }}
        />
      )}

      {trunkSrc && (
        <img
          src={trunkSrc}
          style={{
            position: "absolute",
            top: 64,
            right: 23,
            width: 28,
            height: 74,
          }}
        />
      )}
    </Paper>
  );
};
