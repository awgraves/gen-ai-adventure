import fetch from "node-fetch";
/*
OPENAI response headers:
connection keep-alive
transfer-encoding chunked
content-type audio/mpeg
*/

export const generateSpeechStream = async (text: string) => {
  const resp = await fetch(`https://api.openai.com/v1/audio/speech`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "tts-1",
      voice: "ash",
      input: text,
      response_format: "opus",
    }),
  });

  return resp.body;
};
