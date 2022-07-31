import * as Questions from "../Questions/index";

import { getEvent, pushAnswer } from "../utils/api";
import { useEffect, useReducer } from "react";

import SocketController from "../utils/realtime";

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
    case "patch-question":
      return {
        ...state,
        event: {
          ...state.event,
          question: state.event.questions.map((q) => {
            if (q._id === action.payload._id) {
              return { ...q, ...action.payload };
            }
            return q;
          }),
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

      if (
        name.startsWith("socket:set:") &&
        Object.keys(Questions).some((__t) => name.includes(__t))
      ) {
        const qId = name.split(":").at(-1);
        return dispatch({
          type: "patch-question",
          payload: { ...payload, _id: qId },
        });
      }

      return null;
    });

    // eslint-disable-next-line consistent-return
    return () => rtClient.close();
  }, [store.isLoaded]);

  async function onPushAnswer(questionId, payload) {
    const q = store.event.questions.find((_q) => _q._id === questionId);

    if (q) {
      const userAnswer = await pushAnswer(questionId, payload);
      dispatch({
        type: "patch-question",
        payload: { _id: questionId, ...userAnswer },
      });
    }
  }

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

  const SelectedQuestionComponent = selectedQuestion
    ? Questions[selectedQuestion.__t] || Questions.NotSupported
    : Questions.NoQuestion;

  return (
    <div>
      <h2>
        {"✅ You are connected to: "}
        <code>{eventCode}</code>
      </h2>

      <SelectedQuestionComponent
        onPushAnswer={onPushAnswer.bind(null, selectedQuestion?._id)}
        question={selectedQuestion}
      />
    </div>
  );
}
