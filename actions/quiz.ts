/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { GoogleGenAI, Type } from "@google/genai";
import prisma from "@/lib/db";
import { getSession } from "@/lib/session";
import { QuestionType } from "@/lib/generated/prisma/enums";
import type { AnswerMap, GradePassageResult } from "@/types";

type GradePassageAnswersParams = {
  passageId: string;
  answers: AnswerMap;
};

type OpenEvaluation = {
  isCorrect: boolean;
  feedback?: string;
};

const GEMINI_MODEL = "gemini-2.5-flash";

function getGeminiModel() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY konfiguratsiya qilinmagan.");
  }

  const genAI = new GoogleGenAI({ apiKey });
  return genAI;
}

async function safeGenerateContent(
  model: GoogleGenAI,
  prompt: string,
  responseSchema: any,
  maxRetries = 3
): Promise<string> {
  let lastError: unknown;

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      const response = await model.models.generateContent({
        model: GEMINI_MODEL,
        contents: [
          {
            role: "user",
            parts: [{ text: prompt }],
          },
        ],
        config: {
          responseMimeType: "application/json",
          responseSchema,
          temperature: 0.1,
        },
      });

      // Turli SDK versiyalari uchun moslashuvchan text olish
      let rawText: string | undefined;
      if (response.text) {
        rawText = response.text;
      } else if (response.candidates?.[0]?.content?.parts?.[0]?.text) {
        rawText = response.candidates[0].content.parts[0].text;
      }

      if (!rawText) {
        throw new Error("Javob matni topilmadi");
      }

      return rawText;
    } catch (error: any) {
      lastError = error;

      // Faqat 503 xatolari uchun retry
      const isRetryable =
        error.status === 503 ||
        error.code === 503 ||
        error.message?.includes("overloaded") ||
        error.message?.includes("UNAVAILABLE");

      if (!isRetryable || attempt === maxRetries - 1) {
        console.error(`Gemini API xatosi (urinish ${attempt + 1}):`, error);
        throw error;
      }

      // Exponential backoff: 1s, 2s, 4s
      const delay = 1000 * Math.pow(2, attempt);
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }

  throw lastError;
}

async function evaluateOpenAnswer(params: {
  questionContent: string;
  correctAnswer: string;
  studentAnswer: string;
  passageContent: string;
}): Promise<OpenEvaluation> {
  const { questionContent, correctAnswer, studentAnswer, passageContent } =
    params;

  if (!correctAnswer.trim()) {
    return {
      isCorrect: false,
      feedback: "Ochiq savol uchun to'g'ri javob bazada topilmadi.",
    };
  }

  try {
    const genAI = getGeminiModel();
    const responseSchema = {
      type: Type.OBJECT,
      properties: {
        isCorrect: {
          type: Type.BOOLEAN,
          description: "Javob to'g'ri bo'lsa true, aks holda false.",
        },
        feedback: {
          type: Type.STRING,
          description: "Qisqa, tushunarli va o'zbek tilidagi izoh.",
        },
      },
      required: ["isCorrect"],
    };

    const prompt = `
Siz boshlang'ich sinf o'quvchilarining javoblarini tekshiruvchi baholovchisiz.
Savol: """${questionContent}"""
Matn: """${passageContent}"""
O'qituvchi belgilagan to'g'ri javob: """${correctAnswer}"""
O'quvchi javobi: """${studentAnswer}"""

Baholash qoidalari:
- Asosiy ma'lumotlar mos kelsa, grammatik xatolarni e'tiborsiz qoldiring.
- Javob to'liq mos kelmasa ham, mantiqan to'g'ri bo'lsa isCorrect ni true qiling.
- Faqat berilgan JSON sxemasiga muvofiq javob qaytaring, qo'shimcha matn yozmang.
`;

    const rawText = await safeGenerateContent(genAI, prompt, responseSchema);
    const parsed = JSON.parse(rawText) as OpenEvaluation;

    return {
      isCorrect: Boolean(parsed.isCorrect),
      feedback: parsed.feedback?.slice(0, 300) || "Baholash muvaffaqiyatli.",
    };
  } catch (error) {
    console.error("Ochiq savolni baholashda xatolik:", error);
    return {
      isCorrect: false,
      feedback:
        "AI orqali baholashda xatolik yuz berdi. Iltimos, keyinroq yana urinib ko'ring.",
    };
  }
}

export async function gradePassageAnswers({
  passageId,
  answers,
}: GradePassageAnswersParams): Promise<GradePassageResult> {
  const session = await getSession();
  const user = session.user;

  if (!user || !user.isLoggedIn) {
    throw new Error("Foydalanuvchi tizimga kirmagan.");
  }

  if (user.role !== "USER") {
    throw new Error("Faqat o'quvchilar test topshirishi mumkin.");
  }

  const passage = await prisma.passage.findUnique({
    where: { id: passageId },
    include: { questions: true },
  });

  if (!passage) {
    throw new Error("Matn topilmadi.");
  }

  const allQuestionsAnswered = passage.questions.every((question) => {
    const answer = answers[question.id];
    if (question.type === QuestionType.OPEN) {
      return typeof answer === "string" && answer.trim().length > 0;
    }
    return typeof answer === "number";
  });

  if (!allQuestionsAnswered) {
    throw new Error("Iltimos, barcha savollarga javob bering.");
  }

  let score = 0;
  const results: GradePassageResult["results"] = [];

  // CLOSED savollarni birinchi bajarib, score ni hisoblaymiz
  for (const question of passage.questions) {
    const answer = answers[question.id];

    if (question.type === QuestionType.CLOSED) {
      const isCorrect =
        typeof answer === "number" &&
        answer === Number(question.correctOptionIndex);

      if (isCorrect) {
        score += 1;
      }

      results.push({
        questionId: question.id,
        isCorrect,
        type: question.type,
      });
      continue;
    }

    // OPEN savollarni ketma-ket baholaymiz (rate limit uchun)
    const studentAnswer = typeof answer === "string" ? answer : "";
    try {
      const evaluation = await evaluateOpenAnswer({
        questionContent: question.content,
        correctAnswer: question.correctAnswer ?? "",
        studentAnswer,
        passageContent: passage.content,
      });

      if (evaluation.isCorrect) {
        score += 1;
      }

      results.push({
        questionId: question.id,
        isCorrect: evaluation.isCorrect,
        feedback: evaluation.feedback,
        type: question.type,
      });
    } catch (error) {
      console.error(`Savol ${question.id} baholashda xato:`, error);
      results.push({
        questionId: question.id,
        isCorrect: false,
        feedback: "Baholashda texnik xato yuz berdi.",
        type: question.type,
      });
    }
  }

  const totalClosed = passage.questions.filter(
    (q) => q.type === QuestionType.CLOSED
  ).length;
  const totalQuestions = passage.questions.length;
  const scorePercentage =
    totalQuestions > 0 ? Math.round((score / totalQuestions) * 100) : 0;

  const resultsByQuestionId = results.reduce<Record<string, (typeof results)[number]>>(
    (acc, item) => {
      acc[item.questionId] = item;
      return acc;
    },
    {}
  );

  try {
    await prisma.$transaction(async (tx) => {
      const lastAttempt = await tx.result.findFirst({
        where: {
          userId: user.id,
          passageId,
        },
        orderBy: { attemptNumber: "desc" },
        select: { attemptNumber: true },
      });

      const attemptNumber = (lastAttempt?.attemptNumber ?? 0) + 1;

      await tx.result.create({
        data: {
          userId: user.id,
          passageId,
          score: scorePercentage,
          isCompleted: true,
          attemptNumber,
          answers: {
            create: passage.questions.map((question) => {
              const rawAnswer = answers[question.id];
              const normalizedAnswer =
                typeof rawAnswer === "number"
                  ? question.options[rawAnswer] ?? rawAnswer.toString()
                  : (rawAnswer ?? "").toString();

              return {
                questionId: question.id,
                userAnswer: normalizedAnswer,
                isCorrect: resultsByQuestionId[question.id]?.isCorrect ?? false,
              };
            }),
          },
        },
      });
    });
  } catch (error) {
    console.error("Natijani bazaga saqlashda xatolik:", error);
    throw new Error(
      "Natijani bazaga saqlashda muammo yuz berdi. Iltimos, keyinroq urinib ko'ring."
    );
  }

  return {
    score,
    totalClosed,
    results,
  };
}
