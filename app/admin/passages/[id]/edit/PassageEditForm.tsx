"use client";

import React, { useRef, useState, useCallback } from "react";
import { updatePassage, deletePassage } from "@/actions/passage";
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
  Trash2,
  ArrowLeft,
  AlertTriangle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { Grade } from "@/lib/generated/prisma/enums";
import type {
  ClosedQuestion,
  FullPassage,
  OpenQuestion,
  Question,
} from "@/types";
import toast from "react-hot-toast";
import Link from "next/link";

// ─── Utility ──────────────────────────────────────────────────────────────────
const generateId = () =>
  Date.now().toString(36) + Math.random().toString(36).substring(2, 9);

// DB Question → local Question type ga aylantirish
function dbQuestionsToLocal(dbQuestions: FullPassage["questions"]): Question[] {
  return dbQuestions.map((q) => {
    if (q.type === "CLOSED") {
      return {
        id: q.id,
        kind: "closed" as const,
        prompt: q.content,
        options: (q.options as [string, string, string, string]) ?? [
          "",
          "",
          "",
          "",
        ],
        correctIndex: q.correctOptionIndex ?? 0,
      } satisfies ClosedQuestion;
    }
    return {
      id: q.id,
      kind: "open" as const,
      prompt: q.content,
      expectedAnswer: q.correctAnswer ?? "",
    } satisfies OpenQuestion;
  });
}

// ─── Delete Confirm Modal ──────────────────────────────────────────────────────
interface DeleteConfirmModalProps {
  passageTitle: string;
  onConfirm: () => void;
  onCancel: () => void;
  isDeleting: boolean;
}

function DeleteConfirmModal({
  passageTitle,
  onConfirm,
  onCancel,
  isDeleting,
}: DeleteConfirmModalProps) {
  return (
    <div className="fixed inset-0 bg-gray-900/70 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-2xl">
        <div className="flex flex-col items-center text-center">
          <div className="w-14 h-14 rounded-full bg-red-100 flex items-center justify-center mb-4">
            <AlertTriangle className="w-7 h-7 text-red-600" />
          </div>
          <h4 className="text-xl font-bold text-gray-900 mb-2">
            Passageni o&apos;chirish
          </h4>
          <p className="text-gray-600 mb-1 text-sm">
            <span className="font-semibold text-gray-800">
              &ldquo;{passageTitle}&rdquo;
            </span>{" "}
            passageni o&apos;chirishni tasdiqlaysizmi?
          </p>
          <p className="text-red-600 text-xs mb-6">
            Bu amalni qaytarib bo&apos;lmaydi. Barcha savollar va natijalar ham
            o&apos;chiriladi.
          </p>
          <div className="flex gap-3 w-full">
            <button
              onClick={onCancel}
              disabled={isDeleting}
              className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 text-gray-700 hover:bg-gray-50 font-medium transition text-sm"
            >
              Bekor qilish
            </button>
            <button
              onClick={onConfirm}
              disabled={isDeleting}
              className="flex-1 px-4 py-2.5 rounded-xl bg-red-600 text-white hover:bg-red-700 font-medium transition text-sm flex items-center justify-center gap-2"
            >
              {isDeleting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  O&apos;chirilmoqda...
                </>
              ) : (
                <>
                  <Trash2 className="w-4 h-4" />
                  O&apos;chirish
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Simple Info Modal ─────────────────────────────────────────────────────────
interface SimpleModalProps {
  message: string;
  onClose: () => void;
  icon: React.ReactNode;
}

function SimpleModal({ message, onClose, icon }: SimpleModalProps) {
  if (!message) return null;
  return (
    <div className="fixed inset-0 bg-gray-900/70 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-2xl">
        <div className="flex flex-col items-center text-center">
          <div className="mb-4 text-blue-600">{icon}</div>
          <h4 className="text-xl font-bold text-gray-900 mb-4">{message}</h4>
          <button
            onClick={onClose}
            className="w-full px-4 py-2.5 text-sm font-medium rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition"
          >
            Tushunarli
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Main PassageEditForm ──────────────────────────────────────────────────────
interface PassageEditFormProps {
  passage: FullPassage;
}

export default function PassageEditForm({ passage }: PassageEditFormProps) {
  const [title, setTitle] = useState(passage.title);
  const [mainImageSrc, setMainImageSrc] = useState<string | undefined>(
    passage.imageUrl ?? undefined,
  );
  const [content, setContent] = useState(passage.content);
  const [grade, setGrade] = useState<Grade | "">(passage.grade ?? "");
  const [questions, setQuestions] = useState<Question[]>(
    dbQuestionsToLocal(passage.questions),
  );
  const [preview, setPreview] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // ── Rasm boshqaruvi ─────────────────────────────────────────────────────────
  const handleImageUpload = useCallback((file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => setMainImageSrc(String(e.target?.result ?? ""));
    reader.readAsDataURL(file);
  }, []);

  const handlePickImage = useCallback(() => fileInputRef.current?.click(), []);
  const removeImage = useCallback(() => setMainImageSrc(undefined), []);

  // ── Savollar boshqaruvi ─────────────────────────────────────────────────────
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
    [],
  );

  const addClosedQuestion = useCallback(
    () =>
      setQuestions((q) => [
        ...q,
        {
          id: generateId(),
          kind: "closed",
          prompt: "Yopiq savol matnini kiriting (To'g'ri javobni tanlang)",
          options: ["Variant A", "Variant B", "Variant C", "Variant D"],
          correctIndex: 0,
        },
      ]),
    [],
  );

  const updateQuestionPrompt = useCallback(
    (id: string, prompt: string) =>
      setQuestions((qs) => qs.map((q) => (q.id === id ? { ...q, prompt } : q))),
    [],
  );

  const updateOpenAnswer = useCallback(
    (id: string, answer: string) =>
      setQuestions((qs) =>
        qs.map((q) =>
          q.id === id && q.kind === "open"
            ? { ...q, expectedAnswer: answer }
            : q,
        ),
      ),
    [],
  );

  const updateClosedOption = useCallback(
    (id: string, index: 0 | 1 | 2 | 3, value: string) =>
      setQuestions((qs) =>
        qs.map((q) =>
          q.id === id && q.kind === "closed"
            ? {
                ...q,
                options: q.options.map((o, i) => (i === index ? value : o)) as [
                  string,
                  string,
                  string,
                  string,
                ],
              }
            : q,
        ),
      ),
    [],
  );

  const setClosedCorrect = useCallback(
    (id: string, idx: number) =>
      setQuestions((qs) =>
        qs.map((q) =>
          q.id === id && q.kind === "closed" ? { ...q, correctIndex: idx } : q,
        ),
      ),
    [],
  );

  const removeQuestion = useCallback(
    (id: string) => setQuestions((q) => q.filter((qq) => qq.id !== id)),
    [],
  );

  // ── Saqlash ─────────────────────────────────────────────────────────────────
  const handleSave = useCallback(async () => {
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

    try {
      setIsSaving(true);
      await updatePassage(passage.id, {
        title,
        mainImageSrc,
        content,
        questions,
        grade: grade as Grade,
        time: 40,
      });
      toast.success("Matn muvaffaqiyatli yangilandi!");
      router.push("/admin/passages");
      router.refresh();
    } catch (err) {
      console.error(err);
      setModalMessage("Saqlashda xatolik yuz berdi. Qayta urinib ko'ring.");
    } finally {
      setIsSaving(false);
    }
  }, [title, mainImageSrc, content, questions, grade, passage.id, router]);

  // ── O'chirish ────────────────────────────────────────────────────────────────
  const handleDelete = useCallback(async () => {
    try {
      setIsDeleting(true);
      await deletePassage(passage.id);
      toast.success("Matn o'chirildi.");
      router.push("/admin/passages");
      router.refresh();
    } catch (err) {
      console.error(err);
      setIsDeleting(false);
      setShowDeleteModal(false);
      toast.error("O'chirishda xatolik yuz berdi.");
    }
  }, [passage.id, router]);

  // ── Render ───────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-gray-50 font-sans antialiased">
      <div className="max-w-4xl mx-auto px-4 py-8 sm:py-12">
        {/* Header */}
        <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-6 border-b border-gray-200 mb-8 gap-4">
          <div className="flex items-center gap-3">
            <Link
              href="/admin/passages"
              className="p-2 rounded-full hover:bg-gray-100 transition text-gray-500"
              title="Orqaga"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 flex items-center gap-2">
              <BookOpen className="w-6 h-6 sm:w-7 sm:h-7 text-blue-500" />
              Matnni tahrirlash
            </h1>
          </div>

          <div className="flex gap-2 w-full sm:w-auto">
            {/* Preview toggle */}
            <button
              onClick={() => setPreview((p) => !p)}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-full bg-white text-gray-700 hover:bg-gray-100 shadow-sm border border-gray-200 transition flex-1 sm:flex-none justify-center"
            >
              {preview ? (
                <Pencil className="w-4 h-4" />
              ) : (
                <Eye className="w-4 h-4" />
              )}
              {preview ? "Tahrirlash" : "Ko'rib chiqish"}
            </button>

            {/* Delete */}
            <button
              onClick={() => setShowDeleteModal(true)}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-full bg-white text-red-600 hover:bg-red-50 shadow-sm border border-red-200 transition justify-center"
              title="O'chirish"
            >
              <Trash2 className="w-4 h-4" />
              <span className="hidden sm:inline">O&apos;chirish</span>
            </button>

            {/* Save */}
            <Button
              onClick={handleSave}
              disabled={isSaving}
              className="flex items-center gap-2 px-5 py-2 text-sm font-medium rounded-full shadow-sm transition flex-1 sm:flex-none justify-center"
            >
              {isSaving ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Saqlanmoqda...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  Saqlash
                </>
              )}
            </Button>
          </div>
        </header>

        {/* Unsaved changes indicator */}
        <div className="mb-6 flex items-center gap-2 text-xs text-amber-600 bg-amber-50 border border-amber-200 rounded-xl px-4 py-2.5">
          <Pencil className="w-3.5 h-3.5 shrink-0" />
          <span>
            Tahrirlab bo&apos;lganingizdan keyin &quot;Saqlash&quot; tugmasini
            bosing.
          </span>
        </div>

        {/* Content Area */}
        {preview ? (
          <PreviewView
            title={title}
            mainImageSrc={mainImageSrc}
            content={content}
            grade={grade}
            questions={questions}
          />
        ) : (
          <EditorView
            title={title}
            setTitle={setTitle}
            mainImageSrc={mainImageSrc}
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

      {/* Modals */}
      <SimpleModal
        message={modalMessage}
        onClose={() => setModalMessage("")}
        icon={<ClipboardCheck className="w-10 h-10" />}
      />

      {showDeleteModal && (
        <DeleteConfirmModal
          passageTitle={title}
          onConfirm={handleDelete}
          onCancel={() => setShowDeleteModal(false)}
          isDeleting={isDeleting}
        />
      )}
    </div>
  );
}

// ─── Editor View ───────────────────────────────────────────────────────────────
interface EditorViewProps {
  title: string;
  setTitle: (t: string) => void;
  mainImageSrc?: string;
  content: string;
  setContent: (c: string) => void;
  grade: Grade | "";
  setGrade: (g: Grade | "") => void;
  handlePickImage: () => void;
  handleImageUpload: (file: File) => void;
  removeImage: () => void;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  questions: Question[];
  addOpenQuestion: () => void;
  addClosedQuestion: () => void;
  updateQuestionPrompt: (id: string, prompt: string) => void;
  updateOpenAnswer: (id: string, answer: string) => void;
  updateClosedOption: (id: string, index: 0 | 1 | 2 | 3, value: string) => void;
  setClosedCorrect: (id: string, idx: number) => void;
  removeQuestion: (id: string) => void;
}

function EditorView({
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
}: EditorViewProps) {
  return (
    <div className="space-y-8">
      {/* 1. Sarlavha va Rasm */}
      <section className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
        <h2 className="text-xl font-semibold mb-4 text-gray-700 border-b pb-2">
          1. Matn sarlavhasi va asosiy rasm
        </h2>

        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Matn sarlavhasi (masalan: Dushman pyesi)"
          className="w-full rounded-xl border border-gray-300 p-3 text-lg font-medium mb-4 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition outline-none"
        />

        <div className="p-2 border border-dashed border-gray-300 rounded-xl">
          {mainImageSrc ? (
            <div className="relative">
              <Image
                width={600}
                height={400}
                src={mainImageSrc}
                alt="Matn rasmi"
                className="max-h-72 object-contain rounded-lg w-full mb-3"
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
              <span className="font-medium">Asosiy rasmni yuklang</span>
              <span className="text-sm text-gray-400">(Faqat bitta rasm)</span>
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

      {/* 2. Matn Kontenti */}
      <section className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
        <h2 className="text-xl font-semibold mb-4 text-gray-700 border-b pb-2">
          2. Matn kontenti
        </h2>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Matnning barcha mazmunini shu yerga kiriting..."
          rows={12}
          className="w-full rounded-xl border border-gray-300 p-4 bg-white text-base leading-relaxed focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition outline-none resize-y"
        />
      </section>

      {/* 3. Sinf */}
      <section className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
        <h2 className="text-xl font-semibold mb-4 text-gray-700 border-b pb-2">
          3. Matn sinfi
        </h2>
        <select
          value={grade}
          onChange={(e) => setGrade(e.target.value as Grade)}
          className="block w-1/3 px-3 py-2.5 bg-white border border-gray-300 text-gray-800 text-sm rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition outline-none"
        >
          <option disabled value="">
            Sinfni tanlang
          </option>
          <option value="GRADE_3">3-sinf</option>
          <option value="GRADE_4">4-sinf</option>
        </select>
      </section>

      {/* 4. Savollar */}
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

// ─── Questions Editor ──────────────────────────────────────────────────────────
interface QuestionsEditorProps {
  questions: Question[];
  updatePrompt: (id: string, prompt: string) => void;
  updateOpenAnswer: (id: string, answer: string) => void;
  updateClosedOption: (id: string, index: 0 | 1 | 2 | 3, value: string) => void;
  setClosedCorrect: (id: string, idx: number) => void;
  addOpen: () => void;
  addClosed: () => void;
  removeQuestion: (id: string) => void;
}

function QuestionsEditor({
  questions,
  updatePrompt,
  updateOpenAnswer,
  updateClosedOption,
  setClosedCorrect,
  addOpen,
  addClosed,
  removeQuestion,
}: QuestionsEditorProps) {
  return (
    <section className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between flex-wrap gap-4 border-b pb-3 mb-4">
        <h3 className="text-xl font-semibold text-gray-700 flex items-center gap-2">
          <ListOrdered className="w-5 h-5 text-blue-600" /> 4. Savollarni
          tahrirlash
          <span className="text-sm font-normal text-gray-400 ml-1">
            ({questions.length} ta savol)
          </span>
        </h3>
        <div className="flex gap-3 w-full sm:w-auto">
          <button
            onClick={addOpen}
            className="flex items-center gap-1.5 px-4 py-2 text-sm rounded-full bg-blue-600 text-white hover:bg-blue-700 transition shadow-sm w-1/2 sm:w-auto justify-center font-medium"
          >
            <MessageSquare className="w-4 h-4" /> Ochiq savol
          </button>
          <button
            onClick={addClosed}
            className="flex items-center gap-1.5 px-4 py-2 text-sm rounded-full bg-emerald-600 text-white hover:bg-emerald-700 transition shadow-sm w-1/2 sm:w-auto justify-center font-medium"
          >
            <CheckCircle className="w-4 h-4" /> Yopiq savol
          </button>
        </div>
      </div>

      <div className="mt-6 space-y-4">
        {questions.length === 0 && (
          <div className="text-sm text-gray-500 italic p-6 border border-dashed rounded-2xl text-center">
            Hali savollar qo&apos;shilmagan. Yuqoridagi tugmalardan foydalaning.
          </div>
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

// ─── Question Card ─────────────────────────────────────────────────────────────
interface QuestionCardProps {
  question: Question;
  index: number;
  updatePrompt: (id: string, prompt: string) => void;
  updateOpenAnswer: (id: string, answer: string) => void;
  updateClosedOption: (id: string, index: 0 | 1 | 2 | 3, value: string) => void;
  setClosedCorrect: (id: string, idx: number) => void;
  removeQuestion: (id: string) => void;
}

function QuestionCard({
  question,
  index,
  updatePrompt,
  updateOpenAnswer,
  updateClosedOption,
  setClosedCorrect,
  removeQuestion,
}: QuestionCardProps) {
  const isClosed = question.kind === "closed";
  const borderColor = isClosed ? "border-emerald-500" : "border-blue-500";
  const bgColor = isClosed ? "bg-emerald-50" : "bg-blue-50";

  return (
    <div
      className={`border-l-4 ${borderColor} ${bgColor} rounded-xl p-4 shadow-sm hover:shadow-md transition`}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-2">
          {isClosed ? (
            <CheckCircle className="w-5 h-5 text-emerald-700 shrink-0" />
          ) : (
            <MessageSquare className="w-5 h-5 text-blue-700 shrink-0" />
          )}
          <span className="text-sm font-bold text-gray-700">
            {index + 1}-Savol (
            {isClosed ? "Yopiq — Test" : "Ochiq — Matn kiritish"})
          </span>
        </div>
        <button
          onClick={() => removeQuestion(question.id)}
          className="p-1.5 rounded-full text-red-500 hover:bg-red-100 transition shrink-0"
          title="Savolni o'chirish"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Savol matni */}
      <textarea
        value={question.prompt}
        onChange={(e) => updatePrompt(question.id, e.target.value)}
        placeholder="Savol matnini kiriting..."
        rows={2}
        className="w-full rounded-lg border border-gray-300 p-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition outline-none resize-none"
      />

      {/* Ochiq savol uchun kutilgan javob */}
      {question.kind === "open" && (
        <div className="mt-3 p-3 bg-blue-100 rounded-xl border border-blue-300">
          <label className="block text-xs font-bold text-blue-700 mb-1.5 uppercase tracking-wide">
            Kutilayotgan to&apos;g&apos;ri javob (AI tekshirish uchun)
          </label>
          <textarea
            value={(question as OpenQuestion).expectedAnswer}
            onChange={(e) => updateOpenAnswer(question.id, e.target.value)}
            placeholder="To'g'ri bo'lishi kutilayotgan javobni kiriting..."
            rows={3}
            className="w-full rounded-lg border border-blue-300 p-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition outline-none resize-none bg-white"
          />
        </div>
      )}

      {/* Yopiq savol variantlari */}
      {isClosed && (
        <div className="grid gap-2.5 mt-3">
          {(question as ClosedQuestion).options.map((opt, i) => {
            const letters = ["A", "B", "C", "D"];
            const isCorrect = (question as ClosedQuestion).correctIndex === i;
            return (
              <div key={i} className="flex items-center gap-2.5">
                <button
                  type="button"
                  onClick={() => setClosedCorrect(question.id, i)}
                  className={`w-7 h-7 rounded-full border-2 flex items-center justify-center font-bold text-xs shrink-0 transition ${
                    isCorrect
                      ? "border-emerald-600 bg-emerald-600 text-white"
                      : "border-gray-300 bg-white text-gray-500 hover:border-emerald-400"
                  }`}
                  title="To'g'ri javobni belgilash"
                >
                  {letters[i]}
                </button>
                <input
                  value={opt}
                  onChange={(e) =>
                    updateClosedOption(
                      question.id,
                      i as 0 | 1 | 2 | 3,
                      e.target.value,
                    )
                  }
                  placeholder={`Variant ${letters[i]}`}
                  className={`flex-1 rounded-lg border p-2.5 text-sm outline-none transition ${
                    isCorrect
                      ? "bg-emerald-50 border-emerald-500 shadow-sm font-medium"
                      : "border-gray-300 bg-white focus:border-blue-400 focus:ring-1 focus:ring-blue-400"
                  }`}
                />
              </div>
            );
          })}
          <p className="text-xs text-emerald-700 mt-1">
            💡 To&apos;g&apos;ri variantni belgilash uchun harf tugmasini
            bosing.
          </p>
        </div>
      )}
    </div>
  );
}

// ─── Preview View ──────────────────────────────────────────────────────────────
interface PreviewViewProps {
  title: string;
  mainImageSrc?: string;
  content: string;
  grade: Grade | "";
  questions: Question[];
}

function PreviewView({
  title,
  mainImageSrc,
  grade,
  content,
  questions,
}: PreviewViewProps) {
  const [answers, setAnswers] = useState<
    Record<string, string | number | undefined>
  >({});

  return (
    <div className="bg-white p-6 sm:p-10 shadow-md rounded-2xl border border-gray-200 max-w-4xl mx-auto animate-fade-in">
      {/* Header */}
      <div className="flex items-start justify-between gap-3 mb-1 border-b pb-4">
        <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 leading-tight">
          {title || "Sarlavhasiz matn"}
        </h2>
        <div className="inline-flex items-center gap-2 bg-primary/10 rounded-full px-4 py-2 mt-1 shrink-0">
          <GraduationCap className="h-4 w-4 text-primary" />
          <span className="text-sm font-medium text-primary">
            {grade === "GRADE_3"
              ? "3-sinf"
              : grade === "GRADE_4"
                ? "4-sinf"
                : "?-sinf"}
          </span>
        </div>
      </div>

      {/* Rasm + Matn */}
      <div className="mb-8 mt-6">
        {mainImageSrc && (
          <div className="relative w-full sm:w-72 aspect-3/4 sm:float-left mr-6 mb-4 rounded-xl overflow-hidden shadow-lg border border-gray-100 bg-slate-100">
            <Image
              src={mainImageSrc}
              alt="Matn rasmi"
              fill
              sizes="(max-width: 640px) 100vw, 300px"
              className="object-cover"
              priority
              quality={80}
            />
          </div>
        )}
        {content ? (
          <div className="text-lg leading-relaxed text-gray-700">
            {(() => {
              const rawLines = content.split("\n");
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
                      className={`text-lg leading-relaxed ${
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
        ) : (
          <p className="text-gray-400 italic text-center">
            Matn mazmuni bo&apos;sh.
          </p>
        )}
        <div className="clear-both" />
      </div>

      {/* Savollar */}
      <section className="pt-6 border-t border-gray-200">
        <h3 className="text-2xl font-bold text-gray-800 mb-6">
          Matn bo&apos;yicha testlar
        </h3>
        <div className="space-y-6">
          {questions.length === 0 && (
            <p className="text-gray-400 italic text-center p-4 border border-dashed rounded-xl">
              Bu matn uchun savollar mavjud emas.
            </p>
          )}
          {questions.map((q, idx) => (
            <div
              key={q.id}
              className="bg-white rounded-xl p-5 shadow-sm border border-gray-100"
            >
              <p className="font-bold text-lg text-gray-800 mb-3">
                <span className="text-blue-600 font-extrabold mr-2">
                  {idx + 1}.
                </span>
                {q.prompt}
              </p>
              {q.kind === "open" ? (
                <textarea
                  placeholder="Javobingizni yozing..."
                  rows={3}
                  className="w-full rounded-xl border border-gray-300 p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition text-base outline-none resize-none"
                  value={(answers[q.id] as string) ?? ""}
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
                          ? "bg-indigo-50 border-blue-500 shadow-inner"
                          : "bg-white hover:bg-gray-50 border-gray-200"
                      }`}
                    >
                      <input
                        type="radio"
                        name={`preview-${q.id}`}
                        checked={answers[q.id] === i}
                        onChange={() =>
                          setAnswers((a) => ({ ...a, [q.id]: i }))
                        }
                        className="form-radio text-blue-600 w-4 h-4"
                      />
                      <span className="text-gray-800 font-medium text-sm">
                        {opt}
                      </span>
                    </label>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
