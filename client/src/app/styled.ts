import { styled } from "@mui/material/styles";

export const AppContainer = styled("div")(() => ({
  display: "grid",
  gridTemplateColumns: "400px 1fr",
}));

export const AppContent = styled("div")(() => ({
  display: "grid",
  gridTemplateRows: "1fr 5vh",
}));
