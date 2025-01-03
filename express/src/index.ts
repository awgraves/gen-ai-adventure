import express, { Request, Response } from "express";

const app = express();
const port = process.env.PORT || 9999;

app.get("/", (req: Request, res: Response) => {
  res.send("Express + TypeScript Serversss");
});

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
