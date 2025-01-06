import styles from "./PlotBoard.module.css";
import { PlotPoint } from "../types";
import ReactMarkdown from "react-markdown";

export const PlotBoard: React.FC<{
  plotPoints: PlotPoint[];
  latestNarrative: PlotPoint | null;
}> = ({ plotPoints, latestNarrative }) => {
  const showlatestNarrativeImage = false;
  return (
    <ul className={styles.plotPointList}>
      {plotPoints.map((point, idx) => (
        <li
          key={`point-${idx}`}
          className={`${styles.plotPoint} ${
            point.type === "CHOICE" ? styles.plotChoice : ""
          }`}
        >
          {point.imageUrl && (
            <div style={{ margin: "auto" }}>
              <img src={point.imageUrl} className={styles.image} />
            </div>
          )}
          <ReactMarkdown>{point.text}</ReactMarkdown>
        </li>
      ))}
      {latestNarrative && (
        <li className={styles.plotPoint}>
          {!latestNarrative.imageUrl ? (
            <div
              className={styles.imagePlaceholder}
              style={{
                display:
                  plotPoints.length >= 2 && showlatestNarrativeImage
                    ? "block"
                    : "none",
              }}
            />
          ) : (
            <div
              style={{
                margin: "auto",
              }}
            >
              <img src={latestNarrative.imageUrl} className={styles.image} />
            </div>
          )}
          <ReactMarkdown>{latestNarrative.text}</ReactMarkdown>
        </li>
      )}
    </ul>
  );
};
