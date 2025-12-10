import { FullPassage } from "@/types";

export const passages: FullPassage[] = [
  // --- PASSAGE 1: Simple Machines (GRADE_3) ---
  {
    id: "p_1_machines",
    title: "Understanding Simple Machines",
    content: `A simple machine is a device that changes the direction or magnitude of a force. They make work easier! There are six basic types of simple machines.

The **lever** is a rigid bar that rests on a pivot point called a fulcrum. Think of a seesaw.

The **wheel and axle** is a wheel attached to a smaller rod (axle) that helps things roll and move heavy objects. Think of a bicycle wheel.

The **pulley** is a wheel with a groove that holds a rope, used to lift heavy things, like lifting a flag up a flagpole. Simple machines are everywhere!`,
    imageUrl: "/images/hero-bg2.jpg",
    grade: "GRADE_3",
    teacherId: "t_grade3_a",
    createdAt: new Date("2024-01-10T08:00:00Z"),
    updatedAt: new Date("2024-01-10T08:00:00Z"),
    questions: [
      {
        id: "q1_1",
        content: "What is the pivot point on a lever called?",
        type: "CLOSED",
        options: ["Axle", "Fulcrum", "Pulley"],
        correctOptionIndex: 1,
        correctAnswer: null, // CLOSED question
        passageId: "p_1_machines",
        createdAt: new Date("2024-01-10T08:05:00Z"),
        updatedAt: new Date("2024-01-10T08:05:00Z"),
      },
      {
        id: "q1_2",
        content: "Name one type of simple machine mentioned in the passage.",
        type: "OPEN",
        options: [],
        correctOptionIndex: -1,
        correctAnswer: "Lever, Wheel and Axle, or Pulley.", // OPEN question
        passageId: "p_1_machines",
        createdAt: new Date("2024-01-10T08:06:00Z"),
        updatedAt: new Date("2024-01-10T08:06:00Z"),
      },
    ],
  },

  // --- PASSAGE 2: Plant Needs (GRADE_3) ---
  {
    id: "p_2_plants",
    title: "What Do Plants Need to Grow?",
    content: `Just like people and animals, plants need certain things to survive and grow big and strong. The three most important things for a plant are **water**, **sunlight**, and **nutrients** from the soil.

Water helps carry food throughout the plant. Sunlight gives the plant the energy it needs to make its own food in a process called photosynthesis. Nutrients act like vitamins, helping the plant build strong roots and green leaves. If a plant is missing one of these three things, it will not grow well.`,
    imageUrl: "/images/hero-bg2.jpg",
    grade: "GRADE_3",
    teacherId: "t_grade3_a",
    createdAt: new Date("2024-01-12T09:15:00Z"),
    updatedAt: new Date("2024-01-12T09:15:00Z"),
    questions: [
      {
        id: "q2_1",
        content:
          "What process allows plants to make their own food using sunlight?",
        type: "CLOSED",
        options: ["Evaporation", "Respiration", "Photosynthesis"],
        correctOptionIndex: 2,
        correctAnswer: null,
        passageId: "p_2_plants",
        createdAt: new Date("2024-01-12T09:20:00Z"),
        updatedAt: new Date("2024-01-12T09:20:00Z"),
      },
    ],
  },

  // --- PASSAGE 3: US Government Branches (GRADE_4) ---
  {
    id: "p_3_govt",
    title: "Three Branches of US Government",
    content: `The government of the United States is divided into three main parts, or branches, to ensure no single group becomes too powerful. This system is called checks and balances.

The **Legislative Branch** (Congress) makes the laws.
The **Executive Branch** (President) carries out the laws.
The **Judicial Branch** (Supreme Court) interprets the laws and makes sure they are fair.

Each branch has its own responsibilities, and they all work together to run the country.`,
    imageUrl: "/images/hero-bg2.jpg",
    grade: "GRADE_4",
    teacherId: "t_grade4_b",
    createdAt: new Date("2024-01-15T11:45:00Z"),
    updatedAt: new Date("2024-01-15T11:45:00Z"),
    questions: [
      {
        id: "q3_1",
        content: "What is the job of the Executive Branch?",
        type: "CLOSED",
        options: ["To make laws", "To carry out laws", "To interpret laws"],
        correctOptionIndex: 1,
        correctAnswer: null,
        passageId: "p_3_govt",
        createdAt: new Date("2024-01-15T11:50:00Z"),
        updatedAt: new Date("2024-01-15T11:50:00Z"),
      },
      {
        id: "q3_2",
        content:
          "What is the name of the system used to prevent one branch from becoming too powerful?",
        type: "OPEN",
        options: [],
        correctOptionIndex: -1,
        correctAnswer: "Checks and balances.",
        passageId: "p_3_govt",
        createdAt: new Date("2024-01-15T11:51:00Z"),
        updatedAt: new Date("2024-01-15T11:51:00Z"),
      },
    ],
  },

  // --- PASSAGE 4: Ancient Rome (GRADE_4) ---
  {
    id: "p_4_rome",
    title: "Life in Ancient Rome",
    content: `Ancient Rome was one of the most powerful civilizations in history. It began as a small town in Italy and grew into a huge empire that controlled much of Europe, North Africa, and the Middle East.

Romans were skilled builders. They constructed strong roads that helped their armies and trade move quickly. They also built impressive aqueducts, which were channels used to bring fresh water from the hills into the cities for drinking and public baths.

The city of Rome was a busy place with public forums, temples, and large stadiums like the Colosseum, where people watched gladiator fights and other entertainment.`,
    imageUrl: "/images/hero-bg2.jpg",
    grade: "GRADE_4",
    teacherId: "t_grade4_b",
    createdAt: new Date("2024-01-20T14:20:00Z"),
    updatedAt: new Date("2024-01-20T14:20:00Z"),
    questions: [
      {
        id: "q4_1",
        content: "What were aqueducts used for in ancient Rome?",
        type: "CLOSED",
        options: [
          "To hold gladiator fights",
          "To bring fresh water into cities",
          "To build roads quickly",
        ],
        correctOptionIndex: 1,
        correctAnswer: null,
        passageId: "p_4_rome",
        createdAt: new Date("2024-01-20T14:25:00Z"),
        updatedAt: new Date("2024-01-20T14:25:00Z"),
      },
      {
        id: "q4_2",
        content: "Describe two things Romans built that helped their society.",
        type: "OPEN",
        options: [],
        correctOptionIndex: -1,
        correctAnswer:
          "Strong roads (helped with army/trade) and impressive aqueducts (brought fresh water).",
        passageId: "p_4_rome",
        createdAt: new Date("2024-01-20T14:26:00Z"),
        updatedAt: new Date("2024-01-20T14:26:00Z"),
      },
    ],
  },
];
