# Gen AI Adventure

A themed, text and speech adventure game powered by generative AI.

## Game play

Select your theme.
![theme selection](/screenshots/theme_selection.png)

The AI will generate a unique story for your chosen theme.
At each turn, choose your next move.
![story begin](/screenshots/story_begin.png)

If you want to hear the AI narrate the text out loud, toggle the Audio option at the top (disabled by default).
![audio toggle](/screenshots/audio.png)

If you are not careful, you will end up dead and the mission will be failed.
![mission failure](/screenshots/mission_failed.png)

You can replay the same theme, but the details of the story will be different each time!

Choose your moves carefully, and you will succeed.
![mission success](/screenshots/mission_success.png)

## Requirements

1. An OpenAI API key (see setup instructions below)
2. [Docker Compose](https://docs.docker.com/compose/install/)
3. (optional) yarn for installing local code dependencies when developing

## Setup

### 1. Generate an OpenAI API key

1. Create and fund an OpenAI API [platform account](https://openai.com/api/).
1. Go to 'Api keys', and 'Create new secret key'

### 2. Add your key to an env file

1. Create a new `.env` file at the root of this repo (see the `.example.env` file provided)
1. Paste the API key you generated as the value for `OPENAI_API_KEY` (note: try not to use quotes around the value).

### 3. Start the app

In the root of this repo, run `docker compose up --build`

After the build finishes, give it a minute and then visit http://localhost

## Technical notes

### Stack

- Monorepo with [yarn workspaces](https://yarnpkg.com/features/workspaces)
- [Docker](https://www.docker.com/) & [Docker Compose](https://docs.docker.com/compose/)
- Backend:
  - [Express](https://expressjs.com/)
  - [Typescript](https://www.typescriptlang.org/)
  - [langchain](https://www.langchain.com/)
  - [GPT-4o mini](https://openai.com/index/gpt-4o-mini-advancing-cost-efficient-intelligence/)
- Frontend:
  - [Vite](https://vite.dev/)
  - [Typescript](https://www.typescriptlang.org/)
  - [React](https://react.dev/)

### Images for narrative points

I thought it would be cool to have an image for each plot point, so I tried it and ran into a few issues.

First, it was difficult to get a consistent art style for the images.

Second, due to the sometimes violent nature of the narrative, the AI would refuse to generate an image to represent what was happening.

So I decided to leave the images out for now and just keep the thumbnails at the top to set the scene.

Here's some example code of what I had:

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
