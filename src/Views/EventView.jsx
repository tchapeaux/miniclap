import { useEffect, useReducer } from "react";

import SocketController from "../realtime";
import { getEvent } from "../api";

function reducer(state, action) {
  switch (action.type) {
    case "load-event":
      return {
        isLoaded: true,
        event: action.payload,
      };
    case "patch-event":
      return {
        ...state,
        event: {
          ...state.event,
          ...action.payload,
        },
      };
    default:
      throw new Error(`Unknown action type ${action.type}`);
  }
}

export default function EventView({ eventCode }) {
  const [store, dispatch] = useReducer(reducer, {
    event: null,
    isLoaded: false,
  });

  // Load event
  useEffect(() => {
    getEvent(eventCode).then((eventData) =>
      dispatch({ type: "load-event", payload: eventData })
    );
  }, []);

  // Subscribe to updates
  useEffect(() => {
    if (!store.isLoaded) {
      return;
    }

    const rtClient = new SocketController();

    rtClient.subscribeToEvent(store.event._id, (name, payload) => {
      if (
        name.startsWith("socket:set:Event:") &&
        name.endsWith(store.event._id)
      ) {
        return dispatch({ type: "patch-event", payload });
      }

      return null;
    });

    // eslint-disable-next-line consistent-return
    return () => rtClient.close();
  }, [store.isLoaded]);

  if (store.event === null) {
    return <p>Loading...</p>;
  }

  if (store.event === false) {
    return <p>Could not load event</p>;
  }

  return (
    <div>
      <p>{`You are viewing Event ${eventCode}`}</p>
      <p>You are now connected</p>
      <ul>
        {store.event.questions.map((q, idx) => (
          <li key={idx}>
            {store.event.selectedQuestion === q._id ? "(x)" : ""}
            {q.title}
          </li>
        ))}
      </ul>
    </div>
  );
}
