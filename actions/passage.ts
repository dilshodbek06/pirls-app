/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import prisma from "@/lib/db";
import { getSession } from "@/lib/session";
import { QuestionType } from "@/lib/generated/prisma/enums";
import type { FullPassage, PassageData } from "@/types";
import { put } from "@vercel/blob";

async function uploadImageToVercelBlob(dataUrl: string) {
  const blobToken = process.env.BLOB_READ_WRITE_TOKEN;

  if (!blobToken) {
    throw new Error("Missing BLOB_READ_WRITE_TOKEN environment variable.");
  }

  // Allow reusing an already uploaded URL without re-uploading.
  if (dataUrl.startsWith("http://") || dataUrl.startsWith("https://")) {
    return dataUrl;
  }

  const matches = dataUrl.match(/^data:(.+);base64,(.*)$/);

  if (!matches) {
    throw new Error("Image data is not a valid base64 data URL.");
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
    throw new Error("Upload response did not include a URL.");
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
