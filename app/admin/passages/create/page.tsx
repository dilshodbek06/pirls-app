// app/editor/page.tsx
"use client";
import React, { useRef, useState } from "react";
import { v4 as uuid } from "uuid";

// --- Types ---
type Block =
  | { id: string; type: "paragraph"; text: string }
  | { id: string; type: "image"; src: string; alt: string };

type QuestionCommon = { id: string; prompt: string };

type OpenQuestion = QuestionCommon & { kind: "open" };

type ClosedQuestion = QuestionCommon & {
  kind: "closed";
  options: [string, string, string, string];
  correctIndex?: number; // optional
};

type Question = OpenQuestion | ClosedQuestion;

type PassageData = {
  title: string;
  author: string;
  blocks: Block[];
  questions: Question[];
};

export default function EditorPage() {
  const [title, setTitle] = useState<string>("");
  const [author, setAuthor] = useState<string>("");
  const [blocks, setBlocks] = useState<Block[]>([
    { id: uuid(), type: "paragraph", text: "" },
  ]);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [preview, setPreview] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // ----- Blocks -----
  const addParagraph = () =>
    setBlocks((b) => [...b, { id: uuid(), type: "paragraph", text: "" }]);

  const addImageFromFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const src = String(e.target?.result || "");
      setBlocks((b) => [...b, { id: uuid(), type: "image", src, alt: "" }]);
    };
    reader.readAsDataURL(file);
  };

  const handlePickImage = () => fileInputRef.current?.click();

  const moveBlock = (index: number, dir: -1 | 1) => {
    setBlocks((b) => {
      const next = [...b];
      const newIndex = index + dir;
      if (newIndex < 0 || newIndex >= next.length) return next;
      const [item] = next.splice(index, 1);
      next.splice(newIndex, 0, item);
      return next;
    });
  };

  const removeBlock = (index: number) =>
    setBlocks((b) => b.filter((_, i) => i !== index));

  const updateParagraph = (id: string, text: string) =>
    setBlocks((b) => b.map((blk) => (blk.id === id ? { ...blk, text } : blk)));

  const updateImageAlt = (id: string, alt: string) =>
    setBlocks((b) => b.map((blk) => (blk.id === id ? { ...blk, alt } : blk)));

  // ----- Questions (Admin) -----
  const addOpenQuestion = () =>
    setQuestions((q) => [
      ...q,
      { id: uuid(), kind: "open", prompt: "Yozma javob uchun savol" },
    ]);

  const addClosedQuestion = () =>
    setQuestions((q) => [
      ...q,
      {
        id: uuid(),
        kind: "closed",
        prompt: "To'g'ri javobni tanlang",
        options: ["A", "B", "C", "D"],
      },
    ]);

  const updateQuestionPrompt = (id: string, prompt: string) =>
    setQuestions((qs) =>
      qs.map((qq) => (qq.id === id ? { ...qq, prompt } : qq))
    );

  const updateClosedOption = (
    id: string,
    index: 0 | 1 | 2 | 3,
    value: string
  ) =>
    setQuestions((qs) =>
      qs.map((qq) =>
        qq.id === id && qq.kind === "closed"
          ? {
              ...qq,
              options: qq.options.map((o, i) => (i === index ? value : o)) as [
                string,
                string,
                string,
                string
              ],
            }
          : qq
      )
    );

  const setClosedCorrect = (id: string, idx: number) =>
    setQuestions((qs) =>
      qs.map((qq) =>
        qq.id === id && qq.kind === "closed" ? { ...qq, correctIndex: idx } : qq
      )
    );

  const removeQuestion = (index: number) =>
    setQuestions((q) => q.filter((_, i) => i !== index));

  // ----- Export -----
  const exportJSON = () => {
    const data: PassageData = { title, author, blocks, questions };
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `$${(title || "passage").replace(/\s+/g, "-")}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between gap-3">
          <h1 className="text-2xl font-semibold">Passage Editor</h1>
          <div className="flex gap-2">
            <button
              onClick={() => setPreview((p) => !p)}
              className="px-3 py-2 rounded-2xl shadow bg-white hover:bg-neutral-100"
            >
              {preview ? "Edit" : "Preview"}
            </button>
            <button
              onClick={exportJSON}
              className="px-3 py-2 rounded-2xl shadow bg-white hover:bg-neutral-100"
            >
              Export JSON
            </button>
          </div>
        </div>

        {/* Title & Author */}
        {!preview ? (
          <div className="mt-6 grid gap-3">
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Title (e.g., Enemy Pie)"
              className="w-full rounded-2xl border p-3 bg-white"
            />
            <input
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              placeholder="Subtitle / byline"
              className="w-full rounded-2xl border p-3 bg-white"
            />
          </div>
        ) : (
          <header className="mt-10 mb-6 text-center">
            <h2 className="text-4xl font-bold">{title || "Untitled"}</h2>
            {author && <p className="mt-2 italic text-neutral-600">{author}</p>}
          </header>
        )}

        {/* Blocks */}
        {!preview ? (
          <div className="mt-6 space-y-4">
            {blocks.map((blk, i) => (
              <div
                key={blk.id}
                className="group bg-white border rounded-2xl p-4 shadow-sm"
              >
                <div className="flex justify-between mb-2">
                  <div className="text-sm text-neutral-500">
                    {blk.type.toUpperCase()} #{i + 1}
                  </div>
                  <div className="flex gap-2 opacity-100 sm:opacity-0 group-hover:opacity-100 transition">
                    <button
                      className="px-2 py-1 rounded-xl border"
                      onClick={() => moveBlock(i, -1)}
                    >
                      ↑
                    </button>
                    <button
                      className="px-2 py-1 rounded-xl border"
                      onClick={() => moveBlock(i, 1)}
                    >
                      ↓
                    </button>
                    <button
                      className="px-2 py-1 rounded-xl border text-red-600"
                      onClick={() => removeBlock(i)}
                    >
                      Delete
                    </button>
                  </div>
                </div>

                {blk.type === "paragraph" ? (
                  <textarea
                    value={blk.text}
                    onChange={(e) => updateParagraph(blk.id, e.target.value)}
                    placeholder="Write paragraph..."
                    rows={5}
                    className="w-full rounded-xl border p-3 bg-white"
                  />
                ) : (
                  <div className="grid gap-2">
                    <img
                      src={blk.src}
                      alt={blk.alt || "image"}
                      className="max-h-72 object-contain rounded-xl border"
                    />
                    <input
                      value={blk.alt}
                      onChange={(e) => updateImageAlt(blk.id, e.target.value)}
                      placeholder="Alt text (optional)"
                      className="w-full rounded-xl border p-2"
                    />
                  </div>
                )}
              </div>
            ))}

            <div className="flex flex-wrap gap-3 pt-2">
              <button
                onClick={addParagraph}
                className="px-4 py-2 rounded-2xl bg-black text-white shadow"
              >
                + Paragraph
              </button>
              <button
                onClick={handlePickImage}
                className="px-4 py-2 rounded-2xl bg-black text-white shadow"
              >
                + Image
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) addImageFromFile(f);
                  if (fileInputRef.current) fileInputRef.current.value = "";
                }}
              />
            </div>

            {/* Questions Editor (Admin) */}
            <QuestionsEditor
              questions={questions}
              updatePrompt={updateQuestionPrompt}
              updateClosedOption={updateClosedOption}
              setClosedCorrect={setClosedCorrect}
              addOpen={addOpenQuestion}
              addClosed={addClosedQuestion}
              removeQuestion={removeQuestion}
            />
          </div>
        ) : (
          <>
            <article className="prose prose-neutral max-w-none bg-white rounded-2xl p-6 shadow mt-4">
              {blocks.map((blk) => (
                <div key={blk.id}>
                  {blk.type === "paragraph" ? (
                    <p className="whitespace-pre-wrap leading-7">{blk.text}</p>
                  ) : (
                    <figure className="my-6">
                      <img src={blk.src} alt={blk.alt || "image"} />
                      {blk.alt && (
                        <figcaption className="text-sm text-neutral-600">
                          {blk.alt}
                        </figcaption>
                      )}
                    </figure>
                  )}
                </div>
              ))}
            </article>

            {/* Student (Preview) */}
            <section className="bg-white rounded-2xl p-6 shadow mt-6">
              <h3 className="text-xl font-semibold mb-4">Savollar</h3>
              <StudentQuestionsView questions={questions} />
            </section>
          </>
        )}
      </div>
    </div>
  );
}

function QuestionsEditor({
  questions,
  updatePrompt,
  updateClosedOption,
  setClosedCorrect,
  addOpen,
  addClosed,
  removeQuestion,
}: {
  questions: Question[];
  updatePrompt: (id: string, prompt: string) => void;
  updateClosedOption: (id: string, index: 0 | 1 | 2 | 3, value: string) => void;
  setClosedCorrect: (id: string, idx: number) => void;
  addOpen: () => void;
  addClosed: () => void;
  removeQuestion: (index: number) => void;
}) {
  return (
    <section className="bg-white rounded-2xl p-6 shadow mt-8">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold">Savollar (Admin)</h3>
        <div className="flex gap-2">
          <button
            onClick={addOpen}
            className="px-3 py-2 rounded-2xl bg-neutral-900 text-white"
          >
            + Ochiq savol
          </button>
          <button
            onClick={addClosed}
            className="px-3 py-2 rounded-2xl bg-neutral-900 text-white"
          >
            + Yopiq savol (4 variant)
          </button>
        </div>
      </div>

      <div className="mt-4 space-y-4">
        {questions.length === 0 && (
          <p className="text-sm text-neutral-600">
            Hali savollar qo&apos;shilmagan.
          </p>
        )}

        {questions.map((q, idx) => (
          <div key={q.id} className="border rounded-2xl p-4">
            <div className="flex items-start justify-between gap-3">
              <div className="text-sm text-neutral-500">
                Q{idx + 1} · {q.kind === "open" ? "Ochiq" : "Yopiq"}
              </div>
              <button
                onClick={() => removeQuestion(idx)}
                className="px-2 py-1 rounded-xl border text-red-600"
              >
                Delete
              </button>
            </div>

            <input
              value={q.prompt}
              onChange={(e) => updatePrompt(q.id, e.target.value)}
              placeholder="Savol matni"
              className="w-full mt-3 rounded-xl border p-2"
            />

            {q.kind === "closed" && (
              <div className="grid md:grid-cols-2 gap-3 mt-3">
                {q.options.map((opt, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <input
                      type="radio"
                      name={`correct-$${q.id}`}
                      checked={(q as ClosedQuestion).correctIndex === i}
                      onChange={() => setClosedCorrect(q.id, i)}
                    />
                    <input
                      value={opt}
                      onChange={(e) =>
                        updateClosedOption(
                          q.id,
                          i as 0 | 1 | 2 | 3,
                          e.target.value
                        )
                      }
                      placeholder={`Variant $${i + 1}`}
                      className="flex-1 rounded-xl border p-2"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}

function StudentQuestionsView({ questions }: { questions: Question[] }) {
  const [answers, setAnswers] = useState<
    Record<string, string | number | undefined>
  >({});

  return (
    <div className="space-y-6">
      {questions.length === 0 && (
        <p className="text-sm text-neutral-600">Savollar mavjud emas.</p>
      )}

      {questions.map((q, idx) => (
        <div key={q.id} className="border rounded-2xl p-4">
          <p className="font-medium">
            Q{idx + 1}. {q.prompt}
          </p>

          {q.kind === "open" ? (
            <textarea
              placeholder="Javobingizni yozing..."
              rows={4}
              className="w-full mt-3 rounded-xl border p-3"
              value={(answers[q.id] as string) || ""}
              onChange={(e) =>
                setAnswers((a) => ({ ...a, [q.id]: e.target.value }))
              }
            />
          ) : (
            <div className="mt-3 grid md:grid-cols-2 gap-2">
              {(q as ClosedQuestion).options.map((opt, i) => (
                <label
                  key={i}
                  className="flex items-center gap-2 border rounded-xl p-2"
                >
                  <input
                    type="radio"
                    name={`student-$${q.id}`}
                    checked={answers[q.id] === i}
                    onChange={() => setAnswers((a) => ({ ...a, [q.id]: i }))}
                  />
                  <span>{opt}</span>
                </label>
              ))}
            </div>
          )}
        </div>
      ))}

      {questions.length > 0 && (
        <button
          onClick={() => alert("Javoblar saqlandi (demo).")}
          className="px-4 py-2 rounded-2xl bg-neutral-900 text-white"
        >
          Javoblarni topshirish
        </button>
      )}
    </div>
  );
}
