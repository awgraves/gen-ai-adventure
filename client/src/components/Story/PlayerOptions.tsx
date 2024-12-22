import { useState } from "react";

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
