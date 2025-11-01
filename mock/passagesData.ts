export interface Question {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
}

export interface Passage {
  id: string;
  title: string;
  preview: string;
  difficulty: "Easy" | "Medium" | "Hard";
  fullText: string;
  questions: Question[];
}

export const passages: Passage[] = [
  {
    id: "1",
    title: "The Amazing Dolphins",
    preview:
      "Discover the incredible world of dolphins and their remarkable intelligence...",
    difficulty: "Easy",
    fullText: `Dolphins are among the most intelligent animals on Earth. These marine mammals are known for their playful behavior and remarkable communication skills. Dolphins live in groups called pods and work together to hunt for fish.

One of the most fascinating things about dolphins is their ability to use echolocation. This means they can find objects by making clicking sounds and listening to the echoes that bounce back. It's like having a built-in sonar system!

Dolphins are also very social creatures. They play together, help each other when injured, and even have unique whistles that work like names. Scientists believe dolphins can recognize themselves in mirrors, which shows they have self-awareness.

These amazing animals can swim at speeds up to 20 miles per hour and dive as deep as 1,000 feet. They need to come to the surface to breathe air, just like us. A dolphin's brain is actually larger than a human's brain!`,
    questions: [
      {
        id: "q1",
        question: "What do dolphins use echolocation for?",
        options: [
          "To communicate with other dolphins",
          "To find objects by listening to echoes",
          "To play games",
          "To sleep underwater",
        ],
        correctAnswer: 1,
      },
      {
        id: "q2",
        question: "What is a group of dolphins called?",
        options: ["A school", "A pod", "A herd", "A pack"],
        correctAnswer: 1,
      },
      {
        id: "q3",
        question: "How fast can dolphins swim?",
        options: [
          "Up to 10 mph",
          "Up to 15 mph",
          "Up to 20 mph",
          "Up to 30 mph",
        ],
        correctAnswer: 2,
      },
    ],
  },
  {
    id: "2",
    title: "The Journey of a Raindrop",
    preview:
      "Follow the incredible adventure of a single raindrop through the water cycle...",
    difficulty: "Medium",
    fullText: `Have you ever wondered where rain comes from? Every raindrop has an amazing journey through what scientists call the water cycle.

It all begins when the sun heats up water in oceans, lakes, and rivers. The heat causes the water to evaporate, turning it into water vapor—an invisible gas that rises into the sky. This process is called evaporation.

As the water vapor rises higher into the atmosphere, it cools down. When it gets cold enough, the water vapor condenses into tiny water droplets that form clouds. Millions and millions of these tiny droplets come together to create the fluffy clouds we see in the sky.

When the droplets in a cloud become too heavy, they fall back to Earth as precipitation—rain, snow, sleet, or hail, depending on the temperature. Some of this water flows into streams and rivers, eventually making its way back to the ocean. Some soaks into the ground, where plants can use it. And some evaporates again, continuing the endless cycle.

This water cycle has been happening for billions of years, recycling the same water over and over again. The water you drink today might have once been part of a dinosaur's drinking water millions of years ago!`,
    questions: [
      {
        id: "q1",
        question: "What causes water to evaporate?",
        options: [
          "The moon's gravity",
          "The wind blowing",
          "Heat from the sun",
          "Cold temperatures",
        ],
        correctAnswer: 2,
      },
      {
        id: "q2",
        question: "What happens to water vapor when it rises and cools?",
        options: [
          "It freezes immediately",
          "It disappears completely",
          "It condenses into water droplets",
          "It becomes heavier",
        ],
        correctAnswer: 2,
      },
      {
        id: "q3",
        question:
          "According to the passage, what is true about the water we drink today?",
        options: [
          "It is completely new water",
          "It might have existed millions of years ago",
          "It came from space",
          "It was created last year",
        ],
        correctAnswer: 1,
      },
    ],
  },
  {
    id: "3",
    title: "Ancient Egyptian Pyramids",
    preview:
      "Explore the mysteries and engineering marvels of the Egyptian pyramids...",
    difficulty: "Hard",
    fullText: `The pyramids of ancient Egypt stand as some of the most impressive architectural achievements in human history. Built over 4,500 years ago, these massive stone structures were created as tombs for pharaohs and their families.

The Great Pyramid of Giza, built for Pharaoh Khufu, is the largest of all Egyptian pyramids. It originally stood 481 feet tall and was the tallest human-made structure in the world for over 3,800 years. The pyramid contains approximately 2.3 million stone blocks, each weighing between 2.5 and 15 tons.

One of the greatest mysteries surrounding the pyramids is how ancient Egyptians managed to build them with such precision using only simple tools. They didn't have modern machinery, computers, or even wheels for construction. Current theories suggest they used ramps, levers, and thousands of workers to move and position the massive stones.

The pyramids were not built by slaves, as many people believe. Recent archaeological evidence shows they were constructed by paid laborers who lived in nearby workers' villages. These workers received regular wages, medical care, and were given proper burials—showing they were valued members of society.

Inside the pyramids, elaborate passageways lead to burial chambers decorated with hieroglyphics—the ancient Egyptian writing system. These writings provide valuable information about Egyptian religious beliefs, daily life, and history. The pyramids were designed to help pharaohs reach the afterlife, which was central to ancient Egyptian religion.

Today, the pyramids continue to fascinate people worldwide. They remind us of human ingenuity, determination, and the desire to create something that will last forever. Despite centuries of study, the pyramids still hold many secrets waiting to be discovered.`,
    questions: [
      {
        id: "q1",
        question:
          "How tall was the Great Pyramid of Giza when it was first built?",
        options: ["381 feet", "431 feet", "481 feet", "531 feet"],
        correctAnswer: 2,
      },
      {
        id: "q2",
        question: "According to the passage, who built the pyramids?",
        options: [
          "Slaves who were forced to work",
          "Paid laborers who were valued workers",
          "Foreign workers from other countries",
          "Robots and advanced technology",
        ],
        correctAnswer: 1,
      },
      {
        id: "q3",
        question: "What was the main purpose of building the pyramids?",
        options: [
          "To show off Egypt's wealth",
          "To serve as tombs and help pharaohs reach the afterlife",
          "To store grain during famines",
          "To serve as military fortresses",
        ],
        correctAnswer: 1,
      },
      {
        id: "q4",
        question: "What do hieroglyphics provide us with today?",
        options: [
          "Instructions for building pyramids",
          "Maps to hidden treasure",
          "Information about Egyptian beliefs and history",
          "Recipes for ancient Egyptian food",
        ],
        correctAnswer: 2,
      },
    ],
  },
  {
    id: "4",
    title: "The Life of Bees",
    preview:
      "Learn about the fascinating social structure and importance of honeybees...",
    difficulty: "Easy",
    fullText: `Honeybees are incredible insects that play a vital role in our world. These small creatures live together in large groups called colonies, where each bee has a specific job to do.

In every bee colony, there are three types of bees: the queen, the workers, and the drones. The queen bee is the largest bee in the hive and her main job is to lay eggs—sometimes up to 2,000 eggs per day! There is only one queen in each colony.

Worker bees are all female and do most of the work in the hive. Some workers collect nectar and pollen from flowers, which they bring back to make honey. Other workers build the honeycomb, clean the hive, or guard the entrance. Worker bees even fan their wings to keep the hive cool on hot days!

Drones are male bees whose only job is to mate with the queen. They don't collect nectar or help with any work in the hive.

Bees are essential for pollination. When a bee visits a flower to collect nectar, pollen sticks to its fuzzy body. When the bee flies to another flower, some of this pollen rubs off, helping plants create seeds and fruit. Without bees, many of the fruits and vegetables we eat wouldn't exist!`,
    questions: [
      {
        id: "q1",
        question: "What is the main job of the queen bee?",
        options: [
          "To collect nectar",
          "To guard the hive",
          "To lay eggs",
          "To make honey",
        ],
        correctAnswer: 2,
      },
      {
        id: "q2",
        question: "Which type of bee does most of the work in the hive?",
        options: ["Queen bees", "Worker bees", "Drones", "Baby bees"],
        correctAnswer: 1,
      },
      {
        id: "q3",
        question: "Why are bees important for plants?",
        options: [
          "They eat harmful insects",
          "They water the plants",
          "They help with pollination",
          "They protect plants from wind",
        ],
        correctAnswer: 2,
      },
    ],
  },
];
