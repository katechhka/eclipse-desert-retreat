export type Room = {
  id: string;
  index: string;
  name: string;
  description: string;
  area: number;
  capacity: number;
  amenities: readonly string[];
  price: number;
  alt: string;
};
export const rooms: readonly Room[] = [
  {
    id: "dune-suite",
    index: "01",
    name: "Dune Suite",
    description:
      "A room for slow mornings, with a terrace tucked beside the dunes. Open the curtains and let the first light reach you where you are.",
    area: 65,
    capacity: 2,
    amenities: ["Private terrace", "King-size bed", "Walk-in shower"],
    price: 420,
    alt: "Dune Suite opening onto a terrace beside the sand.",
  },
  {
    id: "horizon-villa",
    index: "02",
    name: "Horizon Villa",
    description:
      "Glass opens the living space to a long stretch of desert. Spend the afternoon in the shade of your terrace, then watch the cliffs lose their colour at dusk.",
    area: 110,
    capacity: 3,
    amenities: ["Shaded terrace", "Separate living area", "Panoramic glazing"],
    price: 690,
    alt: "Horizon Villa with a living area facing the open desert.",
  },
  {
    id: "eclipse-residence",
    index: "03",
    name: "Eclipse Residence",
    description:
      "Two bedrooms and a shared living space give everyone room to settle in. Come together on the terrace after sunset, with the dunes stretching out beyond it.",
    area: 180,
    capacity: 4,
    amenities: ["Two bedrooms", "Private terrace", "Separate living area"],
    price: 1180,
    alt: "Eclipse Residence with a shared living space and desert-facing terrace.",
  },
];
export const sanctuariesCopy = {
  title: "The Sanctuaries",
  intro:
    "Choose a room for two or a residence with space to gather. Each opens towards the desert, with a sheltered place to sit outside as the day cools.",
  disclosure: "Demo rates in USD. Accommodation details are illustrative.",
};
