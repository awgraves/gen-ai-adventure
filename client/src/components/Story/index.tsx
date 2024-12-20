import { useEffect, useState } from "react";
import { UserInput } from "./UserInput";
import { PlotPoint } from "./types";
import { PlotBoard } from "./PlotBoard";
import useWebsocket, { ReadyState } from "react-use-websocket";

const SERVER_URL = import.meta.env.VITE_SERVER_URL;

export const Story: React.FC = () => {
  const [plotPoints, setPlotPoints] = useState<PlotPoint[]>([]);

  const { sendJsonMessage, lastJsonMessage, readyState } = useWebsocket(
    "ws://" + SERVER_URL + "/story"
  );

  const addPlotPoint = (str: string) => {
    sendJsonMessage({ text: str });
  };

  const fetchInitialStory = async () => {
    await fetch("http://" + SERVER_URL + "/test")
      .then(async (res) => {
        const data = await res.json();
        setPlotPoints([...plotPoints, data]);
      })
      .catch((err) => {
        console.error(`Failed to fetch message: ${err}`);
      });
  };

  useEffect(() => {
    if (lastJsonMessage !== null) {
      setPlotPoints([...plotPoints, lastJsonMessage]);
    }
  }, [lastJsonMessage]);

  return (
    <div>
      {plotPoints.length === 0 ? (
        <button autoFocus onClick={() => fetchInitialStory()}>
          Begin
        </button>
      ) : (
        <div>
          WS status: {ReadyState[readyState]}
          <PlotBoard plotPoints={plotPoints} />
          <UserInput onSubmit={addPlotPoint} />
        </div>
      )}
    </div>
  );
};
