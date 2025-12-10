/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import prisma from "@/lib/db";
import { getSession } from "@/lib/session";
import { QuestionType } from "@/lib/generated/prisma/enums";
import type { FullPassage, PassageData } from "@/types";

export async function createPassage(newPassage: PassageData) {
  try {
    const session = await getSession();
    const user = session.user;

    if (!user || !user.isLoggedIn) {
      throw new Error("You must be logged in to create a passage.");
    }

    if (!newPassage.grade) {
      throw new Error("Grade is required.");
    }

    const createdPassage = await prisma.passage.create({
      data: {
        content: newPassage.content,
        grade: newPassage.grade,
        title: newPassage.title,
        imageUrl:
          "https://images.unsplash.com/photo-1584175048814-8910fd9fdf1f?q=80&w=1932&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        // imageUrl: newPassage.mainImageSrc ?? null,
        teacherId: user.id,
        questions: {
          create: newPassage.questions.map((question) => {
            const isClosed = question.kind === "closed";

            return {
              content: question.prompt,
              type: isClosed ? QuestionType.CLOSED : QuestionType.OPEN,
              options: isClosed ? question.options : [],
              // required Int in Prisma → always send something
              correctOptionIndex: isClosed
                ? (question as any).correctIndex ?? 0
                : 0,
              // only open questions have expectedAnswer
              correctAnswer: !isClosed
                ? (question as any).expectedAnswer || null
                : null,
            };
          }),
        },
      },
    });

    return createdPassage;
  } catch (error) {
    console.error("Error creating passage:", error);
    throw new Error("Failed to create passage due to a database error.");
  }
}

export async function getAllPassages(): Promise<FullPassage[]> {
  try {
    const passages = await prisma.passage.findMany({
      include: { questions: true },
      orderBy: { createdAt: "desc" },
    });

    return passages;
  } catch (error) {
    console.error("Error fetching passages:", error);
    return [];
  }
}

export async function getPassageById(id: string): Promise<FullPassage | null> {
  try {
    const passage = await prisma.passage.findFirst({
      where: { id },
      include: { questions: true },
    });

    return passage;
  } catch (error) {
    console.error("Error fetching passage:", error);
    return null;
  }
}
