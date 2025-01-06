import express, { Request, Response } from "express";
import { themes } from "./themes";
import expressWs from "express-ws";
import { WebSocket } from "ws";
import cors from "cors";
import { newPlot } from "./plot";
import { z } from "zod";
import { generateSpeechStream } from "./speech";

const expWs = expressWs(express());
const app = expWs.app;

const port = process.env.PORT || 9999;

app.use(cors({ origin: "http://localhost" }));
app.use("/static", express.static("public"));
app.use(express.json());

app.get("/status", (_: Request, res: Response) => {
  res.json({ status: "ok" });
});

app.get("/themes", (_: Request, res: Response) => {
  res.json(themes);
});

app.ws("/story/:theme", (ws: WebSocket, req: Request) => {
  const theme = req.params.theme;
  if (!theme) {
    ws.close(400, "No theme provided");
  }

  const plot = newPlot(ws, theme);

  ws.on("message", (msg: string) => {
    const data = JSON.parse(msg);
    if ("begin" in data) {
      plot.begin();
    } else if ("text" in data) {
      plot.advance(data.text);
    }

    console.log("received: %s", msg);
  });
});

app.get("/speech", async (req: Request, res: Response) => {
  //const speechRequest = z.object({
  //  text: z.string(),
  //});
  try {
    const text = req.query.text as string;
    if (!text) {
      res.status(400).json({ error: "No text provided" });
    }
    const stream = await generateSpeechStream(text);
    stream.pipe(res);
  } catch (e) {
    if (e instanceof z.ZodError) {
      res.status(400).json({ error: e.issues });
      return;
    }
    console.log("ERROR", e);
    res.status(500).json({ error: e });
  }
});

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
