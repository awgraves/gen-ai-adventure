import express, { Request, Response } from "express";
import { themes } from "./themes";

const app = express();
const port = process.env.PORT || 9999;
app.use("/static", express.static("public"));

app.get("/status", (_: Request, res: Response) => {
  res.json({ status: "ok" });
});

app.get("/themes", (_: Request, res: Response) => {
  res.json(themes);
});

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
