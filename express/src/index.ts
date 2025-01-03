import express, { Request, Response } from "express";
import { themes } from "./themes";
import expressWs from "express-ws";
import { WebSocket } from "ws";
import cors from "cors";
import { createNewPlot } from "./plot";

const expWs = expressWs(express());
const app = expWs.app;

const port = process.env.PORT || 9999;

app.use(cors({ origin: "http://localhost" }));
app.use("/static", express.static("public"));

app.get("/status", (_: Request, res: Response) => {
  res.json({ status: "ok" });
});

app.get("/themes", (_: Request, res: Response) => {
  res.json(themes);
});

app.ws("/story", (ws: WebSocket, _: Request) => {
  let plot = createNewPlot(ws, "pirate");

  ws.on("message", (msg: string) => {
    const data = JSON.parse(msg);
    if ("theme" in data) {
      plot = createNewPlot(ws, data.theme);
      plot.begin();
    } else if ("text" in data) {
      plot.advance(data.text);
    }

    console.log("received: %s", msg);
  });
});

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
