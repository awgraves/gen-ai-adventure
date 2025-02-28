import { useEffect, useRef, useState } from "react";
import { PlayerOptions } from "./PlayerOptions";
import { PlotPoint } from "./types";
import { PlotBoard } from "./PlotBoard";
import styles from "./Story.module.css";
import { getImageUrl, SPEECH_URL } from "../../const";
import { ThemeOption } from "../../types";
import { fetchNextPlotPointStream } from "./fetchNextPlotPointStream";

export const Story: React.FC<{
  theme: ThemeOption;
  resetTheme: () => void;
}> = ({ theme, resetTheme }) => {
  const [plotPoints, setPlotPoints] = useState<PlotPoint[]>([]);
  const [latestNarrative, setLatestNarrative] = useState<PlotPoint | null>(
    null
  );
  const [includeSpeech, setIncludeSpeech] = useState(false);
  const [isStreaming, setIsStreaming] = useState<boolean>(false);
  const hasInitialFetch = useRef(false);

  const bottomRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  const addPlotPoint = (str: string) => {
    const point: PlotPoint = { text: str, type: "CHOICE" };
    setPlotPoints([
      ...plotPoints,
      ...(latestNarrative ? [latestNarrative] : []),
      point,
    ]);
    setLatestNarrative(null);
  };

  const fetchNextPlotPoint = async () => {
    setIsStreaming(true);
    const stream = fetchNextPlotPointStream(theme.value, plotPoints);

    for await (const value of stream) {
      setLatestNarrative(value);
    }
    setIsStreaming(false);
  };

  const resetStory = () => {
    setPlotPoints([]);
    setLatestNarrative(null);
    hasInitialFetch.current = false;
  };

  useEffect(() => {
    if (
      !hasInitialFetch.current ||
      (plotPoints.length && plotPoints[plotPoints.length - 1].type === "CHOICE")
    ) {
      fetchNextPlotPoint();
      hasInitialFetch.current = true;
    }
  }, [plotPoints]);

  useEffect(() => {
    if (!isStreaming && latestNarrative) {
      if (includeSpeech) {
        playAudio();
      } else {
        pauseAudio();
      }
    }
  }, [isStreaming, latestNarrative, includeSpeech]);

  const scrollToBottom = () => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const playAudio = () => {
    const audio = audioRef.current;
    if (audio) {
      audio.src = SPEECH_URL + "?text=" + (latestNarrative?.text || "");
      audio.load();
      audio.play();
    }
  };

  const pauseAudio = () => {
    audioRef.current?.pause();
  };

  useEffect(() => {
    scrollToBottom();
  }, [plotPoints, latestNarrative]);

  return (
    <div className={styles.story}>
      <audio ref={audioRef} crossOrigin="anonymous"></audio>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <div className={styles.topBar}>
          <div className={styles.navOptions}>
            <div className={styles.switchContainer}>
              Audio:
              <label className={styles.switch}>
                <input
                  type="checkbox"
                  checked={includeSpeech}
                  onChange={() => setIncludeSpeech(!includeSpeech)}
                />
                <span className={styles.slider} />
              </label>
            </div>
            <button onClick={() => resetTheme()}>Back to Themes</button>
          </div>
        </div>
        <img
          id={styles.themeImage}
          src={getImageUrl(theme.imagePath)}
          alt={theme.description}
        />
        <PlotBoard plotPoints={plotPoints} latestNarrative={latestNarrative} />
        {!latestNarrative ? (
          <div className={styles.loadingContainer}>
            <span>Loading...</span>
          </div>
        ) : (
          <PlayerOptions
            key={latestNarrative.text}
            onSelect={addPlotPoint}
            latestNarrative={latestNarrative}
            resetStory={resetStory}
            resetTheme={resetTheme}
          />
        )}
        <div ref={bottomRef}></div>
      </div>
    </div>
  );
};
