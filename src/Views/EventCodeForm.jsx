import { Button } from "../App.styles";
import { useState } from "react";

export default function EventCodeForm({ onSubmit }) {
  const [code, setCode] = useState("");

  return (
    <>
      <h2>Enter code</h2>
      <input
        type="text"
        onChange={({ target: { value } }) => setCode(value)}
        value={code}
      />
      <div>
        <Button onClick={() => onSubmit(code)}>GO</Button>
      </div>
    </>
  );
}
