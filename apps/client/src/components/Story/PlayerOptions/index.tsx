import { useEffect, useState } from "react";
import styles from "./PlayerOptions.module.css";
import { PlotPoint } from "../types";

export const PlayerOptions: React.FC<{
  latestNarrative: PlotPoint;
  onSelect: (choice: string) => void;
  resetStory: () => void;
  resetTheme: () => void;
}> = ({ onSelect, latestNarrative, resetStory, resetTheme }) => {
  const { status } = latestNarrative;
  const options = latestNarrative.options || [];

  const [choice, selectedChoice] = useState<null | string>(null);
  const [storyOutcomeData, setStoryOutcomeData] = useState<{
    hasWon: boolean;
    text: string;
  } | null>(null);

  const onClick = (choice: string) => {
    if (choice !== null) {
      selectedChoice(choice);
      onSelect(choice);
    }
  };

  const getFinalMessageData = () => {
    const hasWon = status === "SUCCESS";
    return {
      hasWon: hasWon,
      text: hasWon ? "YOU WIN!" : "MISSION FAILED",
    };
  };

  useEffect(() => {
    // important to check full end state texts due to streamed response
    if (status === "SUCCESS" || status === "FAILURE") {
      setStoryOutcomeData(getFinalMessageData());
    }
  }, [status]);

  return (
    <>
      {storyOutcomeData ? (
        <>
          <div
            className={`${styles.finalResult} ${
              storyOutcomeData.hasWon ? styles.success : styles.failure
            }`}
          >
            {storyOutcomeData.text}
          </div>
          <div className={styles.optionsList}>
            <button autoFocus onClick={() => resetStory()}>
              Replay theme
            </button>
            <button onClick={() => resetTheme()}>Select new theme</button>
          </div>
        </>
      ) : (
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
        </div>
      )}
    </>
  );
};
