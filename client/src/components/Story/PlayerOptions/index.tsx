import { useState } from "react";
import styles from "./PlayerOptions.module.css";
import { PlotPoint } from "../types";

export const PlayerOptions: React.FC<{
  latestNarrative: PlotPoint;
  onSelect: (choice: string) => void;
}> = ({ onSelect, latestNarrative }) => {
  const { status } = latestNarrative;
  const options = latestNarrative.options || [];

  const [choice, selectedChoice] = useState<null | string>(null);

  const onClick = (choice: string) => {
    if (choice !== null) {
      selectedChoice(choice);
      onSelect(choice);
    }
  };

  // important to check full end state texts due to streamed response
  const showFinalMessage = status === "SUCCESS" || status === "FAILURE";

  const getFinalMessage = () => {
    return status === "SUCCESS" ? "YOU WIN" : "YOU LOSE";
  };

  return (
    <div className={styles.optionsList}>
      {options.map((option, idx) => (
        <button
          key={option}
          autoFocus={idx === 0}
          onClick={() => onClick(option)}
          disabled={choice !== null}
        >
          {option}
        </button>
      ))}
      {showFinalMessage && <div>{getFinalMessage()}</div>}
    </div>
  );
};
