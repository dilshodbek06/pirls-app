/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Award,
  Clock,
  Download,
  Loader2,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  LogIn,
  Send,
} from "lucide-react";
import { gradePassageAnswers } from "@/actions/quiz";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useUser } from "@/hooks/use-user";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { FullPassage, QuestionEvaluationResult } from "@/types";
import type { Question } from "@/lib/generated/prisma/client";
import toast from "react-hot-toast";

// Define the structure for storing answers
interface AnswerState {
  [questionId: string]: number | string; // Number for CLOSED (index), string for OPEN (text)
}

// Session persistence schema
interface PassageSessionData {
  startedAt: number;
  endTime: number;
  answers: AnswerState;
}

// Grade Mapping for display and styling
const GRADE_MAP = {
  GRADE_3: {
    label: "3-sinf",
    style: "bg-green-100 text-green-700 border-green-300",
  },
  GRADE_4: {
    label: "4-sinf",
    style: "bg-blue-100 text-blue-700 border-blue-300",
  },
};

const QuestionCard = ({
  question,
  qIndex,
  answers,
  showResults,
  handleAnswerChange,
}: {
  question: Question;
  qIndex: number;
  answers: AnswerState;
  showResults: boolean;
  handleAnswerChange: (questionId: string, answer: number | string) => void;
  evaluation?: QuestionEvaluationResult;
}) => {
  const answerValue = answers[question.id];

  const safeOptions: string[] = useMemo(() => {
    const opts: unknown = (question as any).options;
    return Array.isArray(opts) ? (opts as string[]) : [];
  }, [question]);

  const getItemClass = (oIndex: number) => {
    const isSelected = answerValue === oIndex;
    const baseClass =
      "flex items-center space-x-3 p-3.5 rounded-xl transition-all border cursor-pointer select-none";

    if (isSelected) {
      return `${baseClass} border-blue-500 bg-blue-50/90 text-blue-950 shadow-xs font-medium ring-1 ring-blue-400/40`;
    }
    return `${baseClass} hover:bg-gray-50/80 hover:border-gray-300 border-gray-200 text-gray-800`;
  };

  const isAnswered =
    question.type === "CLOSED"
      ? typeof answerValue === "number"
      : typeof answerValue === "string" && answerValue.trim().length > 0;

  return (
    <Card
      key={question.id}
      className={`shadow-xs transition-shadow duration-200 border ${
        isAnswered ? "border-blue-200/80" : "border-gray-200"
      }`}
    >
      <CardHeader className="bg-gray-50/90 border-b border-gray-100 p-4 pb-3 rounded-t-xl">
        <CardTitle className="text-base sm:text-lg flex items-start gap-3">
          <span className="flex items-center justify-center w-7 h-7 rounded-lg bg-blue-100/80 text-blue-700 font-bold text-sm shrink-0 mt-0.5">
            {qIndex + 1}
          </span>
          <span className="flex-1 font-semibold text-gray-900 leading-snug">
            {question.content}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 sm:p-5">
        {/* CLOSED Question Type (RadioGroup) */}
        {question.type === "CLOSED" && (
          <>
            {safeOptions.length === 0 ? (
              <p className="text-sm text-red-600">
                Variantlar topilmadi. Iltimos admin bilan bog&apos;laning.
              </p>
            ) : (
              <RadioGroup
                value={answerValue !== undefined ? String(answerValue) : ""}
                onValueChange={(value) =>
                  handleAnswerChange(question.id, Number.parseInt(value, 10))
                }
                disabled={showResults}
                className="space-y-2.5"
              >
                {safeOptions.map((option, oIndex) => {
                  const id = `${question.id}-${oIndex}`;

                  return (
                    <div
                      key={oIndex}
                      className={getItemClass(oIndex)}
                      onClick={() =>
                        !showResults && handleAnswerChange(question.id, oIndex)
                      }
                    >
                      <RadioGroupItem
                        value={String(oIndex)}
                        id={id}
                        className="h-4 w-4 text-blue-600 border-gray-400 shrink-0"
                      />
                      <Label
                        htmlFor={id}
                        className="flex-1 cursor-pointer text-sm sm:text-base leading-relaxed"
                      >
                        {option}
                      </Label>
                    </div>
                  );
                })}
              </RadioGroup>
            )}
          </>
        )}

        {/* OPEN Question Type (Textarea) */}
        {question.type === "OPEN" && (
          <div className="space-y-2">
            <Textarea
              placeholder="Javobingizni shu yerga batafsil yozing..."
              value={typeof answerValue === "string" ? answerValue : ""}
              onChange={(e) => handleAnswerChange(question.id, e.target.value)}
              disabled={showResults}
              rows={4}
              className="focus-visible:ring-blue-500 rounded-xl resize-y text-base p-3.5"
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
};

// --- Result / Certificate Modal ---
const ResultModal = ({
  isOpen,
  onClose,
  score,
  totalQuestions,
  scorePercentage,
  showCertificate,
  studentName,
  onDownloadCertificate,
  onResetQuiz,
}: {
  isOpen: boolean;
  onClose: () => void;
  score: number;
  totalQuestions: number;
  scorePercentage: number;
  showCertificate: boolean;
  passageTitle: string;
  studentName: string;
  onDownloadCertificate: () => void;
  onResetQuiz: () => void;
}) => {
  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      <DialogContent className="sm:max-w-md md:max-w-lg p-0 overflow-y-auto max-h-[90vh] rounded-2xl">
        <DialogHeader className="p-6 pb-2 text-center">
          <div className="mx-auto mb-2 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-100 text-blue-600">
            <Award className="h-7 w-7" />
          </div>
          <DialogTitle className="text-2xl sm:text-3xl font-extrabold text-gray-900 text-center">
            Test yakunlandi
          </DialogTitle>
        </DialogHeader>

        <div className="px-6 py-2 space-y-4">
          <Card className="bg-linear-to-br from-blue-50/80 via-indigo-50/50 to-emerald-50/80 border-2 border-blue-200 shadow-xs">
            <CardContent className="p-6 text-center space-y-3">
              <p className="text-lg font-semibold text-gray-700">
                {studentName}
              </p>

              <div className="text-5xl font-black text-blue-600 tracking-tight">
                {scorePercentage.toFixed(0)}%
              </div>

              <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/80 border border-blue-200 text-sm font-bold text-gray-800 shadow-2xs">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                {score} / {totalQuestions} to&apos;g&apos;ri javob
              </div>

              {showCertificate && (
                <div className="pt-2">
                  <Button
                    onClick={onDownloadCertificate}
                    className="w-full bg-linear-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-semibold transition-all shadow-md gap-2"
                    size="lg"
                  >
                    <Download className="h-5 w-5" />
                    Sertifikatni yuklab olish
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <DialogFooter className="p-6 pt-2 flex flex-col sm:flex-row gap-3">
          <Button
            onClick={() => {
              onClose();
              onResetQuiz();
            }}
            variant="outline"
            size="lg"
            className="flex-1 hover:bg-gray-100 border-gray-200 gap-2 font-medium"
          >
            <RotateCcw className="w-4 h-4" />
            Qayta topshirish
          </Button>
          <Link href="/passages" className="flex-1">
            <Button
              variant="default"
              size="lg"
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-medium shadow-sm"
              onClick={onClose}
            >
              Barcha matnlar
            </Button>
          </Link>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

// --- Time Out Modal ---
const TimeOutModal = ({
  isOpen,
  onClose,
  onRetry,
  onSubmitCurrent,
  hasAnswers,
  answeredCount,
  totalQuestions,
  isSubmitting,
}: {
  isOpen: boolean;
  onClose: () => void;
  onRetry: () => void;
  onSubmitCurrent: () => void;
  hasAnswers: boolean;
  answeredCount: number;
  totalQuestions: number;
  isSubmitting: boolean;
}) => (
  <Dialog
    open={isOpen}
    onOpenChange={(open) => {
      if (!open) onClose();
    }}
  >
    <DialogContent className="sm:max-w-md p-0 overflow-hidden rounded-2xl shadow-2xl border-amber-200">
      <div className="bg-amber-500/10 border-b border-amber-200/60 px-6 py-5 text-center">
        <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-500/20 text-amber-600 text-2xl">
          <AlertTriangle className="w-7 h-7" />
        </div>
        <DialogTitle className="text-2xl sm:text-3xl font-extrabold text-amber-950">
          Vaqtingiz yakunlandi
        </DialogTitle>
        <p className="mt-1 text-sm text-amber-800">
          Ajratilgan 40 daqiqa vaqt tugadi.
        </p>
      </div>

      <div className="p-6 text-center space-y-4">
        <p className="text-gray-600 text-sm">
          Siz {totalQuestions} ta savoldan{" "}
          <strong className="text-gray-900 font-bold">
            {answeredCount} tasiga
          </strong>{" "}
          javob berdingiz.
        </p>

        <div className="flex flex-col gap-2.5 pt-2">
          {hasAnswers && (
            <Button
              onClick={onSubmitCurrent}
              disabled={isSubmitting}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold gap-2 h-11"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Tekshirilmoqda...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  Mavjud javoblarni yuborish ({answeredCount}/{totalQuestions})
                </>
              )}
            </Button>
          )}

          <Button
            onClick={() => {
              onRetry();
              onClose();
            }}
            variant={hasAnswers ? "outline" : "default"}
            className="w-full gap-2 h-11 font-medium"
          >
            <RotateCcw className="w-4 h-4" />
            Qaytadan boshlash
          </Button>

          <Link href="/passages" className="w-full">
            <Button
              variant="ghost"
              className="w-full text-gray-500 hover:text-gray-900"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Matnlar ro&apos;yxatiga qaytish
            </Button>
          </Link>
        </div>
      </div>
    </DialogContent>
  </Dialog>
);

type PassageDetailClientProps = {
  passage: FullPassage;
};

const TOTAL_TIME = 40 * 60; // 40 minutes in seconds

const PassageDetailClient = ({ passage }: PassageDetailClientProps) => {
  const STORAGE_KEY = `pirls_passage_session_${passage.id}`;
  const router = useRouter();
  const { user, isLoggedIn, isLoading } = useUser();

  const [answers, setAnswers] = useState<AnswerState>({});
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);
  const [questionResults, setQuestionResults] = useState<
    Record<string, QuestionEvaluationResult>
  >({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [timeLeft, setTimeLeft] = useState(TOTAL_TIME);
  const [endTime, setEndTime] = useState<number | null>(null);
  const [isTimeOutModalOpen, setIsTimeOutModalOpen] = useState(false);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const totalQuestions = passage.questions.length;
  const answeredCount = useMemo(() => {
    return Object.keys(answers).filter((qId) => {
      const val = answers[qId];
      if (typeof val === "number") return true;
      if (typeof val === "string" && val.trim().length > 0) return true;
      return false;
    }).length;
  }, [answers]);

  const scorePercentage =
    totalQuestions > 0 ? (score / totalQuestions) * 100 : 0;
  const showCertificate = scorePercentage >= 90;

  const studentName =
    user?.fullName || user?.email || "Foydalanuvchi nomi kiritilmagan";

  // --- Session Storage Management ---
  const clearSessionStorage = useCallback(() => {
    if (typeof window === "undefined") return;
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (e) {
      console.error("Storage clear error:", e);
    }
  }, [STORAGE_KEY]);

  const saveSessionStorage = useCallback(
    (currentEndTime: number, currentAnswers: AnswerState) => {
      if (typeof window === "undefined" || showResults) return;
      try {
        const sessionData: PassageSessionData = {
          startedAt: Date.now(),
          endTime: currentEndTime,
          answers: currentAnswers,
        };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(sessionData));
      } catch (e) {
        console.error("Storage save error:", e);
      }
    },
    [STORAGE_KEY, showResults],
  );

  // --- Mount & Session Restore ---
  useEffect(() => {
    if (typeof window === "undefined") return;

    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (!saved) {
        // Initialize fresh timer
        const targetEndTime = Date.now() + TOTAL_TIME * 1000;
        setEndTime(targetEndTime);
        setTimeLeft(TOTAL_TIME);
        setIsTimerRunning(true);
        saveSessionStorage(targetEndTime, {});
        return;
      }

      const parsed: PassageSessionData = JSON.parse(saved);
      const now = Date.now();

      // If session is older than 4 hours, treat it as expired and start clean
      if (!parsed.endTime || now - parsed.startedAt > 4 * 60 * 60 * 1000) {
        clearSessionStorage();
        const targetEndTime = now + TOTAL_TIME * 1000;
        setEndTime(targetEndTime);
        setTimeLeft(TOTAL_TIME);
        setIsTimerRunning(true);
        saveSessionStorage(targetEndTime, {});
        return;
      }

      // Restore saved answers
      if (parsed.answers && typeof parsed.answers === "object") {
        setAnswers(parsed.answers);
      }

      // Calculate exact remaining time from endTime
      const remainingSeconds = Math.max(
        0,
        Math.ceil((parsed.endTime - now) / 1000),
      );

      setEndTime(parsed.endTime);
      setTimeLeft(remainingSeconds);

      if (remainingSeconds === 0) {
        setIsTimerRunning(false);
        setIsTimeOutModalOpen(true);
      } else {
        setIsTimerRunning(true);
      }
    } catch {
      clearSessionStorage();
      const targetEndTime = Date.now() + TOTAL_TIME * 1000;
      setEndTime(targetEndTime);
      setTimeLeft(TOTAL_TIME);
      setIsTimerRunning(true);
    }
  }, [STORAGE_KEY, clearSessionStorage, saveSessionStorage]);

  // --- High-Precision Monotonic Timer with Background Tab Sync ---
  useEffect(() => {
    if (!isTimerRunning || !endTime || showResults) return;

    const syncTime = () => {
      const remaining = Math.max(0, Math.ceil((endTime - Date.now()) / 1000));
      setTimeLeft(remaining);

      if (remaining === 0) {
        setIsTimerRunning(false);
        setIsTimeOutModalOpen(true);
      }
    };

    // Initial sync
    syncTime();

    // 1-second interval
    const interval = setInterval(syncTime, 1000);

    // Sync immediately on tab focus or visibility change
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        syncTime();
      }
    };

    window.addEventListener("focus", syncTime);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      clearInterval(interval);
      window.removeEventListener("focus", syncTime);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [isTimerRunning, endTime, showResults]);

  // Handle answer change & auto-save to storage
  const handleAnswerChange = (questionId: string, answer: number | string) => {
    if (showResults) return;

    setAnswers((prev) => {
      const nextAnswers = {
        ...prev,
        [questionId]: answer,
      };

      if (endTime) {
        saveSessionStorage(endTime, nextAnswers);
      }

      return nextAnswers;
    });
  };

  // --- Quiz Submission ---
  const gradeQuiz = useCallback(
    async (allowPartial = false) => {
      if (isLoading) {
        toast.error("Foydalanuvchi ma'lumotlari yuklanmoqda, biroz kuting.");
        return;
      }

      if (!isLoggedIn || !user) {
        toast.error("Iltimos test topshirish uchun ro'yhatdan o'ting.");
        router.push("/auth/login");
        return;
      }

      if (user.role !== "USER") {
        toast.error(
          "Faqat ro'yhatdan o'tgan o'quvchilar test topshirishi mumkin!",
        );
        return;
      }

      // Check unanswered questions if not submitting partially upon timeout
      if (!allowPartial) {
        const hasUnanswered = passage.questions.some((question) => {
          const value = answers[question.id];
          if (question.type === "OPEN") {
            return typeof value !== "string" || value.trim().length === 0;
          }
          return typeof value !== "number";
        });

        if (hasUnanswered) {
          toast.error("Iltimos, barcha savollarga javob bering.");
          return;
        }
      }

      setIsTimerRunning(false);

      try {
        setIsSubmitting(true);

        const result = await gradePassageAnswers({
          passageId: passage.id,
          answers,
        });

        const mappedResults = result.results.reduce(
          (acc, item) => {
            acc[item.questionId] = item;
            return acc;
          },
          {} as Record<string, QuestionEvaluationResult>,
        );

        setQuestionResults(mappedResults);
        setScore(result.score);
        setShowResults(true);
        setIsModalOpen(true);
        setIsTimeOutModalOpen(false);
        clearSessionStorage();
      } catch (error) {
        const message =
          error instanceof Error
            ? error.message
            : "Javoblarni tekshirishda xatolik yuz berdi.";
        toast.error(message);
      } finally {
        setIsSubmitting(false);
      }
    },
    [
      answers,
      isLoggedIn,
      isLoading,
      passage.id,
      passage.questions,
      router,
      user,
      clearSessionStorage,
    ],
  );

  const handleSubmit = () => {
    if (isSubmitting) return;
    void gradeQuiz(false);
  };

  const resetQuiz = () => {
    clearSessionStorage();
    setAnswers({});
    setShowResults(false);
    setScore(0);
    setQuestionResults({});
    setIsSubmitting(false);
    setIsModalOpen(false);
    setIsTimeOutModalOpen(false);

    const targetEndTime = Date.now() + TOTAL_TIME * 1000;
    setEndTime(targetEndTime);
    setTimeLeft(TOTAL_TIME);
    setIsTimerRunning(true);
    saveSessionStorage(targetEndTime, {});
  };

  const handleDownloadCertificate = useCallback(() => {
    const passageTitle = passage.title;
    const safeTitle = passageTitle
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .trim()
      .replace(/\s+/g, "-");

    const canvas = document.createElement("canvas");
    canvas.width = 800;
    canvas.height = 600;
    const ctx = canvas.getContext("2d");

    if (ctx) {
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, 800, 600);

      ctx.strokeStyle = "#4F46E5";
      ctx.lineWidth = 10;
      ctx.strokeRect(20, 20, 760, 560);

      ctx.strokeStyle = "#A5B4FC";
      ctx.lineWidth = 2;
      ctx.strokeRect(40, 40, 720, 520);

      ctx.fillStyle = "#4338CA";
      ctx.font = "bold 44px Arial";
      ctx.textAlign = "center";
      ctx.fillText("Muvaffaqiyat sertifikati", 400, 120);

      ctx.fillStyle = "#4B5563";
      ctx.font = "22px Arial";
      ctx.fillText("Ushbu sertifikat topshirildi", 400, 180);

      ctx.fillStyle = "#1E1B4B";
      ctx.font = "bold 38px Arial";
      ctx.fillText(studentName, 400, 250);

      ctx.fillStyle = "#4B5563";
      ctx.font = "20px Arial";
      ctx.fillText("matnni muvaffaqiyatli o'qib tugatganligi uchun", 400, 310);

      ctx.fillStyle = "#4338CA";
      ctx.font = "bold 26px Arial";
      ctx.fillText(`"${passageTitle}"`, 400, 360);

      ctx.fillStyle = "#6B7280";
      ctx.font = "18px Arial";
      const date = new Date().toLocaleDateString("uz-UZ", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
      ctx.fillText(`Sana: ${date}`, 400, 440);

      ctx.fillStyle = "#4338CA";
      ctx.font = "bold 28px Arial";
      ctx.fillText("PIRLS EDU", 400, 520);
    }

    canvas.toBlob((blob) => {
      if (blob) {
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `sertifikat-${safeTitle || "matn"}.png`;
        link.click();
        setTimeout(() => URL.revokeObjectURL(url), 1000);
      }
    }, "image/png");
  }, [passage.title, studentName]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
      .toString()
      .padStart(2, "0");
    const secs = (seconds % 60).toString().padStart(2, "0");
    return `${mins}:${secs}`;
  };

  const timeProgress = Math.max(0, (timeLeft / TOTAL_TIME) * 100);
  const isTimeLow = timeLeft <= 5 * 60;
  const isTimeCritical = timeLeft <= 2 * 60 && timeLeft > 0;
  const passageGrade = GRADE_MAP[passage.grade as keyof typeof GRADE_MAP];

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <div className="bg-linear-to-r px-4 from-cyan-500 to-green-500 shadow-sm">
        <Header />
      </div>

      {/* Floating Modern Bottom-Fixed Timer HUD (Rendered into document.body via Portal) */}
      {isMounted &&
        !showResults &&
        createPortal(
          <aside
            role="region"
            aria-label="Test taymeri"
            className="fixed bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 z-[9999] pointer-events-auto select-none"
          >
            <div
              className={`flex items-center gap-3 sm:gap-4 px-4 sm:px-5 py-2 sm:py-2.5 rounded-full backdrop-blur-xl shadow-[0_8px_30px_rgba(0,0,0,0.12)] border transition-all duration-300 ${
                isTimeCritical
                  ? "bg-rose-50/95 border-rose-400 text-rose-900 shadow-rose-500/25 ring-2 ring-rose-500/50"
                  : isTimeLow
                    ? "bg-amber-50/95 border-amber-300 text-amber-950 shadow-amber-500/20 ring-1 ring-amber-400/40"
                    : "bg-white/95 border-slate-200/90 text-slate-800"
              }`}
            >
              {/* Time display */}
              <div className="flex items-center gap-2 sm:gap-2.5">
                <div
                  className={`p-1.5 rounded-full ${
                    isTimeCritical
                      ? "bg-rose-200/80 text-rose-700"
                      : isTimeLow
                        ? "bg-amber-200/80 text-amber-700"
                        : "bg-blue-100 text-blue-700"
                  }`}
                >
                  <Clock className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] sm:text-xs font-semibold text-slate-500 uppercase tracking-wider leading-none">
                    Qolgan vaqt
                  </span>
                  <span className="font-mono text-base sm:text-xl font-black tracking-tight tabular-nums leading-tight">
                    {formatTime(timeLeft)}
                  </span>
                </div>
              </div>

              {/* Vertical divider */}
              <div className="h-6 w-px bg-slate-200" />

              {/* Answer count pill */}
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100/90 text-slate-700 font-semibold text-xs sm:text-sm">
                <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />
                <span>
                  {answeredCount} / {totalQuestions}
                </span>
              </div>
            </div>
          </aside>,
          document.body,
        )}

      <main className="flex-1 py-6 sm:py-10 pb-32 sm:pb-36 px-4">
        <div className="container mx-auto max-w-4xl space-y-6">
          <Link href="/passages">
            <Button
              variant="outline"
              className="hover:bg-white text-gray-700 bg-white/80 border-gray-200 shadow-2xs gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Matnlar ro&apos;yxatiga qaytish
            </Button>
          </Link>

          {/* Guest notification notice */}
          {!isLoading && !isLoggedIn && (
            <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-2xs animate-fade-in">
              <div className="flex items-center gap-2.5 text-sm font-medium">
                <LogIn className="w-5 h-5 text-amber-600 shrink-0" />
                <span>
                  Test natijalaringiz saqlanishi uchun o&apos;quvchi sifatida
                  tizimga kiring.
                </span>
              </div>
              <Link href="/auth/login">
                <Button
                  size="sm"
                  className="bg-amber-600 hover:bg-amber-700 text-white font-semibold shrink-0"
                >
                  Kirish
                </Button>
              </Link>
            </div>
          )}

          {/* Main Passage & Test Card */}
          <Card className="p-5 sm:p-8 md:p-10 shadow-sm border border-slate-200/80 bg-white rounded-3xl animate-fade-in">
            {/* Passage Header */}
            <header className="flex items-start justify-between gap-4 pb-6 border-b border-gray-100 mb-6">
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-gray-900 leading-tight">
                {passage.title}
              </h1>

              {passageGrade && (
                <Badge
                  variant="outline"
                  className={`border text-xs sm:text-sm px-3 py-1 font-bold whitespace-nowrap rounded-xl shrink-0 ${passageGrade.style}`}
                >
                  {passageGrade.label}
                </Badge>
              )}
            </header>

            {/* Passage Text & Banner */}
            <article className="mb-10">
              {passage.imageUrl && (
                <div className="relative w-full sm:w-72 md:w-80 aspect-[3/4] sm:float-left mr-6 mb-6 rounded-2xl overflow-hidden shadow-md border border-slate-200/80 bg-slate-100">
                  <Image
                    src={passage.imageUrl}
                    alt={`${passage.title} banner`}
                    fill
                    sizes="(max-width: 640px) 100vw, 320px"
                    className="object-cover"
                    priority
                    quality={90}
                  />
                </div>
              )}
              <div className="text-base sm:text-lg leading-relaxed text-gray-800">
                {(() => {
                  if (!passage.content) return null;
                  const rawLines = passage.content.split("\n");
                  const paragraphs: string[] = [];
                  let currentPara = "";

                  for (const rawLine of rawLines) {
                    const line = rawLine.trim();
                    if (!line) {
                      if (currentPara) {
                        paragraphs.push(currentPara);
                        currentPara = "";
                      }
                      continue;
                    }

                    if (
                      line.startsWith("-") ||
                      line.startsWith("–") ||
                      line.startsWith("—")
                    ) {
                      if (currentPara) {
                        paragraphs.push(currentPara);
                        currentPara = "";
                      }
                      paragraphs.push(line);
                    } else {
                      if (currentPara) {
                        currentPara += " " + line;
                      } else {
                        currentPara = line;
                      }
                    }
                  }

                  if (currentPara) {
                    paragraphs.push(currentPara);
                  }

                  return (
                    <div className="space-y-4">
                      {paragraphs.map((para, idx) => (
                        <p
                          key={idx}
                          className={`text-base sm:text-lg leading-relaxed ${
                            para.startsWith("-") ||
                            para.startsWith("–") ||
                            para.startsWith("—")
                              ? "pl-4 italic text-gray-700 border-l-2 border-slate-300 my-2"
                              : "text-justify"
                          }`}
                        >
                          {para}
                        </p>
                      ))}
                    </div>
                  );
                })()}
              </div>

              <div className="clear-both" />
            </article>

            {/* Questions Section Header */}
            <div className="pt-8 border-t border-gray-100 mb-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
                  Matn bo‘yicha savollar
                </h2>
                <span className="text-sm font-semibold text-blue-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-200/60 w-fit">
                  {answeredCount} / {totalQuestions} ta javob belgilandi
                </span>
              </div>
              <p className="text-sm text-gray-500">
                Savollarga diqqat bilan javob bering. Javoblaringiz sahifa
                yangilansa ham avtomatik saqlanib qoladi.
              </p>
            </div>

            {/* Question Cards */}
            <section aria-label="Savollar ro'yxati" className="space-y-6">
              {passage.questions.map((question, qIndex) => (
                <QuestionCard
                  key={question.id}
                  question={question}
                  qIndex={qIndex}
                  answers={answers}
                  showResults={showResults}
                  handleAnswerChange={handleAnswerChange}
                  evaluation={questionResults[question.id]}
                />
              ))}
            </section>

            {/* Submission Section */}
            <div className="mt-10 pt-6 border-t border-gray-100 space-y-3">
              {showResults ? (
                <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-center space-y-3">
                  <p className="font-bold text-emerald-800">
                    Test yakunlangan! Natijangiz: {scorePercentage.toFixed(0)}%
                  </p>
                  <Button
                    onClick={() => setIsModalOpen(true)}
                    variant="outline"
                    className="border-emerald-300 text-emerald-700 hover:bg-emerald-100 font-semibold"
                  >
                    Natijani qayta ko&apos;rish
                  </Button>
                </div>
              ) : (
                <Button
                  onClick={handleSubmit}
                  variant="default"
                  size="lg"
                  disabled={isSubmitting}
                  className="w-full h-12 text-base font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-md rounded-xl transition-transform hover:scale-[1.005] disabled:opacity-70 gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" />
                      Javoblar tekshirilmoqda...
                    </>
                  ) : (
                    <>
                      <Send className="h-5 w-5" />
                      Javoblarni yuborish ({answeredCount}/{totalQuestions})
                    </>
                  )}
                </Button>
              )}
            </div>
          </Card>
        </div>
      </main>

      <Footer />

      {isModalOpen && (
        <ResultModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          score={score}
          totalQuestions={totalQuestions}
          scorePercentage={scorePercentage}
          showCertificate={showCertificate}
          passageTitle={passage.title}
          studentName={studentName}
          onDownloadCertificate={handleDownloadCertificate}
          onResetQuiz={resetQuiz}
        />
      )}

      <TimeOutModal
        isOpen={isTimeOutModalOpen}
        onClose={() => setIsTimeOutModalOpen(false)}
        onRetry={resetQuiz}
        onSubmitCurrent={() => void gradeQuiz(true)}
        hasAnswers={answeredCount > 0}
        answeredCount={answeredCount}
        totalQuestions={totalQuestions}
        isSubmitting={isSubmitting}
      />
    </div>
  );
};

export default PassageDetailClient;
