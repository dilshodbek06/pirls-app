/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import prisma from "@/lib/db";
import { getSession } from "@/lib/session";
import { QuestionType } from "@/lib/generated/prisma/enums";
import type { FullPassage, PassageData } from "@/types";
import { put } from "@vercel/blob";

async function uploadImageToVercelBlob(dataUrl: string): Promise<string | null> {
  if (!dataUrl) return null;

  // 1. Agar allaqachon URL bo'lsa (http, https yoki relative /), to'g'ridan-to'g'ri qaytaramiz
  if (
    dataUrl.startsWith("http://") ||
    dataUrl.startsWith("https://") ||
    dataUrl.startsWith("/")
  ) {
    return dataUrl;
  }

  // 2. Base64 rasm bo'lsa, agar BLOB_READ_WRITE_TOKEN bo'lsa Vercel Blob ga yuklaymiz
  const blobToken = process.env.BLOB_READ_WRITE_TOKEN;

  const matches = dataUrl.match(/^data:(.+);base64,(.*)$/);
  if (!matches) {
    return dataUrl;
  }

  if (!blobToken) {
    // Agar Vercel Blob token ulanmagan bo'lsa, xatolik berib qulatmasdan dataUrl ning o'zini saqlaymiz
    console.warn(
      "BLOB_READ_WRITE_TOKEN sozlanmagan. Rasm to'g'ridan-to'g'ri saqlanmoqda."
    );
    return dataUrl;
  }

  const [, mimeType, base64Payload] = matches;
  const buffer = Buffer.from(base64Payload, "base64");
  const extension = mimeType?.split("/")[1] || "png";
  const filename = `passages/${Date.now()}.${extension}`;

  const blob = await put(filename, buffer, {
    access: "public",
    token: blobToken,
    contentType: mimeType || "application/octet-stream",
  });

  if (!blob.url) {
    return dataUrl;
  }

  return blob.url;
}

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

    const imageUrl = newPassage.mainImageSrc
      ? await uploadImageToVercelBlob(newPassage.mainImageSrc)
      : null;

    const createdPassage = await prisma.passage.create({
      data: {
        content: newPassage.content,
        grade: newPassage.grade,
        title: newPassage.title,
        imageUrl,
        teacherId: user.id,
        questions: {
          create: newPassage.questions.map((question) => {
            const isClosed = question.kind === "closed";

            return {
              content: question.prompt,
              type: isClosed ? QuestionType.CLOSED : QuestionType.OPEN,
              options: isClosed ? question.options : [],
              correctOptionIndex: isClosed
                ? (question as any).correctIndex ?? 0
                : 0,
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

export async function updatePassage(
  id: string,
  updatedPassage: PassageData
): Promise<FullPassage> {
  try {
    const session = await getSession();
    const user = session.user;

    if (!user || !user.isLoggedIn) {
      throw new Error("Tahrirlash uchun tizimga kirish shart.");
    }

    if (user.role !== "TEACHER" && user.role !== "ADMIN") {
      throw new Error("Sizda passage tahrirlash huquqi yo'q.");
    }

    if (!updatedPassage.grade) {
      throw new Error("Sinf (grade) majburiy.");
    }

    // Rasm: agar yangi base64 bo'lsa — yuklash, aks holda URL saqlanadi
    const imageUrl = updatedPassage.mainImageSrc
      ? await uploadImageToVercelBlob(updatedPassage.mainImageSrc)
      : null;

    // Atomic transaction: passage + savollar birga yangilanadi
    const result = await prisma.$transaction(async (tx) => {
      // 1. Eski savollarning answer lari orqali bog'liqlikni o'chiramiz
      const existingQuestions = await tx.question.findMany({
        where: { passageId: id },
        select: { id: true },
      });
      const questionIds = existingQuestions.map((q) => q.id);

      if (questionIds.length > 0) {
        await tx.answer.deleteMany({
          where: { questionId: { in: questionIds } },
        });
        await tx.question.deleteMany({ where: { passageId: id } });
      }

      // 2. Passage asosiy ma'lumotlarini yangilash
      const passage = await tx.passage.update({
        where: { id },
        data: {
          title: updatedPassage.title,
          content: updatedPassage.content,
          grade: updatedPassage.grade,
          imageUrl,
          questions: {
            create: updatedPassage.questions.map((question) => {
              const isClosed = question.kind === "closed";
              return {
                content: question.prompt,
                type: isClosed ? QuestionType.CLOSED : QuestionType.OPEN,
                options: isClosed ? question.options : [],
                correctOptionIndex: isClosed
                  ? (question as any).correctIndex ?? 0
                  : 0,
                correctAnswer: !isClosed
                  ? (question as any).expectedAnswer || null
                  : null,
              };
            }),
          },
        },
        include: { questions: true },
      });

      return passage;
    });

    return result;
  } catch (error: any) {
    console.error("Error updating passage:", error);
    throw new Error(
      error?.message || "Passage yangilashda xatolik yuz berdi."
    );
  }
}

export async function deletePassage(id: string): Promise<void> {
  try {
    const session = await getSession();
    const user = session.user;

    if (!user || !user.isLoggedIn) {
      throw new Error("O'chirish uchun tizimga kirish shart.");
    }

    if (user.role !== "TEACHER" && user.role !== "ADMIN") {
      throw new Error("Sizda passage o'chirish huquqi yo'q.");
    }

    await prisma.$transaction(async (tx) => {
      const questions = await tx.question.findMany({
        where: { passageId: id },
        select: { id: true },
      });
      const qIds = questions.map((q) => q.id);

      if (qIds.length > 0) {
        await tx.answer.deleteMany({ where: { questionId: { in: qIds } } });
        await tx.question.deleteMany({ where: { passageId: id } });
      }

      // Result va Answer bog'liqliklarini tozalash
      const results = await tx.result.findMany({
        where: { passageId: id },
        select: { id: true },
      });
      const rIds = results.map((r) => r.id);
      if (rIds.length > 0) {
        await tx.answer.deleteMany({ where: { resultId: { in: rIds } } });
        await tx.result.deleteMany({ where: { passageId: id } });
      }

      await tx.passage.delete({ where: { id } });
    });
  } catch (error) {
    console.error("Error deleting passage:", error);
    throw new Error("Passage o'chirishda xatolik yuz berdi.");
  }
}
