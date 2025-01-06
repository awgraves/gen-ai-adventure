# Technical Notes

## Why not a streamed HTTP response for the narrative?

This is certainly possible, and I did experiment with that approach,
but sending websocket messages ultimately felt cleaner.
Here's some example code of the custom streamed response approach:

```typescript
// server index.ts
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
```

In order for the client to properly handle this stream,
the individual response JSON objects coming from the stream of parsed LLM output needed to be separated by a delimiter, and I went with the `@` symbol since it was unlikely to appear in the JSON objects themselves.

I did not want to use the newline character `\n` as the delimiter because the JSON objects themselves could contain newlines within the text content.

Alternatively, I could have used a payload length prefix for each JSON object which might have been the best (safest) approach, though it would still end up requiring slightly more complex custom parsing on the client side.

If I had been dealing with pure text responses rather than structured JSON, I probably would have gone with the stream response approach because then it would not require any delimiters or custom parsing on the client side.

In the end, the code felt simpler and cleaner with websockets because they already handled the concept of sending/receiving a stream of individual messages.
