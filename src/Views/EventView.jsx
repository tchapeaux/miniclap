import { useEffect, useState } from "react";
import { getEvent } from "../api";

export default function Event({ eventCode }) {
  const [event, setEvent] = useState(null);

  useEffect(() => {
    async function load() {
      setEvent(await getEvent(eventCode));
    }

    load();
  }, []);

  return (
    <div>
      <p>{`You are viewing Event ${eventCode}`}</p>
      {event === null ? <p>Loading...</p> : null}
      {event === false ? <p>Could not load event</p> : null}
      {!!event ? <p>You are now connected</p> : null}
    </div>
  );
}
