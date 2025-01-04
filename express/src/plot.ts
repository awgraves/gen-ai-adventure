import { ChatOpenAI, DallEAPIWrapper } from "@langchain/openai";
import { ChatPromptTemplate, PromptTemplate } from "@langchain/core/prompts";
import { getProtagonist } from "./themes";
import { WebSocket } from "ws";
import { imagePromptTemplate, systemTemplate } from "./systemTemplate";
import { z } from "zod";
import { AIMessage, BaseMessage, HumanMessage } from "@langchain/core/messages";

interface Plot {
  begin: () => Promise<void>;
  advance: (userChoice: string) => Promise<void>;
}

const outputSchema = z.object({
  text: z.string().describe("The next turn in the plot"),
  options: z
    .array(z.string())
    .describe(
      "The options for the player to choose from. If at the end of the story, return an empty array. Do not include any question marks or numbers in the options."
    ),
  status: z
    .enum(["IN_PROGRESS", "SUCCESS", "FAILURE"])
    .describe(
      "Whether the story is still in progress, ended in succes, or ended in failure."
    ),
});

export const createNewPlot = (ws: WebSocket, theme: string): Plot => {
  const protagonist = getProtagonist(theme);
  const llm = new ChatOpenAI({
    model: "gpt-4o-mini",
    temperature: 0.5,
  });
  const chatHistory: BaseMessage[] = [];

  const generateNextPlotPoint = async () => {
    const promptTemplate = ChatPromptTemplate.fromMessages([
      ["system", systemTemplate],
      ...chatHistory,
    ]);

    const llmWithSchema = llm.withStructuredOutput(outputSchema, {
      method: "json_schema",
    });

    const chain = promptTemplate.pipe(llmWithSchema);

    const stream = await chain.stream({ person: protagonist });

    let final: z.infer<typeof outputSchema> = {
      text: "",
      options: [],
      status: "IN_PROGRESS",
    };
    for await (const chunk of stream) {
      final = chunk as z.infer<typeof outputSchema>;
      ws.send(JSON.stringify(chunk));
    }
    if (final) {
      chatHistory.push(new AIMessage(final.text));

      // skip the first image
      if (chatHistory.length <= 2) {
        return;
      }

      const dallE = new DallEAPIWrapper({
        size: "1024x1024",
      });

      const imgPrompt = new PromptTemplate({
        inputVariables: ["person", "scene"],
        template: imagePromptTemplate,
      });

      const imgStr = await imgPrompt.invoke({
        person: protagonist,
        scene: final.text,
      });

      const imageUrl = await dallE.invoke(imgStr.toString());

      ws.send(JSON.stringify({ ...final, imageUrl }));
    }
  };

  const begin = async () => {
    await generateNextPlotPoint();
  };

  const advance = async (userChoice: string) => {
    chatHistory.push(new HumanMessage(userChoice));
    await generateNextPlotPoint();
  };

  return {
    begin,
    advance,
  };
};
