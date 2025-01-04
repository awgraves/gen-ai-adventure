export const SERVER_URL = import.meta.env.VITE_SERVER_URL;

export const PLOT_URL = `http://${SERVER_URL}/plot`;

export const STORY_WS_URL = `ws://${SERVER_URL}/story`;

export const THEMES_URL = `http://${SERVER_URL}/themes`;

export const getImageUrl = (imagePath: string) => {
  return `http://${SERVER_URL}${imagePath}`;
};
