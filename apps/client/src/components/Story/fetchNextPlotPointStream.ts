import { PlotPoint } from "./types";

import { PLOT_URL } from "../../const";

export async function* fetchNextPlotPointStream(
  theme: string,
  history: PlotPoint[]
): AsyncGenerator<PlotPoint, undefined, undefined> {
  const res = await fetch(PLOT_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      theme,
      history,
    }),
  });

  const stream = res.body?.getReader();
  if (!stream) {
    return;
  }

  const decoder = new TextDecoder();
  let buffer = "";

  while (true) {
    const { done, value } = await stream.read();
    if (done) {
      break;
    }
    buffer += decoder.decode(value);

    while (true) {
      const delimiterIndex = buffer.indexOf("@");
      if (delimiterIndex === -1) {
        break;
      }

      const message = buffer.slice(0, delimiterIndex);
      buffer = buffer.slice(delimiterIndex + 1);

      const json = JSON.parse(message);
      yield { ...json, type: "NARRATIVE" } as PlotPoint;
    }
  }
}
