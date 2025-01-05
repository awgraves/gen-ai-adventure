import OpenAI from "openai";

export const generateSpeechStream = async (text: string) => {
  const openai = new OpenAI();
  const resp = await openai.audio.speech.create({
    model: "tts-1",
    voice: "ash" as any, // lib not updated for this value yet
    input: text,
    // format: "opus",
  });

  resp.headers.forEach((v, k) => console.log(k, v));
  if (!resp.body) {
    throw new Error("No response from OpenAI");
  }
  const buff = Buffer.from(await resp.arrayBuffer());
  return buff;
  // return resp.body;
};
