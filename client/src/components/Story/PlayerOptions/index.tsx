import { useState } from "react";
import styles from "./PlayerOptions.module.css";

export const PlayerOptions: React.FC<{
  options: string[];
  onSelect: (choice: string) => void;
}> = ({ options, onSelect }) => {
  const [choice, selectedChoice] = useState<null | string>(null);

  const onClick = (choice: string) => {
    if (choice !== null) {
      selectedChoice(choice);
      onSelect(choice);
    }
  };

  return (
    <div className={styles.optionsList}>
      {options.map((option, idx) => (
        <button
          key={option}
          autoFocus={idx === 0}
          onClick={() => onClick(option)}
          disabled={choice !== null}
          className={styles.option}
        >
          {option}
        </button>
      ))}
    </div>
  );
};
