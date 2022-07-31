import { useEffect, useState, useRef } from "react";
import SocketController from "../realtime";
import { getEvent } from "../api";

export default function Event({ eventCode }) {
  const [event, setEvent] = useState(null);
  const [ablyMessages, setAblyMessages] = useState([]);

  const rt = useRef(new SocketController());

  useEffect(() => {
    async function load() {
      const eventData = await getEvent(eventCode);
      setEvent(eventData);

      rt.current.subscribeToEvent(eventData._id, (name, payload) =>
        setAblyMessages([...ablyMessages, { name, payload }])
      );
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
