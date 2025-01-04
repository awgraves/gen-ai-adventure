import styles from "./PlotBoard.module.css";
import { PlotPoint } from "../types";
import ReactMarkdown from "react-markdown";

export const PlotBoard: React.FC<{
  plotPoints: PlotPoint[];
  latestNarrative: PlotPoint | null;
}> = ({ plotPoints, latestNarrative }) => {
  return (
    <ul className={styles.plotPointList}>
      {plotPoints.map((point, idx) => (
        <li
          key={`point-${idx}`}
          className={`${styles.plotPoint} ${
            point.type === "CHOICE" ? styles.plotChoice : ""
          }`}
        >
          <ReactMarkdown>{point.text}</ReactMarkdown>
        </li>
      ))}
      {latestNarrative && (
        <li className={styles.plotPoint}>
          <div className={styles.illustration} />
          <ReactMarkdown>{latestNarrative.text}</ReactMarkdown>
        </li>
      )}
    </ul>
  );
};
