export const protagonists: Record<string, string> = {
  pirate: "Captain Morgan, a pirate captain seeking a lost treasure",
  astronaut:
    "Major Tom, an astronaut seeking a rare mineral on an alien planet",
  cowboy: "Billy the Kid, a cowboy seeking a lost gold mine",
  scuba: "Jacques Cousteau, a scuba diver seeking the lost city of Atlantis",
};

export const getProtagonist = (theme: string) =>
  protagonists[theme] || protagonists["pirate"];

const getDescription = (theme: string) => {
  return `Play as ${getProtagonist(theme)}.`;
};

interface ThemeOption {
  description: string;
  value: string;
  imagePath: string;
}

export const themes: ThemeOption[] = [
  {
    description: getDescription("pirate"),
    value: "pirate",
    imagePath: "/static/pirate.webp",
  },
  {
    description: getDescription("astronaut"),
    value: "astronaut",
    imagePath: "/static/astronaut.webp",
  },
  {
    description: getDescription("cowboy"),
    value: "cowboy",
    imagePath: "/static/cowboy.webp",
  },
  {
    description: getDescription("scuba"),
    value: "scuba",
    imagePath: "/static/scuba.webp",
  },
];
