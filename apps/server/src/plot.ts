import { ChatOpenAI } from "@langchain/openai";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { getProtagonist } from "./themes";
import { systemTemplate } from "./systemTemplate";
import { z } from "zod";
import { BaseMessage } from "@langchain/core/messages";

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

export const generateNextPlotPointStream = async (
  theme: string,
  previousMessages: BaseMessage[]
) => {
  const protagonist = getProtagonist(theme);

  const llm = new ChatOpenAI({
    model: "gpt-4o-mini",
    temperature: 0.5,
  });
  const promptTemplate = ChatPromptTemplate.fromMessages([
    ["system", systemTemplate],
    ...previousMessages,
  ]);

  const llmWithSchema = llm.withStructuredOutput(outputSchema, {
    method: "json_schema",
  });

  const chain = promptTemplate.pipe(llmWithSchema);

  const stream = await chain.stream({ person: protagonist });

  return stream;
};
