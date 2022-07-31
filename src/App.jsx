import { AppStyle, Footer, Header, Main } from "./App.styles";
import { useEffect, useState } from "react";

import EventCodeForm from "./Views/EventCodeForm";
import EventView from "./Views/EventView";
import { getConfig } from "./utils/api";

export default function App() {
  const [hasClientConfig, setHasClientConfig] = useState(false);
  const [eventCode, setEventCode] = useState(null);

  useEffect(() => {
    // Load Wooclap config (to get ably credentials)
    async function loadConfig() {
      const config = await getConfig();
      window.__wooclap.clientConfig = config;
      setHasClientConfig(true);
    }
    loadConfig();

    // Get event code from query param (if any)
    const params = new URLSearchParams(window.location.search);
    const code = params.get("code");
    if (code) {
      setEventCode(code);
    }
  }, []);

  function onSubmit(code) {
    setEventCode(code);
  }

  if (!hasClientConfig) {
    return <AppStyle>Loading...</AppStyle>;
  }

  return (
    <AppStyle>
      <Header>MiniClap</Header>

      <Main>
        {eventCode ? (
          <EventView eventCode={eventCode} />
        ) : (
          <EventCodeForm onSubmit={onSubmit} />
        )}
      </Main>

      <Footer>
        <p>Miniclap is an experiment by Tchap</p>
      </Footer>
    </AppStyle>
  );
}
