import { useEffect, useState } from "react";
import { Realtime } from "ably";

import { formatKey } from "../ably-helpers";
import { getEvent } from "../api";

export default function Event({ eventCode }) {
  const [event, setEvent] = useState(null);
  const [ablyMessages, setAblyMessages] = useState([]);

  useEffect(() => {
    async function load() {
      const eventData = await getEvent(eventCode);
      setEvent(eventData);
    }

    load();
  }, []);

  useEffect(() => {
    if (event) {
      return;
    }

    const { clientConfig } = window.__wooclap;

    const rtClient = new Realtime({
      key: clientConfig.ablyKey,
      tls: true,
      transports: ["web_socket"],
    });

    rtClient.connection.on("connected", () =>
      console.log("Connection successful")
    );

    const eventChannel = rtClient.channels.get(event._id, {
      cipher: {
        key: formatKey(
          event._id,
          window.__wooclap.clientConfig.ablyEncryptionKey
        ),
        algorithm: clientConfig.encryptionAlgorithm,
        keyLength: clientConfig.encryptionKeyLength,
        mode: clientConfig.encryptionMode,
      },
    });
    eventChannel.subscribe((msg) => {
      console.log("Rcvd msg", msg);
      setAblyMessages([...ablyMessages, msg]);
    });

    // eslint-disable-next-line consistent-return
    return () => rtClient.close();
  }, [event]);

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
      <ul>
        {ablyMessages.map((m, idx) => (
          <li key={idx}>{JSON.stringify(m)}</li>
        ))}
      </ul>
    </div>
  );
}
