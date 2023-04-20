import { Paper } from "@mui/material";
import carImg from "./img/car.png";
import lockImg from "./img/icons-big.png";
import driverDoorImg from "./img/door-front-left-opened.png";
import frontPassDoorImg from "./img/door-front-right-opened.png";
import rearLeftDoorImg from "./img/door-back-left-opened.png";
import rearRightDoorImg from "./img/door-back-right-opened.png";
import hoodImg from "./img/hood.png";
import trunkImg from "./img/trunk.png";

export const Car = ({ segment }: any) => {
  if (!segment) return null;

  const {
    guard,
    driver_door,
    front_pass_door,
    rear_left_door,
    rear_right_door,
    hood,
    trunk,
  } = segment;

  const lockSrc = guard === true ? lockImg : "";
  const driverDoorSrc = driver_door === "true" ? driverDoorImg : "";
  const frontPassDoorSrc = front_pass_door === "true" ? frontPassDoorImg : "";
  const rearLeftDoorSrc = rear_left_door === "true" ? rearLeftDoorImg : "";
  const rearRightDoorSrc = rear_right_door === "true" ? rearRightDoorImg : "";
  const hoodSrc = hood === "true" ? hoodImg : "";
  const trunkSrc = trunk === "true" ? trunkImg : "";

  return (
    <Paper
      elevation={0}
      style={{
        position: "relative",
      }}
    >
      <img src={carImg} />

      {lockSrc && (
        <div
          style={{
            position: "absolute",
            top: 37,
            right: 85,
            width: 40,
            height: 40,
            background: `url(${lockImg}) no-repeat 0 0`,
          }}
        />
      )}

      {driverDoorSrc && (
        <img
          src={driverDoorSrc}
          style={{
            position: "absolute",
            top: 82,
            right: 125,
            height: 45,
            transform: "rotate(-45deg)",
          }}
        />
      )}

      <img
        src={frontPassDoorSrc}
        style={{
          position: "absolute",
          top: -5,
          right: 125,
          height: 45,
          transform: "rotate(45deg)",
        }}
      />
      {rearLeftDoorSrc && (
        <img
          src={rearLeftDoorSrc}
          style={{
            position: "absolute",
            top: 82,
            right: 65,
            height: 45,
            transform: "rotate(-45deg)",
          }}
        />
      )}

      {rearRightDoorSrc && (
        <img
          src={rearRightDoorSrc}
          style={{
            position: "absolute",
            top: -5,
            right: 65,
            height: 45,
            transform: "rotate(45deg)",
          }}
        />
      )}

      {hoodSrc && (
        <img
          src={hoodSrc}
          style={{
            position: "absolute",
            top: 16,
            right: 190,
            height: 90,
          }}
        />
      )}

      {trunkSrc && (
        <img
          src={trunkSrc}
          style={{
            position: "absolute",
            top: 20,
            right: 2,
            height: 80,
          }}
        />
      )}
    </Paper>
  );
};
