import { getImageUrl } from "../../const";
import { ThemeOption } from "../../types";
import styles from "./ThemeSelection.module.css";

export const ThemeSelection: React.FC<{
  options: ThemeOption[];
  setTheme: (theme: ThemeOption) => void;
}> = ({ options, setTheme }) => {
  return (
    <div className={styles.container}>
      <h2>Select a theme:</h2>
      <ul className={styles.list}>
        {options.map((option, idx) => (
          <li key={option.value} className={styles.item}>
            <button onClick={() => setTheme(option)} autoFocus={idx === 0}>
              <img
                src={getImageUrl(option.imagePath)}
                alt={option.description}
              />
              <p>{option.description}</p>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};
