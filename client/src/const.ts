export const SERVER_URL = import.meta.env.VITE_SERVER_URL;

export const THEMES_URL = `http://${SERVER_URL}/themes`;

export const PLOT_URL = `http://${SERVER_URL}/plot`;

export const SPEECH_URL = `http://${SERVER_URL}/speech`;

export const getImageUrl = (imagePath: string) => {
  return `http://${SERVER_URL}${imagePath}`;
};
