import * as Questions from "../Questions/index";

import { useEffect, useReducer } from "react";

import SocketController from "../utils/realtime";
import { getEvent } from "../utils/api";

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
    if (!store.isLoaded || !store.event) {
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
    return <p>⌛ Loading...</p>;
  }

  if (store.event === false) {
    return (
      <>
        <p>❌ Could not load event</p>
        <a href="./">Go back</a>
      </>
    );
  }

  const selectedQuestion = store.event.questions.find(
    (q) => q._id === store.event.selectedQuestion
  );

  const SelectedQuestionComponent =
    Questions[selectedQuestion.__t] || Questions.NotSupported;

  return (
    <div>
      <h2>
        {"✅ You are connected to: "}
        <code>{eventCode}</code>
      </h2>

      {selectedQuestion ? (
        <SelectedQuestionComponent question={selectedQuestion} />
      ) : (
        <Questions.NoQuestion />
      )}
    </div>
  );
}
