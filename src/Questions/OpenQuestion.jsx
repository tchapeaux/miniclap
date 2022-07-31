import { Wrapper } from "./questions.styles.js";
import { useState } from "react";

export default function OpenQuestion({ onPushAnswer, question }) {
  const [answer, setAnswer] = useState("");

  function onSubmit() {
    onPushAnswer({ text: answer });
    setAnswer("");
  }

  const isDisabled = !question.canAnswer || question.userAnswer?.length > 0;

  return (
    <Wrapper>
      <h3>{question.title}</h3>
      <input
        disabled={isDisabled}
        onChange={({ target: { value } }) => setAnswer(value)}
        type="text"
        value={answer}
      />
      <button disabled={isDisabled} onClick={onSubmit}>
        Submit
      </button>
    </Wrapper>
  );
}
