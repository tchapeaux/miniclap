import { useEffect, useState } from "react";

import { getConfig } from "./api";

import EventCodeForm from "./Views/EventCodeForm";
import EventView from "./Views/EventView";

import "./App.css";

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

  function onSubmit(eventCode) {
    setEventCode(eventCode);
  }

  if (!wooclapConfig) {
    return <div className="App">Loading...</div>;
  }

  return (
    <div className="App">
      <header>MiniClap</header>

      <main>
        {eventCode ? (
          <EventView eventCode={eventCode} />
        ) : (
          <EventCodeForm onSubmit={onSubmit} />
        )}
      </main>

      <footer>
        <p>Miniclap is an experiment by Tchap</p>
      </footer>
    </div>
  );
}
