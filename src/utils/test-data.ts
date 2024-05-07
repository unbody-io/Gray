import { CategoryRaw } from "@/types/data.types";

export const testIntro = `Welcome to our blog exploring the world of [electric vehicles] and [sustainable transportation] in cities like [Amsterdam], [Oslo], [Paris], and [Beijing]. From [Elon Musk] to [charging infrastructure], we delve into the latest in [clean energy] and [EV adoption]. But that's not all - we also discuss the cinematic genius of [Quentin Tarantino], the football legend [Diego Maradona], and the impact of filmmakers like [Martin Scorsese] and [Sergio Leone]. Join us on a journey of innovation, controversy, and cultural influence!`;

export const testTopics = [
  { topic: "electric-vehicles", weight: 1 },
  { topic: "urban-mobility", weight: 0.8 },
  { topic: "sustainable-transportation", weight: 0.7 },
  { topic: "clean-energy", weight: 0.6 },
  { topic: "air-quality", weight: 0.6 },
  { topic: "ev-adoption", weight: 0.9 },
  { topic: "electric-vehicles", weight: 1 },
  { topic: "urban-mobility", weight: 0.8 },
  { topic: "sustainable-transportation", weight: 0.7 },
  { topic: "charging-infrastructure", weight: 0.9 },
  { topic: "consumer-education", weight: 0.7 },
  { topic: "policy-support", weight: 0.8 },
  { topic: "quentin-tarantino", weight: 1 },
  { topic: "diego-maradona", weight: 1 },
  { topic: "film-industry", weight: 0.8 },
  { topic: "football", weight: 0.8 },
  { topic: "innovation", weight: 0.7 },
  { topic: "controversy", weight: 0.6 },
  { topic: "quentin-tarantino", weight: 1 },
  { topic: "cinematic-artistry", weight: 0.9 },
  { topic: "filmography", weight: 0.8 },
  { topic: "storytelling", weight: 0.7 },
  { topic: "genre-blending", weight: 0.8 },
  { topic: "cultural-impact", weight: 0.1 },
];

export const testEntities = [
  { entity: "elon-musk", type: "person" },
  { entity: "amsterdam", type: "city" },
  { entity: "oslo", type: "city" },
  { entity: "paris", type: "city" },
  { entity: "beijing", type: "city" },
  { entity: "quentin-tarantino", type: "person" },
  { entity: "diego-maradona", type: "person" },
  { entity: "martin-scorsese", type: "person" },
  { entity: "sergio-leone", type: "person" },
  { entity: "brian-de-palma", type: "person" },
  { entity: "john-travolta", type: "person" },
  { entity: "uma-thurman", type: "person" },
  { entity: "samuel-l-jackson", type: "person" },
  { entity: "christoph-waltz", type: "person" },
];

export const testCategories: CategoryRaw[] = [
  {
    title: "The Electric Urban Revolution",
    summary:
      "Exploring the intersection of electric vehicles and urban mobility for a sustainable future.",
    topics: [
      "electric-vehicles",
      "urban-mobility",
      "sustainable-transportation",
    ],
    entities: ["elon-musk", "amsterdam", "oslo", "paris", "beijing"],
  },
  {
    title: "The Maverick Icons: Quentin Tarantino and Diego Maradona",
    summary:
      "A deep dive into the innovative worlds of Quentin Tarantino in film and Diego Maradona in football.",
    topics: [
      "quentin-tarantino",
      "diego-maradona",
      "film-industry",
      "football",
    ],
    entities: ["quentin-tarantino", "diego-maradona"],
  },
  {
    title: "The Artistry of Quentin Tarantino",
    summary:
      "Exploring Quentin Tarantino's unique storytelling and genre-blending impact on cinematic culture.",
    topics: [
      "quentin-tarantino",
      "cinematic-artistry",
      "filmography",
      "storytelling",
      "cultural-impact",
    ],
    entities: [
      "quentin-tarantino",
      "martin-scorsese",
      "sergio-leone",
      "brian-de-palma",
      "john-travolta",
      "uma-thurman",
      "samuel-l-jackson",
      "christoph-waltz",
    ],
  },
];
