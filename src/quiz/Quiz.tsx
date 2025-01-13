import React, { useState } from "react";
import { Card, CardContent, CardHeader } from "../components/ui/card.tsx";
import { RadioGroup, RadioGroupItem } from "../components/ui/radio-group.tsx";
import { Button } from "../components/ui/button.tsx";

// Define the QuizQuestion type
export type QuizQuestion = {
  id: string;
  question: string;
  choices: string[];
  correctAnswer: string;
};

type QuizProps = {
  quiz: QuizQuestion[];
};
// Quiz Component
// Quiz Component
export default function Quiz({ quiz }: QuizProps) {
  // State for answers, results, and feedback
  const [answers, setAnswers] = useState<{ [key: string]: string }>({});
  const [results, setResults] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<{ [key: string]: string }>({});

  // Handle answer selection
  const handleSelect = (questionId: string, choice: string) => {
    setAnswers({ ...answers, [questionId]: choice });
  };

  // Handle quiz submission
  const handleSubmit = () => {
    let score = 0;
    const newFeedback: { [key: string]: string } = {};

    quiz.forEach((question) => {
      const isCorrect = answers[question.id] === question.correctAnswer;

      if (isCorrect) {
        score += 1;
        newFeedback[question.id] = "Correct!";
      } else {
        newFeedback[
          question.id
        ] = `Wrong! Correct answer: ${question.correctAnswer}`;
      }
    });

    setFeedback(newFeedback);
    setResults(`You scored ${score} out of ${quiz.length}`);
  };

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold text-center">Quiz</h1>
      {quiz.map((question) => (
        <Card key={question.id} className="shadow-md border">
          <CardHeader>
            <h3 className="text-lg font-medium">{question.question}</h3>
          </CardHeader>
          <CardContent>
            <RadioGroup
              value={answers[question.id] || ""}
              onValueChange={(choice) => handleSelect(question.id, choice)}
              className="space-y-2"
            >
              {question.choices.map((choice) => (
                <label
                  key={choice}
                  className="flex items-center gap-2 p-2 border rounded-md hover:bg-gray-100 cursor-pointer"
                >
                  <RadioGroupItem value={choice} id={choice} />
                  {choice}
                </label>
              ))}
            </RadioGroup>
            {feedback[question.id] && (
              <p
                className={`mt-2 text-sm ${
                  feedback[question.id].includes("Wrong")
                    ? "text-red-500"
                    : "text-green-500"
                }`}
              >
                {feedback[question.id]}
              </p>
            )}
          </CardContent>
        </Card>
      ))}

      <Button onClick={handleSubmit} className="w-full mt-4">
        Submit
      </Button>
      {results && (
        <div className="text-center mt-4 text-lg font-semibold text-green-600">
          {results}
        </div>
      )}
    </div>
  );
}
