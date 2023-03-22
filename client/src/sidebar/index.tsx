import * as React from "react";
import { useState } from "react";
import Box from "@mui/material/Box";
import SwipeableDrawer from "@mui/material/SwipeableDrawer";
import { Fab } from "@mui/material";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import { Panel } from "../panel";

export const Sidebar = () => {
  const [open, setOpen] = useState(false);
  const anchor = "left";

  return (
    <React.Fragment>
      <Fab
        color="primary"
        aria-label="add"
        onClick={() => setOpen(!open)}
        style={{
          position: "absolute",
          bottom: 10,
          right: 10,
          zIndex: 10000000000,
        }}
      >
        <RemoveRedEyeIcon />
      </Fab>
      <SwipeableDrawer
        anchor={anchor}
        open={open}
        onClose={() => setOpen(false)}
        onOpen={() => setOpen(true)}
      >
        <Box sx={{ width: "80vw" }} role="presentation">
          <Panel />
        </Box>
      </SwipeableDrawer>
    </React.Fragment>
  );
};
