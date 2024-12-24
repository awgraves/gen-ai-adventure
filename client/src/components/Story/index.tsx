import { useEffect, useRef, useState } from "react";
import { PlayerOptions } from "./PlayerOptions";
import { PlotPoint } from "./types";
import { PlotBoard } from "./PlotBoard";
import useWebsocket, { ReadyState } from "react-use-websocket";
import styles from "./Story.module.css";
import { getImageUrl, STORY_WS_URL } from "../../const";
import { ThemeOption } from "../../types";

export const Story: React.FC<{
  theme: ThemeOption;
}> = ({ theme }) => {
  const [plotPoints, setPlotPoints] = useState<PlotPoint[]>([]);
  const [latestNarrative, setLatestNarrative] = useState<PlotPoint | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(false);
  const hasInitialFetch = useRef(false);

  const { sendJsonMessage, lastJsonMessage, readyState } =
    useWebsocket(STORY_WS_URL);
  const bottomRef = useRef<HTMLDivElement>(null);

  const addPlotPoint = (str: string) => {
    const point: PlotPoint = { text: str, type: "CHOICE" };
    setPlotPoints([
      ...plotPoints,
      ...(latestNarrative ? [latestNarrative] : []),
      point,
    ]);
    setLatestNarrative(null);
    setIsLoading(true);
    sendJsonMessage(point);
  };

  const beginStory = () => {
    setIsLoading(true);
    sendJsonMessage({ theme: theme.value });
  };

  useEffect(() => {
    if (!hasInitialFetch.current) {
      beginStory();
      hasInitialFetch.current = true;
    }
  }, [theme]);

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
        const newNarrative = { type: "NARRATIVE", ...lastJsonMessage };
        setLatestNarrative(newNarrative);
        setIsLoading(false);
      }
    }
  }, [lastJsonMessage]);

  useEffect(() => {
    scrollToBottom();
  }, [plotPoints]);

  const getConnStyle = (readyState: ReadyState) => {
    switch (readyState) {
      case ReadyState.CONNECTING:
        return { backgroundColor: "yellow" };
      case ReadyState.OPEN:
        return { backgroundColor: "green" };
      case ReadyState.CLOSING:
      case ReadyState.CLOSED:
        return { backgroundColor: "red" };
      default:
        return { backgroundColor: "black" };
    }
  };

  return (
    <div className={styles.story}>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <div className={styles.connContainer}>
          <span>Connection: </span>
          <div
            id="foo"
            className={styles.connIndicator}
            style={getConnStyle(readyState)}
          />
        </div>
        <img
          src={getImageUrl(theme.imagePath)}
          alt={theme.description}
          height="250"
        />
        <PlotBoard plotPoints={plotPoints} latestNarrative={latestNarrative} />
        {isLoading && <span>Loading...</span>}
        {latestNarrative && (
          <PlayerOptions
            key={latestNarrative.text}
            options={latestNarrative.options || []}
            onSelect={addPlotPoint}
          />
        )}
        <div ref={bottomRef}></div>
      </div>
    </div>
  );
};
