import { Map } from "../map";
import { AppContainer } from "./styled";
import { Sidebar } from "../sidebar";
import { Tracks } from "../tracks";

export const App = () => {
  return (
    <AppContainer>
      <Map />
      <Sidebar />
      <Tracks />
    </AppContainer>
  );
};
