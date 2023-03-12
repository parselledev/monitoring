import { Controls } from "../controls";
import { Map } from "../map";
import { AppContainer, AppSidebar } from "./styled";
import { Panel } from "../panel";

export const App = () => {
  return (
    <AppContainer>
      <AppSidebar>
        <Controls />
        <Panel />
      </AppSidebar>

      <Map />
    </AppContainer>
  );
};
