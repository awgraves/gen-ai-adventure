import styles from "./PlotBoard.module.css";
import { PlotPoint } from "./types";

export const PlotBoard: React.FC<{ plotPoints: PlotPoint[] }> = ({
  plotPoints,
}) => {
  return (
    <ul className={styles.plotPointList}>
      {plotPoints.map((point, idx) => (
        <li key={`point-${idx}`}>{point.text}</li>
      ))}
    </ul>
  );
};
