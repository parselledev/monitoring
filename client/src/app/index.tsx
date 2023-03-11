import { Controls } from "../controls";
import { Map } from "../map";
import { AppContainer } from "./styled";

export const App = () => {
  return (
    <AppContainer>
      <Controls />
      <Map />
    </AppContainer>
  );
};
