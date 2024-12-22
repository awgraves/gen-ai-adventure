import { useEffect, useRef, useState } from "react";
import { PlayerOptions } from "./PlayerOptions";
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
  const bottomRef = useRef<HTMLDivElement>(null);

  const addPlotPoint = (str: string) => {
    const point = { text: str };
    setPlotPoints([...plotPoints, point]);
    sendJsonMessage(point);
  };

  const beginStory = () => {
    sendJsonMessage({ theme: "aliens" });
  };

  const regenerateLastResponse = () => {
    sendJsonMessage({ regenerate: true });
  };

  const scrollToBottom = () => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (lastJsonMessage !== null) {
      if ("error" in lastJsonMessage) {
        console.error(lastJsonMessage.error);
        return;
      }
      if ("text" in lastJsonMessage) {
        setPlotPoints([...plotPoints, lastJsonMessage]);
      }
    }
  }, [lastJsonMessage]);

  useEffect(() => {
    scrollToBottom();
  }, [plotPoints]);

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
          {plotPoints[plotPoints.length - 1].options?.length && (
            <PlayerOptions
              options={plotPoints[plotPoints.length - 1].options || []}
              onSelect={addPlotPoint}
            />
          )}
          <div ref={bottomRef}></div>
        </div>
      )}
    </div>
  );
};
