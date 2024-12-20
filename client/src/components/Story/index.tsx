import { useState } from "react";
import { UserInput } from "./UserInput";
import { PlotPoint } from "./types";
import { PlotBoard } from "./PlotBoard";

const SERVER_URL = import.meta.env.VITE_SERVER_URL;

export const Story: React.FC = () => {
  const [plotPoints, setPlotPoints] = useState<PlotPoint[]>([]);

  const addPlotPoint = (str: string) => {
    setPlotPoints([...plotPoints, { text: str }]);
  };

  const fetchInitialStory = async () => {
    await fetch(SERVER_URL + "/test")
      .then(async (res) => {
        const data = await res.json();
        setPlotPoints([...plotPoints, data]);
      })
      .catch((err) => {
        console.error(`Failed to fetch message: ${err}`);
      });
  };

  return (
    <div>
      {plotPoints.length === 0 ? (
        <button autoFocus onClick={() => fetchInitialStory()}>
          Begin
        </button>
      ) : (
        <div>
          <PlotBoard plotPoints={plotPoints} />
          <UserInput onSubmit={addPlotPoint} />
        </div>
      )}
    </div>
  );
};
