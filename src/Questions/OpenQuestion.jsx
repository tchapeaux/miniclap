import { Wrapper } from "./questions.styles.js";
import { useState } from "react";

export default function OpenQuestion({ question }) {
  const [answer, setAnswer] = useState("");
  return (
    <Wrapper>
      <h3>{question.title}</h3>
      <input
        onChange={({ target: { value } }) => setAnswer(value)}
        type="text"
        value={answer}
      />
      <button>Submit</button>
    </Wrapper>
  );
}
