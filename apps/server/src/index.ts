import express, { Request, Response } from "express";
import { themes } from "./themes";
import cors from "cors";
import { generateNextPlotPointStream } from "./plot";
import { z } from "zod";
import { generateSpeechStream } from "./speech";
import { AIMessage } from "@langchain/core/messages";
import { HumanMessage } from "@langchain/core/messages";

const app = express();

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

app.post("/plot", async (req: Request, res: Response) => {
  const plotRequest = z.object({
    theme: z.string(),
    history: z.array(
      z.object({
        type: z.string(),
        text: z.string(),
      })
    ),
  });

  try {
    const params = plotRequest.parse(req.body);
    const messages = params.history.map((m) =>
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
    console.log("error generating plot", e);
    if (e instanceof z.ZodError) {
      res.status(400).json({ error: e.issues });
      return;
    }
    res.status(500).json({ error: `${e}` });
  }
});

app.get("/speech", async (req: Request, res: Response) => {
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
