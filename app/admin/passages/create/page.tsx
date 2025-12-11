"use client";

import React, { useRef, useState, useCallback } from "react";
import { createPassage } from "@/actions/passage";
import { useRouter } from "next/navigation";
import {
  X,
  CheckCircle,
  MessageSquare,
  ListOrdered,
  BookOpen,
  Eye,
  Pencil,
  Save,
  Upload,
  ClipboardCheck,
  GraduationCap,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { Grade } from "@/lib/generated/prisma/enums";
import type {
  ClosedQuestion,
  OpenQuestion,
  PassageData,
  Question,
} from "@/types";
import toast from "react-hot-toast";

// Utility to generate a simple unique ID
const generateId = () =>
  Date.now().toString(36) + Math.random().toString(36).substring(2, 9);

// --- Global UI Components (replacing external libraries) ---

interface SimpleModalProps {
  message: string;
  onClose: () => void;
  icon: React.ReactNode;
}

function SimpleModal({ message, onClose, icon }: SimpleModalProps) {
  if (!message) return null;
  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-70 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl p-6 w-full max-w-sm shadow-2xl transform transition-all duration-300 scale-100">
        <div className="flex flex-col items-center text-center">
          <div className="mb-4 text-blue-600">{icon}</div>
          <h4 className="text-xl font-bold text-gray-900 mb-4">{message}</h4>
          <button
            onClick={onClose}
            className="w-full px-4 py-2 text-sm font-medium rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition"
          >
            Tushunarli
          </button>
        </div>
      </div>
    </div>
  );
}

/**
 * Matn (Passage) va Savollar yaratish uchun asosiy komponent.
 */
function PassageForm() {
  const [title, setTitle] = useState<string>("");
  const [mainImageSrc, setMainImageSrc] = useState<string | undefined>(
    undefined
  );
  const [content, setContent] = useState<string>("");
  const [questions, setQuestions] = useState<Question[]>([]);
  const [preview, setPreview] = useState<boolean>(false);
  const [modalMessage, setModalMessage] = useState<string>("");
  const [grade, setGrade] = useState<Grade | "">("");
  const [isCreating, setIsCreating] = useState<boolean>(false);
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // ----- Rasm boshqaruvi -----

  const handleImageUpload = useCallback((file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const src = String(e.target?.result || "");
      setMainImageSrc(src);
    };
    reader.readAsDataURL(file);
  }, []);

  const handlePickImage = useCallback(() => fileInputRef.current?.click(), []);
  const removeImage = useCallback(() => setMainImageSrc(undefined), []);

  // ----- Savollar boshqaruvi -----

  const addOpenQuestion = useCallback(
    () =>
      setQuestions((q) => [
        ...q,
        {
          id: generateId(),
          kind: "open",
          prompt: "Ochiq savol matnini kiriting",
          expectedAnswer: "",
        },
      ]),
    []
  );

  const addClosedQuestion = useCallback(
    () =>
      setQuestions((q) => [
        ...q,
        {
          id: generateId(),
          kind: "closed",
          prompt: "Yopiq savol matnini kiriting (To'g'ri javobni tanlang)",
          options: ["Variant A", "Variant B", "Variant C"],
          correctIndex: 0,
        },
      ]),
    []
  );

  const updateQuestionPrompt = useCallback(
    (id: string, prompt: string) =>
      setQuestions((qs) =>
        qs.map((qq) => (qq.id === id ? { ...qq, prompt } : qq))
      ),
    []
  );

  const updateOpenAnswer = useCallback(
    (id: string, answer: string) =>
      setQuestions((qs) =>
        qs.map((qq) =>
          qq.id === id && qq.kind === "open"
            ? { ...qq, expectedAnswer: answer }
            : qq
        )
      ),
    []
  );

  const updateClosedOption = useCallback(
    (id: string, index: 0 | 1 | 2, value: string) =>
      setQuestions((qs) =>
        qs.map((qq) =>
          qq.id === id && qq.kind === "closed"
            ? {
                ...qq,
                options: qq.options.map((o, i) =>
                  i === index ? value : o
                ) as [string, string, string],
              }
            : qq
        )
      ),
    []
  );

  const setClosedCorrect = useCallback(
    (id: string, idx: number) =>
      setQuestions((qs) =>
        qs.map((qq) =>
          qq.id === id && qq.kind === "closed"
            ? { ...qq, correctIndex: idx }
            : qq
        )
      ),
    []
  );

  const removeQuestion = useCallback(
    (id: string) => setQuestions((q) => q.filter((qq) => qq.id !== id)),
    []
  );

  // ----- Saqlash Logic -----
  const handleCreate = useCallback(async () => {
    if (!title.trim()) {
      setModalMessage("Iltimos, matn sarlavhasini kiriting.");
      return;
    }

    if (!grade) {
      setModalMessage("Iltimos, matn sinfini tanlang.");
      return;
    }

    if (!content.trim()) {
      setModalMessage("Iltimos, matn mazmunini kiriting.");
      return;
    }

    const selectedGrade = grade as Grade;

    const data: PassageData = {
      title,
      mainImageSrc,
      content,
      questions,
      grade: selectedGrade,
      time: 40,
    };

    try {
      setIsCreating(true);
      await createPassage(data);
      setModalMessage("Matn muvaffaqiyatli saqlandi!");
      toast.success("Matn muvaffaqiyatli saqlandi!");
      router.push("/admin/passages");
    } catch (err) {
      console.error(err);
      setModalMessage("Saqlashda xatolik yuz berdi. Qayta urinib ko‘ring.");
    } finally {
      setIsCreating(false);
    }
  }, [title, mainImageSrc, content, questions, grade, router]);

  return (
    <div className="min-h-screen bg-gray-50 font-sans antialiased">
      <div className="max-w-4xl mx-auto px-4 py-8 sm:py-12">
        {/* Header and Actions */}
        <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-6 border-b border-gray-200 mb-8">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 flex items-center gap-3 mb-4 sm:mb-0">
            <BookOpen className="w-6 h-6 sm:w-8 sm:h-8 text-blue-500" /> Yangi
            matn
          </h1>
          <div className="flex gap-3 w-full sm:w-auto">
            <button
              onClick={() => setPreview((p) => !p)}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-full bg-white text-gray-700 cursor-pointer hover:bg-gray-100 shadow-md transition w-1/2 sm:w-auto justify-center"
            >
              {preview ? (
                <Pencil className="w-4 h-4" />
              ) : (
                <Eye className="w-4 h-4" />
              )}
              {preview ? "Tahrirlash" : "Ko'rib chiqish"}
            </button>
            <Button
              onClick={handleCreate}
              disabled={isCreating}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-full text-white shadow-md transition cursor-pointer w-1/2 sm:w-auto justify-center"
            >
              {isCreating ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" /> Saqlanmoqda...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" /> Saqlash
                </>
              )}
            </Button>
          </div>
        </header>

        {/* Content Area */}
        {preview ? (
          <PreviewView
            title={title}
            mainImageSrc={mainImageSrc}
            content={content}
            grade={grade}
            questions={questions}
            setModalMessage={setModalMessage}
          />
        ) : (
          <EditorView
            title={title}
            setTitle={setTitle}
            mainImageSrc={mainImageSrc}
            setMainImageSrc={setMainImageSrc}
            content={content}
            setContent={setContent}
            grade={grade}
            setGrade={setGrade}
            handlePickImage={handlePickImage}
            handleImageUpload={handleImageUpload}
            removeImage={removeImage}
            fileInputRef={fileInputRef}
            questions={questions}
            addOpenQuestion={addOpenQuestion}
            addClosedQuestion={addClosedQuestion}
            updateQuestionPrompt={updateQuestionPrompt}
            updateOpenAnswer={updateOpenAnswer}
            updateClosedOption={updateClosedOption}
            setClosedCorrect={setClosedCorrect}
            removeQuestion={removeQuestion}
          />
        )}
      </div>
      <SimpleModal
        message={modalMessage}
        onClose={() => setModalMessage("")}
        icon={<ClipboardCheck className="w-10 h-10" />}
      />
    </div>
  );
}

// ----- Editor Components -----

interface EditorViewProps {
  title: string;
  setTitle: (t: string) => void;
  mainImageSrc?: string;
  setMainImageSrc: (s: string | undefined) => void;
  content: string;
  setContent: (c: string) => void;
  grade: Grade | "";
  setGrade: (grade: Grade | "") => void;
  handlePickImage: () => void;
  handleImageUpload: (file: File) => void;
  removeImage: () => void;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  questions: Question[];
  addOpenQuestion: () => void;
  addClosedQuestion: () => void;
  updateQuestionPrompt: (id: string, prompt: string) => void;
  updateOpenAnswer: (id: string, answer: string) => void;
  updateClosedOption: (id: string, index: 0 | 1 | 2, value: string) => void;
  setClosedCorrect: (id: string, idx: number) => void;
  removeQuestion: (id: string) => void;
}

function EditorView(props: EditorViewProps) {
  const {
    title,
    setTitle,
    mainImageSrc,
    removeImage,
    handlePickImage,
    handleImageUpload,
    fileInputRef,
    content,
    setContent,
    grade,
    setGrade,
    questions,
    addOpenQuestion,
    addClosedQuestion,
    updateQuestionPrompt,
    updateOpenAnswer,
    updateClosedOption,
    setClosedCorrect,
    removeQuestion,
  } = props;

  return (
    <div className="space-y-8">
      {/* Sarlavha & Rasm */}
      <section className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
        <h2 className="text-xl font-semibold mb-4 text-gray-700 border-b pb-2">
          1. Matn Sarlavhasi va Asosiy Rasm
        </h2>

        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Matn sarlavhasi (Masalan: Dushman pyesi)"
          className="w-full rounded-xl border border-gray-300 p-3 text-lg font-medium mb-4 focus:ring-blue-500 focus:border-blue-500 transition"
        />

        {/* Image Upload/Preview */}
        <div className="p-2 border border-dashed border-gray-300 rounded-xl ">
          {mainImageSrc ? (
            <div className="relative">
              {/* Replaced Next.js Image with standard img tag */}
              <Image
                width={500}
                height={400}
                src={mainImageSrc}
                alt="Matn rasmi"
                className="max-h-72 object-contain rounded-lg w-full mb-3 "
                onError={(e) => {
                  const img = e.target as HTMLImageElement;
                  img.onerror = null;
                  img.src =
                    "https://placehold.co/600x400/eeeeee/333333?text=Rasm+yuklanmadi";
                }}
              />
              <button
                onClick={removeImage}
                className="absolute top-2 right-2 p-1.5 rounded-full bg-red-500 text-white hover:bg-red-600 transition shadow-md"
                title="Rasmni o'chirish"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={handlePickImage}
              className="w-full flex flex-col items-center justify-center p-8 text-gray-500 hover:text-blue-600 transition"
            >
              <Upload className="w-8 h-8 mb-2" />
              <span className="font-medium">Asosiy Rasmni yuklang</span>
              <span className="text-sm">(Faqat bitta rasm mumkin)</span>
            </button>
          )}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) handleImageUpload(f);
              if (fileInputRef.current) fileInputRef.current.value = "";
            }}
          />
        </div>
      </section>

      {/* Matn Kontenti */}
      <section className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
        <h2 className="text-xl font-semibold mb-4 text-gray-700 border-b pb-2">
          2. Matn Kontenti
        </h2>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Matnning barcha mazmunini shu yerga kiriting..."
          rows={12} // Katta Textarea
          className="w-full rounded-xl border border-gray-300 p-4 bg-white text-base leading-relaxed focus:ring-blue-500 focus:border-blue-500 transition"
        />
      </section>

      {/* Matn sinfi */}

      <section className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
        <h2 className="text-xl font-semibold mb-4 text-gray-700 border-b pb-2">
          3. Matn sinfi
        </h2>
        <select
          value={grade}
          onChange={(e) => setGrade(e.target.value as Grade)}
          className="block w-1/3 px-3 py-2.5 bg-neutral-secondary-medium border border-default-medium text-heading text-sm rounded-lg focus:ring-brand focus:border-brand shadow-xs placeholder:text-body"
        >
          <option disabled value="">
            Sinfni tanlang
          </option>
          <option value="GRADE_3">3-sinf</option>
          <option value="GRADE_4">4-sinf</option>
        </select>
      </section>

      {/* Savollar Editor */}
      <QuestionsEditor
        questions={questions}
        updatePrompt={updateQuestionPrompt}
        updateOpenAnswer={updateOpenAnswer}
        updateClosedOption={updateClosedOption}
        setClosedCorrect={setClosedCorrect}
        addOpen={addOpenQuestion}
        addClosed={addClosedQuestion}
        removeQuestion={removeQuestion}
      />
    </div>
  );
}

// ----- Questions Editor Component (Admin) -----

interface QuestionsEditorProps {
  questions: Question[];
  updatePrompt: (id: string, prompt: string) => void;
  updateOpenAnswer: (id: string, answer: string) => void;
  updateClosedOption: (id: string, index: 0 | 1 | 2, value: string) => void;
  setClosedCorrect: (id: string, idx: number) => void;
  addOpen: () => void;
  addClosed: () => void;
  removeQuestion: (id: string) => void;
}

function QuestionsEditor(props: QuestionsEditorProps) {
  const {
    questions,
    updatePrompt,
    updateOpenAnswer,
    updateClosedOption,
    setClosedCorrect,
    addOpen,
    addClosed,
    removeQuestion,
  } = props;
  return (
    <section className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between flex-wrap gap-4 border-b pb-3 mb-4">
        <h3 className="text-xl font-semibold text-gray-700 flex items-center gap-2">
          <ListOrdered className="w-5 h-5 text-blue-600" /> 4. Savollarni
          tahrirlash
        </h3>
        <div className="flex gap-3 w-full sm:w-auto">
          <button
            onClick={addOpen}
            className="flex items-center gap-1 px-3 py-2 text-sm rounded-full bg-blue-600 text-white hover:bg-blue-700 transition shadow-md w-1/2 sm:w-auto justify-center"
          >
            <MessageSquare className="w-4 h-4" /> Ochiq savol
          </button>
          <button
            onClick={addClosed}
            className="flex items-center gap-1 px-3 py-2 text-sm rounded-full bg-green-600 text-white hover:bg-green-700 transition shadow-md w-1/2 sm:w-auto justify-center"
          >
            <CheckCircle className="w-4 h-4" /> Yopiq savol
          </button>
        </div>
      </div>

      <div className="mt-6 space-y-4">
        {questions.length === 0 && (
          <p className="text-sm text-gray-500 italic p-4 border border-dashed rounded-lg text-center">
            Hali savollar qo‘shilmagan. Yuqoridagi tugmalardan birini bosing.
          </p>
        )}

        {questions.map((q, idx) => (
          <QuestionCard
            key={q.id}
            question={q}
            index={idx}
            updatePrompt={updatePrompt}
            updateOpenAnswer={updateOpenAnswer}
            updateClosedOption={updateClosedOption}
            setClosedCorrect={setClosedCorrect}
            removeQuestion={removeQuestion}
          />
        ))}
      </div>
    </section>
  );
}

// ----- Question Card Component -----

interface QuestionCardProps {
  question: Question;
  index: number;
  updatePrompt: (id: string, prompt: string) => void;
  updateOpenAnswer: (id: string, answer: string) => void;
  updateClosedOption: (id: string, index: 0 | 1 | 2, value: string) => void;
  setClosedCorrect: (id: string, idx: number) => void;
  removeQuestion: (id: string) => void;
}

function QuestionCard(props: QuestionCardProps) {
  const {
    question,
    index,
    updatePrompt,
    updateOpenAnswer,
    updateClosedOption,
    setClosedCorrect,
    removeQuestion,
  } = props;
  const isClosed = question.kind === "closed";
  const color = isClosed ? "border-green-500" : "border-blue-500";
  const bgColor = isClosed ? "bg-green-50" : "bg-blue-50";

  return (
    <div
      className={`border-l-4 ${color} ${bgColor} rounded-xl p-4 shadow-sm transition hover:shadow-md`}
    >
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-2">
          {isClosed ? (
            <CheckCircle className="w-5 h-5 text-green-700" />
          ) : (
            <MessageSquare className="w-5 h-5 text-blue-700" />
          )}
          <span className="text-sm font-bold text-gray-700">
            {index + 1}-Savol ({" "}
            {isClosed ? "Yopiq (Test)" : "Ochiq (Matn kiritish)"} )
          </span>
        </div>
        <button
          onClick={() => removeQuestion(question.id)}
          className="p-1 rounded-full text-red-600 hover:bg-red-200 transition"
          title="Savolni o'chirish"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <textarea
        value={question.prompt}
        onChange={(e) => updatePrompt(question.id, e.target.value)}
        placeholder="Savol matnini kiriting..."
        rows={2}
        className="w-full rounded-lg border border-gray-300 p-2 text-base focus:ring-blue-500 focus:border-blue-500 transition"
      />

      {/* Ochiq savol uchun javob maydoni (Kutilayotgan javob) */}
      {question.kind === "open" && (
        <div className="mt-3 p-3 bg-blue-100 rounded-lg border border-blue-400">
          <label className="block text-sm font-bold text-blue-700 mb-1">
            Kutilayotgan javob (Tekshirish uchun)
          </label>
          <textarea
            value={(question as OpenQuestion).expectedAnswer}
            onChange={(e) => updateOpenAnswer(question.id, e.target.value)}
            placeholder="To'g'ri bo'lishi kutilayotgan javobni kiriting..."
            rows={3}
            className="w-full rounded-lg border border-blue-300 p-2 text-sm focus:ring-blue-500 focus:border-blue-500 transition"
          />
        </div>
      )}

      {/* Yopiq savol variantlari */}
      {isClosed && (
        <div className="grid gap-3 mt-4">
          {(question as ClosedQuestion).options.map((opt, i) => (
            <div key={i} className="flex items-center gap-2">
              <input
                type="radio"
                name={`correct-${question.id}`}
                checked={(question as ClosedQuestion).correctIndex === i}
                onChange={() => setClosedCorrect(question.id, i)}
                className="form-radio text-green-600 w-5 h-5"
                title="To'g'ri javobni belgilash"
              />
              <input
                value={opt}
                onChange={(e) =>
                  updateClosedOption(
                    question.id,
                    i as 0 | 1 | 2,
                    e.target.value
                  )
                }
                placeholder={`Variant ${["A", "B", "C"][i]}`}
                className={`flex-1 rounded-lg border p-2 text-sm ${
                  (question as ClosedQuestion).correctIndex === i
                    ? "bg-green-100 border-green-500 shadow-sm"
                    : "border-gray-300"
                } focus:ring-blue-500 focus:border-blue-500 transition`}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ----- Preview Components (Student View) -----

interface PreviewViewProps {
  title: string;
  mainImageSrc?: string;
  content: string;
  grade: Grade | "";
  questions: Question[];
  setModalMessage: (msg: string) => void;
}

function PreviewView(props: PreviewViewProps) {
  const { title, mainImageSrc, grade, content, questions } = props;

  // Simple state to hold student answers for the demo
  const [answers, setAnswers] = useState<
    Record<string, string | number | undefined>
  >({});

  return (
    // Single Section Container (Now white/clean style)
    <div className="bg-white p-6 sm:p-8 rounded-lg  border border-gray-200 space-y-5 max-w-4xl mx-auto font-sans">
      {/* Passage Header */}
      <header className="text-center border-gray-300">
        <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 leading-tight">
          {title || "Sarlavhasiz matn"}
        </h2>

        <div className="inline-flex items-center gap-2 bg-primary/10 rounded-full px-4 py-2 mt-1">
          <GraduationCap className="h-4 w-4 text-primary" />
          <span className="text-sm font-medium text-primary">
            {grade === "GRADE_3"
              ? "3-sinf"
              : grade === "GRADE_4"
              ? "4-sinf"
              : "?-sinf"}
          </span>
        </div>
      </header>

      {/* Rasm */}
      {mainImageSrc && (
        <div className="flex justify-center my-6">
          <div className="w-full  p-2 bg-white  border-gray-200">
            <Image
              width={500}
              height={400}
              src={mainImageSrc}
              alt="Matnning asosiy rasmi"
              className="max-h-80 w-full object-cover rounded-md"
              onError={(e) => {
                const img = e.target as HTMLImageElement;
                img.onerror = null;
                // Updated placeholder color scheme for clean white background
                img.src =
                  "https://placehold.co/600x400/eeeeee/333333?text=Rasm+Mavjud+Emas";
              }}
            />
          </div>
        </div>
      )}

      {/* Passage Content Preview */}
      <article className="text-gray-800 text-lg">
        {content ? (
          <p className="whitespace-pre-wrap indent-8 text-justify">{content}</p>
        ) : (
          <p className="text-gray-500 italic text-center">
            Matn mazmuni bo‘sh. Avval tahrirlash rejimida mazmun kiriting.
          </p>
        )}
      </article>

      {/* Student Questions View (Seamlessly integrated) */}
      <section className="pt-6 border-t border-gray-300">
        <h3 className="text-2xl font-bold mb-6 text-gray-700 text-center">
          Sinov savollari
        </h3>
        <StudentQuestionsView
          questions={questions}
          answers={answers}
          setAnswers={setAnswers}
        />
      </section>
    </div>
  );
}

interface StudentQuestionsViewProps {
  questions: Question[];
  answers: Record<string, string | number | undefined>;
  setAnswers: React.Dispatch<
    React.SetStateAction<Record<string, string | number | undefined>>
  >;
}

function StudentQuestionsView(props: StudentQuestionsViewProps) {
  const { questions, answers, setAnswers } = props;

  return (
    <div className="space-y-6">
      {questions.length === 0 && (
        <p className="text-base text-gray-500 italic text-center p-4 border border-dashed rounded-xl">
          Bu matn uchun savollar mavjud emas.
        </p>
      )}

      {questions.map((q, idx) => (
        <div
          key={q.id}
          className="bg-white  rounded-xl p-5 shadow-md  transition duration-300"
        >
          <p className="font-bold text-lg text-gray-800 mb-3">
            <span className="text-blue-600 font-extrabold mr-2">
              {idx + 1}.
            </span>{" "}
            {q.prompt}
          </p>

          {q.kind === "open" ? (
            <textarea
              placeholder="Javobingizni yozing..."
              rows={3}
              className="w-full  rounded-lg border border-gray-300 p-3 focus:ring-blue-500 focus:border-blue-500 transition text-base"
              value={(answers[q.id] as string) || ""}
              onChange={(e) =>
                setAnswers((a) => ({ ...a, [q.id]: e.target.value }))
              }
            />
          ) : (
            <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3">
              {(q as ClosedQuestion).options.map((opt, i) => (
                <label
                  key={i}
                  className={`flex items-center gap-3 border rounded-xl p-3 cursor-pointer transition shadow-sm ${
                    answers[q.id] === i
                      ? "bg-indigo-100 border-blue-600 shadow-inner"
                      : "bg-white hover:bg-gray-50 border-gray-300"
                  }`}
                >
                  <input
                    type="radio"
                    name={`student-${q.id}`}
                    checked={answers[q.id] === i}
                    onChange={() => setAnswers((a) => ({ ...a, [q.id]: i }))}
                    className="form-radio text-blue-600 w-5 h-5"
                  />
                  <span className="text-gray-800 font-medium text-base">
                    {opt}
                  </span>
                </label>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

export default PassageForm;
