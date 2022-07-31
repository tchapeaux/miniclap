import { useState } from "react";

export default function EventCodeForm({ onSubmit }) {
  const [code, setCode] = useState("");

  return (
    <>
      <h2>Enter code</h2>
      <div>
        <input
          type="text"
          onChange={({ target: { value } }) => setCode(value)}
          value={code}
        />
      </div>
      <div>
        <button onClick={() => onSubmit(code)}>GO</button>
      </div>
    </>
  );
}
