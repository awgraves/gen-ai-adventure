import { useState } from "react";
import styles from "./story.module.css";

export const Story: React.FC = () => {
  const [messages, setMessages] = useState<string[]>(["foo"]);

  return (
    <ul className={styles.messageList}>
      {messages.map((message) => (
        <li>{message}</li>
      ))}
    </ul>
  );
};
