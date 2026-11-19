// Section 05, verbatim English copy from ECLIPSE_website_copy.txt.
export const dayNightCopy = {
  title: "Every hour tells a different story.",
  instruction: "Move through the day and watch the light change.",
  label: "Time of day",
};

export const dayPhases = [
  {
    id: "dawn",
    hour: 6,
    time: "06:00",
    name: "Dawn",
    description:
      "The first light catches the cliffs. The terrace is still in shade.",
  },
  {
    id: "noon",
    hour: 12,
    time: "12:00",
    name: "Day",
    description:
      "Sunlight sharpens the edges of the walls. Deep recesses hold the shade.",
  },
  {
    id: "sunset",
    hour: 18,
    time: "18:00",
    name: "Sunset",
    description:
      "The stone warms to copper as long shadows reach across the sand.",
  },
  {
    id: "night",
    hour: 24,
    time: "00:00",
    name: "Night",
    description:
      "The building settles into silhouette. A few windows glow beneath the stars.",
  },
] as const;
