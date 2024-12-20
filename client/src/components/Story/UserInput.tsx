import { useState } from "react";

export const UserInput: React.FC<{
  onSubmit: (input: string) => void;
}> = ({ onSubmit }) => {
  const [input, setInput] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(input.trim());
    setInput("");
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        autoFocus
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />
      <button
        disabled={input.trim() === ""}
        type="submit"
        style={{ marginLeft: "1em" }}
      >
        Send
      </button>
    </form>
  );
};
