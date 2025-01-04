export interface PlotPoint {
  text: string;
  type: "NARRATIVE" | "CHOICE";
  options?: string[];
  status?: "IN_PROGRESS" | "SUCCESS" | "FAILURE";
}
