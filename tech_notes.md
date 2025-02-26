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
    if (e instanceof z.ZodError) {
      res.status(400).json({ error: e.issues });
      return;
    }
    res.status(500).json({ error: e });
  }
});
```

And the client side:

```typescript
// Story/index.tsx
// inside the component...
const fetchNextPlotPoint = () => {
  fetch(PLOT_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      theme: theme.value,
      previousMessages: plotPoints,
    }),
  }).then((res) => {
    const stream = res.body?.getReader();
    if (!stream) {
      return;
    }

    const decoder = new TextDecoder();
    let buffer = "";

    const read = async () => {
      const { done, value } = await stream.read();
      if (done) {
        return;
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
        setLatestNarrative({ ...json, type: "NARRATIVE" });
      }
      read();
    };
    read();
  });
};
```

## Images for each plot point

I thought it would be nice to have an image for each plot point, so I did try this out and ran into a few issues.

First, it was difficult to get a consistent art style for the images.

Second, due to the sometimes violent nature of the narrative, the AI would refuse to generate an image to represent what was happening.

So I decided to leave the images out for now and just keep the thumbnails at the top to set the scene.

Here's some example code of what i had:

```typescript
export const imagePromptTemplate = `
Generate an image of the scene described below in between three #.

Here are some rules:
1. The 'you' referenced in the text is {person}. ALWAYS show the scene as seen through the eyes of {person}.
2. Do NOT include any text in the image of the narration.
3. Use a realistic style for the image.

###
{scene}
###
`;

// server side, immediately after generating the plot point text and options, would call this function
// and append the imageURL onto the plot point object
const generateImageForCurrentPlotPoint = async () => {
  const lastPlotPoint = chatHistory[chatHistory.length - 1];
  const dallE = new DallEAPIWrapper({
    size: "1024x1024",
  });

  const imgPrompt = new PromptTemplate({
    inputVariables: ["person", "scene"],
    template: imagePromptTemplate,
  });

  const imgStr = await imgPrompt.invoke({
    person: protagonist,
    scene: lastPlotPoint.content,
  });

  const imageUrl = await dallE.invoke(imgStr.toString());

  return imageUrl;
};
```
