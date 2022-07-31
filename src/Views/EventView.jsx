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

  if (event === null) {
    return <p>Loading...</p>;
  }

  if (event === false) {
    return <p>Could not load event</p>;
  }

  return (
    <div>
      <p>{`You are viewing Event ${eventCode}`}</p>
      <p>You are now connected</p>
    </div>
  );
}
