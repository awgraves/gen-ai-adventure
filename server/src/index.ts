import express, { Request, Response } from "express";
import { themes } from "./themes";
import expressWs from "express-ws";
import { WebSocket } from "ws";
import cors from "cors";
import { createNewPlot, generateNextPlotPointStream } from "./plot";
import { z } from "zod";
import { AIMessage } from "@langchain/core/messages";
import { HumanMessage } from "@langchain/core/messages";
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

app.get("/speech", async (req: Request, res: Response) => {
  const speechRequest = z.object({
    text: z.string(),
  });
  try {
    const text = req.query.text as string;
    if (!text) {
      res.status(400).json({ error: "No text provided" });
    }
    // const params = speechRequest.parse(req.body);
    //
    const buff = await generateSpeechStream(text);
    res.send(buff);
    // stream.pipeTo(res);
    //res.send(stream);
    //res.writeHead(200, {
    //  "Content-Type": "audio/mpeg",
    //  "Transfer-Encoding": "chunked",
    //  connection: "keep-alive",
    //});
    //res.end();
    //const reader = stream.getReader();
    //while (true) {
    //  const { value, done } = await reader.read();
    //  if (done) {
    //    break;
    //  }
    //  res.write(value);
    //}
    //res.end();

    //stream.pipe(res);
    //stream.on("end", () => {
    //  res.end();
    //});
  } catch (e) {
    if (e instanceof z.ZodError) {
      res.status(400).json({ error: e.issues });
      return;
    }
    console.log("ERROR", e);
    res.status(500).json({ error: e });
  }
});

app.post("/plot", async (req: Request, res: Response) => {
  const plotRequest = z.object({
    theme: z.string(),
    previousMessages: z.array(
      z.object({
        type: z.string(),
        text: z.string(),
      })
    ),
  });

  try {
    console.log(req.body);
    const params = plotRequest.parse(req.body);
    const messages = params.previousMessages.map((m) =>
      m.type === "NARRATIVE" ? new AIMessage(m.text) : new HumanMessage(m.text)
    );
    const stream = await generateNextPlotPointStream(params.theme, messages);

    res.writeHead(200, {
      "Content-Type": "application/json",
      "Transfer-Encoding": "chunked",
    });
    for await (const chunk of stream) {
      const json = JSON.stringify(chunk);
      res.write(json + "@");
    }
    res.end();
  } catch (e) {
    if (e instanceof z.ZodError) {
      res.status(400).json({ error: e.issues });
      return;
    }
    res.status(500).json({ error: e });
  }
});

app.ws("/story/:theme", (ws: WebSocket, req: Request) => {
  const theme = req.params.theme;
  if (!theme) {
    ws.close(400, "No theme provided");
  }

  const plot = createNewPlot(ws, theme);

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

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
