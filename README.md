# Gen AI Adventure

A themed, text and speech adventure game powered by generative AI.

## Game play

Select your theme
![theme selection](/screenshots/theme_selection.png)

The AI will generate a unique story for your chosen theme.
At each turn, choose your next move.
![story begin](/screenshots/story_begin.png)

If you want to hear the AI narrate the text out loud, toggle the Audio option at the top. (disabled by default)
![audio toggle](/screenshots/audio.png)

If you are not careful, you will end up dead and the mission will be failed.
![mission failure](/screenshots/mission_failed.png)

You can replay the same theme, but the story will be different each time you play!

Choose your moves carefully, and you will succeed.
![mission success](/screenshots/mission_success.png)

## Requirements

1. An OpenAI API key (see setup instructions below)
2. [Docker Compose](https://docs.docker.com/compose/install/)
3. (optional) yarn for installing local code dependencies when developing

## Setup

### 1. Generate an OpenAI API key

1. Create and fund an OpenAI API [platform account](https://openai.com/api/).
1. Go to 'Api keys', and Create new secret key

### 2. Add your key to an env file

1. Create a new `.env` file at the root of this repo (see the `.example.env` file provided)
1. Paste the API key you generated in between quotes as the value for `OPENAI_API_KEY`

### 3. Start the app

In the root of this repo, run `docker compose up --build`

After build, give it a minute and then visit http://localhost
