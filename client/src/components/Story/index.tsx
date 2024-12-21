import { useEffect, useState } from "react";
import { UserInput } from "./UserInput";
import { PlotPoint } from "./types";
import { PlotBoard } from "./PlotBoard";
import useWebsocket, { ReadyState } from "react-use-websocket";
import styles from "./Story.module.css";

const SERVER_URL = import.meta.env.VITE_SERVER_URL;

export const Story: React.FC = () => {
  const [plotPoints, setPlotPoints] = useState<PlotPoint[]>([]);

  const { sendJsonMessage, lastJsonMessage, readyState } = useWebsocket(
    "ws://" + SERVER_URL + "/story"
  );

  const addPlotPoint = (str: string) => {
    const point = { text: str };
    setPlotPoints([...plotPoints, point]);
    sendJsonMessage(point);
  };

  const beginStory = () => {
    sendJsonMessage({ theme: "aliens" });
  };

  useEffect(() => {
    if (lastJsonMessage !== null) {
      setPlotPoints([...plotPoints, lastJsonMessage]);
      if ("debug" in lastJsonMessage) {
        console.log(lastJsonMessage["debug"]);
      }
    }
  }, [lastJsonMessage]);

  return (
    <div className={styles.story}>
      {plotPoints.length === 0 ? (
        <button autoFocus onClick={() => beginStory()}>
          Begin
        </button>
      ) : (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <span style={{ color: "green" }}>
            WS status: {ReadyState[readyState]}
          </span>
          <PlotBoard plotPoints={plotPoints} />
          <UserInput onSubmit={addPlotPoint} />
        </div>
      )}
    </div>
  );
};
