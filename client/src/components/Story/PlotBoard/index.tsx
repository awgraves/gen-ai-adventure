import styles from "./PlotBoard.module.css";
import { PlotPoint } from "../types";
import ReactMarkdown from "react-markdown";

export const PlotBoard: React.FC<{ plotPoints: PlotPoint[] }> = ({
  plotPoints,
}) => {
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
    </ul>
  );
};
