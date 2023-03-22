import { Map } from "../map";
import { AppContainer } from "./styled";
import { Sidebar } from "../sidebar";
import { Controls } from "../controls";

export const App = () => {
  return (
    <AppContainer>
      <Map />
      <Sidebar />
      <Controls />
    </AppContainer>
  );
};
