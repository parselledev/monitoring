import { styled } from "@mui/material/styles";
import { Paper } from "@mui/material";

export const AppContainer = styled("div")(() => ({
  display: "grid",
  gridTemplateColumns: "400px 1fr",
}));

export const AppSidebar = styled(Paper)(() => ({
  padding: 10,
  display: "grid",
  gap: 20,
  gridTemplateRows: "1fr 400px",
}));
