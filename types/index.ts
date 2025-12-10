import type { Grade } from "@/lib/generated/prisma/enums";
import type {
  Passage,
  Question as PrismaQuestion,
} from "@/lib/generated/prisma/client";

export type FullPassage = Passage & { questions: PrismaQuestion[] };

type QuestionCommon = { id: string; prompt: string };

export type OpenQuestion = QuestionCommon & {
  kind: "open";
  expectedAnswer: string;
};

export type ClosedQuestion = QuestionCommon & {
  kind: "closed";
  options: [string, string, string];
  correctIndex?: number;
};

export type Question = OpenQuestion | ClosedQuestion;

// create passage DTO
export type PassageData = {
  title: string;
  mainImageSrc?: string;
  content: string;
  questions: Question[];
  grade: Grade;
  time: number; // 40 minut
};
