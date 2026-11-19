import { assetPath } from "./assets";
// Exact section 06 copy from ECLIPSE_website_copy.txt.
export const experiencesCopy = {
  title: "Beyond the Stay",
  intro:
    "Follow a trail between the rocks, linger over dinner, or look up as the sky darkens. Leave a little of your stay unplanned.",
} as const;
export const experiences = [
  {
    id: "spa",
    name: "Desert Spa",
    image: assetPath("/images/experience-spa"),
    alt: "A softly lit private spa treatment space.",
    teaser:
      "Step into a quiet treatment room after a day outside. Warm oils and an unhurried massage ease you into the evening.",
    body: "A shaded room, soft light and time to settle before your treatment. The imagined spa programme centres on private sessions, with the pace and pressure of each massage shaped around your preferences.",
    note: "Illustrative wellness programme. Treatments are not available to book.",
    rituals: [
      {
        title: "Warm oil massage",
        description:
          "A slow massage with warm oil, with pressure adjusted to your comfort.",
      },
      {
        title: "Gentle body polish",
        description: "A light exfoliating treatment followed by a quiet rest.",
      },
      {
        title: "Quiet recovery",
        description:
          "Time to lie back after your ritual, with water close at hand.",
      },
    ],
  },
  {
    id: "stargazing",
    name: "Stargazing",
    image: assetPath("/images/experience-stargazing"),
    alt: "A place to sit outside beneath the desert night sky.",
    teaser:
      "Let your eyes adjust to the dark. The first few stars soon become too many to count.",
    body: "The evening begins outside, away from the glow of the rooms. Settle into a chair and take your time looking up. In this imagined experience, a guide introduces the shapes of the constellations and leaves plenty of space for questions.",
    extra:
      "What you see would depend on the season, weather and moonlight. The sky has its own plans.",
    note: "Concept experience. No sessions or sky conditions are guaranteed.",
    rituals: [],
  },
  {
    id: "dining",
    name: "Private Dining",
    image: assetPath("/images/experience-dining"),
    alt: "A private dinner table set outside in the desert.",
    teaser:
      "A table set apart, with the evening opening out around you. Stay for another course as the air begins to cool.",
    body: "Dinner moves outside to a sheltered table. The proposed menu brings together warm bread, vegetables from the grill and dishes made for sharing. There is time between courses to watch the last light leave the cliffs.",
    extra:
      "Browse the sample menu for a sense of the food imagined for ECLIPSE.",
    note: "Concept experience. Dining arrangements are illustrative.",
    rituals: [],
  },
  {
    id: "exploration",
    name: "Desert Exploration",
    image: assetPath("/images/experience-exploration"),
    alt: "A path through red sand and sandstone formations.",
    teaser:
      "Walk beyond the terrace and the scale of the landscape changes. A bend in the rock opens onto another stretch of sand.",
    body: "An imagined guided walk follows the spaces between the dunes and sandstone formations. There are pauses for shade and time to notice the smaller details: tracks in the sand, layers in the rock, a patch of colour close to the ground.",
    extra:
      "This is a description of the concept, not a published route or an activity booking.",
    rituals: [],
  },
] as const;
