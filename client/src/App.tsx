import { useEffect, useState } from "react";
import "./App.css";
import { Story } from "./components/Story";
import { ThemeOption } from "./types";
import { ThemeSelection } from "./components/ThemeSelection";
import { THEMES_URL } from "./const";

function App() {
  const [themeOptions, setThemeOptions] = useState<ThemeOption[]>([]);
  const [theme, setTheme] = useState<ThemeOption | null>(null);

  const resetTheme = () => {
    setTheme(null);
  };

  useEffect(() => {
    fetch(THEMES_URL)
      .then((res) => res.json())
      .then((data) => {
        setThemeOptions(data);
      });
  }, []);

  return (
    <>
      <h1>Gen AI Adventure</h1>
      {theme ? (
        <Story theme={theme} resetTheme={resetTheme} />
      ) : (
        <ThemeSelection
          options={themeOptions}
          setTheme={(theme: ThemeOption) => setTheme(theme)}
        />
      )}
    </>
  );
}

export default App;
