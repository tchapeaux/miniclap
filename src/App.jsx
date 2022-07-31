import { useState } from "react";
import "./App.css";

import EventCodeForm from "./Views/EventCodeForm";
import EventView from "./Views/EventView";

export default function App() {
  const [loadedEvent, setLoadedEvent] = useState(null);

  return (
    <div className="App">
      <header>MiniClap</header>

      <main>{loadedEvent ? <EventView /> : <EventCodeForm />}</main>

      <footer>
        <p>Miniclap is an experiment by Tchap</p>
      </footer>
    </div>
  );
}
