import express, { Request, Response } from "express";
import { themes } from "./themes";
import expressWs from "express-ws";
import { WebSocket } from "ws";
import cors from "cors";

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
  ws.on("message", (msg: string) => {
    console.log("received: %s", msg);
    ws.send('{"text":"Hello, world!"}');
  });
});

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
