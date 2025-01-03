interface ThemeOption {
  description: string;
  value: string;
  imagePath: string;
}

export const themes: ThemeOption[] = [
  {
    description:
      "Play as Captain Morgan, a pirate captain seeking a lost treasure.",
    value: "pirate",
    imagePath: "/static/pirate.webp",
  },
  {
    description:
      "Play as Major Tom, an astronaut seeking a rare mineral on an alien planet.",
    value: "astronaut",
    imagePath: "/static/astronaut.webp",
  },
  {
    description: "Play as Billy the Kid, a cowboy seeking a lost gold mine.",
    value: "cowboy",
    imagePath: "/static/cowboy.webp",
  },
  {
    description:
      "Play as Jacques Cousteau, a scuba diver seeking the lost city of Atlantis.",
    value: "scuba",
    imagePath: "/static/scuba.webp",
  },
];
