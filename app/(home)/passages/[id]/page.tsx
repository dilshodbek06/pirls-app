"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { ArrowLeft, CheckCircle, XCircle } from "lucide-react";
import { useParams } from "next/navigation";
import { passages } from "@/mock/passagesData";
import Link from "next/link";

const PassageDetail = () => {
  const { id } = useParams();
  const passage = passages.find((p) => p.id === id);
  const [answers, setAnswers] = useState<{ [key: string]: number }>({});
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);

  if (!passage) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Passage not found</h2>
            <Link href="/passages">
              <Button>Back to Passages</Button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const handleAnswerChange = (questionId: string, answerIndex: number) => {
    setAnswers({
      ...answers,
      [questionId]: answerIndex,
    });
  };

  const handleSubmit = () => {
    if (Object.keys(answers).length < passage.questions.length) {
      //   toast({
      //     title: "Incomplete Answers",
      //     description: "Please answer all questions before submitting.",
      //     variant: "destructive",
      //   });
      return;
    }

    let correctCount = 0;
    passage.questions.forEach((question) => {
      if (answers[question.id] === question.correctAnswer) {
        correctCount++;
      }
    });

    setScore(correctCount);
    setShowResults(true);

    // toast({
    //   title: "Quiz Completed!",
    //   description: `You scored ${correctCount} out of ${passage.questions.length}`,
    // });
  };

  const resetQuiz = () => {
    setAnswers({});
    setShowResults(false);
    setScore(0);
  };

  const difficultyColors = {
    Easy: "bg-accent/10 text-accent border-accent/20",
    Medium: "bg-secondary/10 text-secondary border-secondary/20",
    Hard: "bg-destructive/10 text-destructive border-destructive/20",
  };

  return (
    <div className="min-h-screen flex flex-col">
      <div className="bg-linear-to-r from-cyan-500 to-green-500">
        <Header />
      </div>

      <main className="flex-1 py-12 px-4">
        <div className="container mx-auto max-w-4xl">
          <Link href="/passages">
            <Button variant="ghost" className="mb-6">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Passages
            </Button>
          </Link>

          <div className="mb-8 animate-fade-in">
            <div className="flex items-center gap-3 mb-4">
              <h1 className="text-3xl md:text-4xl font-bold">
                {passage.title}
              </h1>
              <Badge
                variant="outline"
                className={difficultyColors[passage.difficulty]}
              >
                {passage.difficulty}
              </Badge>
            </div>

            <Card>
              <CardContent className="pt-6">
                <div className="prose prose-lg max-w-none">
                  {passage.fullText.split("\n\n").map((paragraph, index) => (
                    <p
                      key={index}
                      className="mb-4 text-foreground leading-relaxed"
                    >
                      {paragraph}
                    </p>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6 animate-fade-in-up">
            <h2 className="text-2xl font-bold">Comprehension Questions</h2>

            {passage.questions.map((question, qIndex) => (
              <Card key={question.id}>
                <CardHeader>
                  <CardTitle className="text-lg">
                    Question {qIndex + 1}: {question.question}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <RadioGroup
                    value={answers[question.id]?.toString()}
                    onValueChange={(value) =>
                      handleAnswerChange(question.id, parseInt(value))
                    }
                    disabled={showResults}
                  >
                    {question.options.map((option, oIndex) => {
                      const isSelected = answers[question.id] === oIndex;
                      const isCorrect = question.correctAnswer === oIndex;
                      const showCorrect = showResults && isCorrect;
                      const showIncorrect =
                        showResults && isSelected && !isCorrect;

                      return (
                        <div
                          key={oIndex}
                          className={`flex items-center space-x-3 p-3 rounded-lg transition-colors ${
                            showCorrect
                              ? "bg-accent/10 border border-accent"
                              : ""
                          } ${
                            showIncorrect
                              ? "bg-destructive/10 border border-destructive"
                              : ""
                          }`}
                        >
                          <RadioGroupItem
                            value={oIndex.toString()}
                            id={`${question.id}-${oIndex}`}
                          />
                          <Label
                            htmlFor={`${question.id}-${oIndex}`}
                            className="flex-1 cursor-pointer"
                          >
                            {option}
                          </Label>
                          {showCorrect && (
                            <CheckCircle className="h-5 w-5 text-accent" />
                          )}
                          {showIncorrect && (
                            <XCircle className="h-5 w-5 text-destructive" />
                          )}
                        </div>
                      );
                    })}
                  </RadioGroup>
                </CardContent>
              </Card>
            ))}

            {!showResults ? (
              <Button
                onClick={handleSubmit}
                variant="hero"
                size="lg"
                className="w-full"
              >
                Submit Answers
              </Button>
            ) : (
              <div className="space-y-4">
                <Card className="bg-linear-to-r from-primary/10 to-accent/10 border-primary/20">
                  <CardContent className="pt-6 text-center">
                    <h3 className="text-2xl font-bold mb-2">Your Score</h3>
                    <p className="text-4xl font-bold text-primary mb-4">
                      {score} / {passage.questions.length}
                    </p>
                    <p className="text-lg text-muted-foreground">
                      {score === passage.questions.length
                        ? "Perfect! Excellent work!"
                        : score >= passage.questions.length * 0.7
                        ? "Great job! Keep it up!"
                        : "Good effort! Try reading the passage again."}
                    </p>
                  </CardContent>
                </Card>

                <div className="flex gap-4">
                  <Button
                    onClick={resetQuiz}
                    variant="outline"
                    size="lg"
                    className="flex-1"
                  >
                    Yana sinab ko&apos;rish
                  </Button>
                  <Link href="/passages" className="flex-1">
                    <Button variant="hero" size="lg" className="w-full">
                      Ko&apos;proq matnlar
                    </Button>
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default PassageDetail;
