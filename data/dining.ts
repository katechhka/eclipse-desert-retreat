// Exact section 07 copy from ECLIPSE_website_copy.txt.
export const diningCopy = {
  paragraphs: [
    "Warm bread arrives at the table, ready to tear and share. Vegetables take on a little char from the grill. The food imagined for ECLIPSE begins with local produce and the pleasure of a meal that has time to unfold.",
    "Take a table by the window or picture dinner outside as the air cools. Clay plates and soft light keep the setting simple, with the desert just beyond your seat.",
  ],
  cta: "Discover the menu",
  menuTitle: "At the desert table",
  menuIntro: "A few dishes imagined for a long evening at ECLIPSE.",
  note: "Illustrative menu for a fictional retreat. No food orders or dining reservations are taken.",
} as const;
export const diningMenu = [
  {
    title: "To begin",
    dishes: [
      {
        name: "Warm flatbread",
        description: "Olive oil, za'atar and a spoonful of labneh.",
      },
      {
        name: "Roasted aubergine",
        description: "Tahini, lemon and pomegranate seeds.",
      },
    ],
  },
  {
    title: "From the kitchen",
    dishes: [
      {
        name: "Slow-cooked lamb",
        description: "Freekeh with herbs and roasted onions.",
      },
      {
        name: "Charred cauliflower",
        description: "Chickpeas, tahini and a bright lemon dressing.",
      },
    ],
  },
  {
    title: "Something sweet",
    dishes: [
      { name: "Date cake", description: "Yoghurt cream and toasted sesame." },
    ],
  },
  {
    title: "To sip",
    dishes: [
      { name: "Mint tea", description: "Fresh mint, served warm." },
      {
        name: "Cardamom coffee",
        description: "A small cup to finish the evening.",
      },
    ],
  },
] as const;
