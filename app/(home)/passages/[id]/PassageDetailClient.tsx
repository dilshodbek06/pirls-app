"use client";

import { useCallback, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ArrowLeft, Award, CheckCircle, Download, XCircle } from "lucide-react";
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
import type { FullPassage } from "@/types";
import type { Question } from "@/lib/generated/prisma/client";
import toast from "react-hot-toast";

// Define the structure for storing answers
interface AnswerState {
  [questionId: string]: number | string; // Number for CLOSED (index), string for OPEN (text)
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
}) => {
  const answerValue = answers[question.id];

  // Helper to determine the item class
  const getItemClass = (oIndex: number) => {
    const isSelected = answerValue === oIndex;
    const isCorrect = question.correctOptionIndex === oIndex;
    const baseClass =
      "flex items-center space-x-3 p-3 rounded-lg transition-colors border";

    if (showResults) {
      if (isCorrect) return `${baseClass} bg-green-100/50 border-green-500`;
      if (isSelected && !isCorrect)
        return `${baseClass} bg-red-100/50 border-red-500`;
      return `${baseClass} border-gray-200`; // Unselected wrong options
    } else {
      if (isSelected) return `${baseClass} border-blue-400 bg-blue-50`;
      return `${baseClass} hover:bg-gray-50 cursor-pointer border-gray-200`;
    }
  };

  return (
    <Card key={question.id} className="mt-4 shadow-md">
      <CardHeader className="bg-gray-50 border-b p-4">
        <CardTitle className="text-lg flex items-start gap-2 ">
          <span className="font-extrabold text-xl shrink-0">{qIndex + 1}.</span>
          <span className="flex-1">{question.content}</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        {/* CLOSED Question Type (RadioGroup) */}
        {question.type === "CLOSED" && (
          <RadioGroup
            value={answerValue !== undefined ? answerValue.toString() : ""}
            onValueChange={(value) =>
              handleAnswerChange(question.id, parseInt(value))
            }
            disabled={showResults}
            className="space-y-1"
          >
            {question.options.map((option, oIndex) => {
              const id = `${question.id}-${oIndex}`;
              const isSelected = answerValue === oIndex;
              const isCorrect = question.correctOptionIndex === oIndex;

              return (
                <div
                  key={oIndex}
                  className={getItemClass(oIndex)}
                  onClick={() =>
                    !showResults && handleAnswerChange(question.id, oIndex)
                  }
                >
                  <RadioGroupItem
                    value={oIndex.toString()}
                    id={id}
                    className="h-4 w-4 sr-only"
                  />
                  <Label
                    htmlFor={id}
                    className="flex-1 cursor-pointer text-base select-none"
                  >
                    {option}
                  </Label>
                  {showResults && (
                    <>
                      {isCorrect && (
                        <CheckCircle className="h-5 w-5 text-green-600 shrink-0" />
                      )}
                      {isSelected && !isCorrect && (
                        <XCircle className="h-5 w-5 text-red-600 shrink-0" />
                      )}
                    </>
                  )}
                </div>
              );
            })}
          </RadioGroup>
        )}

        {/* OPEN Question Type (Textarea) */}
        {question.type === "OPEN" && (
          <Textarea
            placeholder="Javobingizni shu yerga yozing..."
            value={(answerValue as string) || ""}
            onChange={(e) => handleAnswerChange(question.id, e.target.value)}
            disabled={showResults}
            rows={4}
            className="focus-visible:ring-blue-500"
          />
        )}
      </CardContent>
    </Card>
  );
};

// --- NEW Helper Component: Combined Result/Certificate Modal ---
const ResultModal = ({
  isOpen,
  onClose,
  score,
  totalClosedQuestions,
  scorePercentage,
  showCertificate,
  studentName,
  onDownloadCertificate,
  onResetQuiz,
}: {
  isOpen: boolean;
  onClose: () => void;
  score: number;
  totalClosedQuestions: number;
  scorePercentage: number;
  showCertificate: boolean;
  passageTitle: string;
  studentName: string;
  onDownloadCertificate: () => void;
  onResetQuiz: () => void;
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] md:max-w-lg lg:max-w-xl p-0 overflow-y-auto max-h-screen">
        <DialogHeader className="p-6 pb-0">
          <DialogTitle className="text-3xl font-extrabold text-center text-gray-800 flex items-center justify-center gap-2">
            <Award className="h-6 w-6 text-blue-600" />
            Natija
          </DialogTitle>
        </DialogHeader>

        <div className="p-6 pt-2 space-y-6">
          {/* --- Result Section --- */}
          <Card className="bg-linear-to-r from-blue-50 to-green-50 border-2 border-blue-400">
            <CardContent className=" text-center">
              <div className="flex items-center justify-center text-3xl font-extrabold text-purple-700">
                {studentName}!
              </div>

              <p className="text-5xl mt-2 font-extrabold text-blue-600 mb-4">
                {scorePercentage.toFixed(0)}%
              </p>
              <p className="text-xl font-bold text-gray-700 mb-4">
                {score} / {totalClosedQuestions} to&apos;g&apos;ri javob
              </p>
              {showCertificate && (
                <Button
                  onClick={onDownloadCertificate}
                  className="w-full bg-purple-600 hover:bg-purple-700 transition-colors cursor-pointer shadow-md"
                  size="lg"
                >
                  <Download className="mr-2 h-5 w-5" />
                  Sertifikatni yuklab olish
                </Button>
              )}
            </CardContent>
          </Card>
        </div>

        <DialogFooter className="p-6 pt-0 flex flex-col sm:flex-row gap-4">
          <Button
            onClick={() => {
              onClose(); // Close modal
              onResetQuiz(); // Reset quiz data
            }}
            variant="outline"
            size="lg"
            className="flex-1 hover:text-black hover:bg-gray-50 border-gray-200 cursor-pointer"
          >
            Yana sinab ko&apos;rish
          </Button>
          <Link href="/passages" className="flex-1">
            <Button
              variant="default"
              size="lg"
              className="w-full cursor-pointer bg-green-600 hover:bg-green-700 shadow-md"
              onClick={onClose} // Close modal when navigating
            >
              Ko&apos;proq matnlar
            </Button>
          </Link>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

type PassageDetailClientProps = {
  passage: FullPassage;
};

const PassageDetailClient = ({ passage }: PassageDetailClientProps) => {
  const router = useRouter();
  const { user, isLoggedIn, isLoading } = useUser();
  const [answers, setAnswers] = useState<AnswerState>({});
  const [showResults, setShowResults] = useState(false); // Still used for question card display
  const [score, setScore] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false); // NEW STATE for Modal

  const closedQuestions = passage.questions.filter((q) => q.type === "CLOSED");
  const totalClosedQuestions = closedQuestions.length;
  const scorePercentage =
    totalClosedQuestions > 0 ? (score / totalClosedQuestions) * 100 : 0;
  const showCertificate = scorePercentage >= 80;
  const studentName =
    user?.fullName || user?.email || "Foydalanuvchi nomi kiritilmagan";

  // Handle both CLOSED (number index) and OPEN (string text) answers
  const handleAnswerChange = (questionId: string, answer: number | string) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: answer,
    }));
  };

  const handleSubmit = () => {
    if (isLoading) {
      alert("Foydalanuvchi ma'lumotlari yuklanmoqda, biroz kuting.");
      return;
    }

    if (!isLoggedIn || !user) {
      toast.error("Iltimos test topshirish uchun ro'yhatdan o'ting.");
      router.push("/auth/login");
      return;
    }

    if (user.role !== "USER") {
      toast.error(
        "Faqat ro'yhatdan o'tgan o'quvchilar test topshirishi mumkin!"
      );
      return;
    }

    const answeredClosedQuestionsCount = closedQuestions.filter(
      (q) => answers[q.id] !== undefined
    ).length;

    // Check if all CLOSED questions are answered
    if (answeredClosedQuestionsCount < totalClosedQuestions) {
      toast.error("Iltimos, barcha savollarga javob bering.");
      return;
    }

    let correctCount = 0;
    closedQuestions.forEach((question) => {
      if (answers[question.id] === question.correctOptionIndex) {
        correctCount++;
      }
    });

    setScore(correctCount);
    setShowResults(true); // Update for QuestionCard styling
    setIsModalOpen(true); // OPEN THE RESULT MODAL
  };

  const resetQuiz = () => {
    setAnswers({});
    setShowResults(false);
    setScore(0);
  };

  const handleDownloadCertificate = useCallback(() => {
    const passageTitle = passage.title;

    const canvas = document.createElement("canvas");
    canvas.width = 800;
    canvas.height = 600;
    const ctx = canvas.getContext("2d");

    if (ctx) {
      // Background
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, 800, 600);

      // Border (Deep Purple)
      ctx.strokeStyle = "#6D28D9"; // Tailwind: violet-700
      ctx.lineWidth = 10;
      ctx.strokeRect(20, 20, 760, 560);

      // Inner border (Light Purple)
      ctx.strokeStyle = "#A78BFA"; // Tailwind: violet-400
      ctx.lineWidth = 2;
      ctx.strokeRect(40, 40, 720, 520);

      // Title
      ctx.fillStyle = "#6D28D9";
      ctx.font = "bold 48px Arial";
      ctx.textAlign = "center";
      ctx.fillText("Muvaffaqiyat sertifikati", 400, 120);

      // Subtitle
      ctx.fillStyle = "#4B5563"; // Tailwind: gray-600
      ctx.font = "24px Arial";
      ctx.fillText("Ushbu sertifikat topshirildi", 400, 180);

      // Student name - Dynamic value
      ctx.fillStyle = "#1F2937"; // Tailwind: gray-800
      ctx.font = "bold 40px Arial";
      ctx.fillText(studentName, 400, 250); // FIX: Using dynamic studentName

      // Achievement text
      ctx.fillStyle = "#4B5563";
      ctx.font = "20px Arial";
      ctx.fillText("matnni muvaffaqiyatli o'qib tugatganligi uchun", 400, 310);

      // Passage title
      ctx.fillStyle = "#6D28D9";
      ctx.font = "bold 28px Arial";
      ctx.fillText(`"${passageTitle}"`, 400, 360);

      // Date
      ctx.fillStyle = "#4B5563";
      ctx.font = "18px Arial";
      const date = new Date().toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
      ctx.fillText(`Sana: ${date}`, 400, 440);

      // Footer
      ctx.fillStyle = "#6D28D9";
      ctx.font = "bold 28px Arial";
      ctx.fillText("PIRLS EDU", 400, 520);
    }

    canvas.toBlob((blob) => {
      if (blob) {
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `sertifikat-${passageTitle
          .toLowerCase()
          .replace(/\s+/g, "-")}.png`;
        link.click();
        URL.revokeObjectURL(url);
      }
    }, "image/png");
  }, [passage, studentName]);

  const passageGrade = GRADE_MAP[passage.grade as keyof typeof GRADE_MAP];

  return (
    <div className="min-h-screen flex flex-col">
      <div className="bg-linear-to-r px-4 from-cyan-500 to-green-500">
        <Header />
      </div>

      <main className="flex-1 py-12 px-4 bg-gray-50">
        <div className="container mx-auto max-w-4xl">
          <Link href="/passages">
            <Button
              variant="outline"
              className="mb-6 text-gray-700 hover:bg-green-600"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Matnlar ro&apos;yxatiga qaytish
            </Button>
          </Link>

          {/* Combined Passage and Tests Section */}
          <Card className="p-6 md:p-10 shadow-md animate-fade-in  ">
            {/* --- Passage Header --- */}
            <div className="flex items-start justify-between gap-3 mb-6 border-b pb-4">
              <h1 className="text-3xl md:text-4xl font-extrabold text-gray-800 leading-tight">
                {passage.title}
              </h1>
              {passageGrade && (
                <Badge
                  variant="outline"
                  className={`border text-sm p-2 whitespace-nowrap font-semibold ${passageGrade.style}`}
                >
                  {passageGrade.label}
                </Badge>
              )}
            </div>

            {/* --- Image --- */}
            <div className="relative h-52 sm:h-64 w-full mb-6 rounded-xl overflow-hidden shadow-lg">
              <Image
                src={passage.imageUrl ?? "/images/passage-banner-default.jpg"}
                alt={`${passage.title} banner`}
                fill
                sizes="(max-width: 1024px) 100vw, 1024px"
                className="object-cover"
                priority
              />
            </div>

            {/* --- Passage Content (The 'Story') --- */}
            <div className="prose prose-lg max-w-none text-gray-700 border-b pb-8 mb-1">
              <p className="text-foreground leading-relaxed whitespace-pre-wrap text-lg">
                {passage.content}
              </p>
            </div>

            {/* --- Questions/Tests --- */}
            <h2 className="text-2xl text-center font-bold text-gray-800">
              Matn bo‘yicha testlar
            </h2>

            <div className="space-y-6">
              {passage.questions.map((question, qIndex) => (
                <QuestionCard
                  key={question.id}
                  question={question}
                  qIndex={qIndex}
                  answers={answers}
                  showResults={showResults}
                  handleAnswerChange={handleAnswerChange}
                />
              ))}
            </div>

            {/* --- Submission Section --- */}
            <div className="mt-10 pt-6 border-t space-y-4">
              <Button
                onClick={handleSubmit}
                variant="default"
                size="lg"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white shadow-xl transition-transform hover:scale-[1.01]"
              >
                Javoblarni yuborish
              </Button>
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
          totalClosedQuestions={totalClosedQuestions}
          scorePercentage={scorePercentage}
          showCertificate={showCertificate}
          passageTitle={passage.title}
          studentName={studentName}
          onDownloadCertificate={handleDownloadCertificate}
          onResetQuiz={resetQuiz}
        />
      )}
    </div>
  );
};

export default PassageDetailClient;
