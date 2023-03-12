import { Controls } from "../controls";
import { Map } from "../map";
import { AppContainer, AppContent } from "./styled";
import { Timeline } from "../timeline";

export const App = () => {
  return (
    <AppContainer>
      <Controls />
      <AppContent>
        <Map />
        <Timeline />
      </AppContent>
    </AppContainer>
  );
};
