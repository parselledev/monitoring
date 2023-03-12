import { Controls } from "../controls";
import { Map } from "../map";
import { AppContainer, AppContent, AppSidebar } from "./styled";
import { Timeline } from "../timeline";
import { Panel } from "../panel";

export const App = () => {
  return (
    <AppContainer>
      <AppSidebar>
        <Controls />
        <Panel />
      </AppSidebar>

      <AppContent>
        <Map />
        <Timeline />
      </AppContent>
    </AppContainer>
  );
};
