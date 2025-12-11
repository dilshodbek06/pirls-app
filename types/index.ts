import type { Grade } from "@/lib/generated/prisma/enums";
import type {
  Passage,
  Question as PrismaQuestion,
} from "@/lib/generated/prisma/client";

export type FullPassage = Passage & { questions: PrismaQuestion[] };

export type AnswerMap = Record<string, number | string>;

export type QuestionEvaluationResult = {
  questionId: string;
  isCorrect: boolean;
  feedback?: string;
  type: PrismaQuestion["type"];
};

export type GradePassageResult = {
  score: number;
  totalClosed: number;
  results: QuestionEvaluationResult[];
};

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
