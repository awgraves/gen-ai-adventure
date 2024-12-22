import { useState } from "react";

export const PlayerChoices: React.FC<{
  options: string[];
  onSubmit: (choice: string) => void;
}> = ({ options, onSubmit }) => {
  const [choice, selectedChoice] = useState<null | string>(null);

  const onClick = (choice: string) => {
    if (choice !== null) {
      selectedChoice(choice);
      onSubmit(choice);
    }
  };

  return (
    <div>
      {options.map((option) => (
        <button
          key={option}
          onClick={() => onClick(option)}
          disabled={choice !== null}
        >
          {option}
        </button>
      ))}
    </div>
  );
};
