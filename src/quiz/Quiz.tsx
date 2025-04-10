import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "../components/ui/card";
import { RadioGroup, RadioGroupItem } from "../components/ui/radio-group";
import { Button } from "../components/ui/button";
import { Label } from "../components/ui/label";
import {
  CheckCircle,
  XCircle,
  Clock,
  Award,
  ArrowRight,
  RotateCcw,
  Scale,
} from "lucide-react";
import { Progress } from "../components/ui/progress";
import { ScaledClick } from "@/animations/ScaledClick";

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

export default function Quiz({ quiz }: QuizProps) {
  // State for current question, answers, score, and quiz completion
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<{ [key: string]: string }>({});
  const [showResults, setShowResults] = useState(false);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [startTime, setStartTime] = useState<Date>(new Date());
  const [endTime, setEndTime] = useState<Date | null>(null);

  // Get current question
  const currentQuestion = quiz[currentQuestionIndex];

  // Calculate progress
  const progress = ((currentQuestionIndex + 1) / quiz.length) * 100;

  // Calculate score
  const calculateScore = () => {
    let correctCount = 0;
    quiz.forEach((question) => {
      if (answers[question.id] === question.correctAnswer) {
        correctCount += 1;
      }
    });
    return correctCount;
  };

  // Handle answer selection
  const handleSelect = (questionId: string, choice: string) => {
    setAnswers({ ...answers, [questionId]: choice });
  };

  // Move to next question
  const handleNext = () => {
    if (currentQuestionIndex < quiz.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      setEndTime(new Date());
      setShowResults(true);
    }
  };

  // Move to previous question
  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  // Submit quiz
  const handleSubmit = () => {
    setHasSubmitted(true);
    setEndTime(new Date());
    setShowResults(true);
  };

  // Restart quiz
  const handleRestart = () => {
    setAnswers({});
    setCurrentQuestionIndex(0);
    setShowResults(false);
    setHasSubmitted(false);
    setStartTime(new Date());
    setEndTime(null);
  };

  // Format time taken
  const formatTimeTaken = () => {
    if (!endTime) return "0m 0s";
    const seconds = Math.floor(
      (endTime.getTime() - startTime.getTime()) / 1000
    );
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
  };

  // Check if current question has been answered
  const isCurrentQuestionAnswered = !!answers[currentQuestion?.id];

  // Get result message based on score
  const getResultMessage = () => {
    const score = calculateScore();
    const percentage = (score / quiz.length) * 100;

    if (percentage >= 90) return "Excellent!";
    if (percentage >= 70) return "Good job!";
    if (percentage >= 50) return "Not bad!";
    return "Keep learning!";
  };

  // Render results screen
  if (showResults) {
    const score = calculateScore();
    const percentage = Math.round((score / quiz.length) * 100);

    return (
      <div className="w-full">
        <Card className="p-0 border-0 overflow-hidden dark:bg-slate-800 dark:border-slate-700">
          <div
            className="h-2 w-full"
            style={{
              backgroundColor:
                percentage >= 70
                  ? "rgb(64, 126, 139)"
                  : percentage >= 50
                  ? "rgb(255, 183, 98)"
                  : "rgb(240, 128, 128)",
            }}
          />
          <CardHeader className="text-center bg-gray-50 dark:bg-slate-800 pt-8 pb-6">
            <Award
              className="w-16 h-16 mx-auto mb-2"
              style={{ color: "rgb(64, 126, 139)" }}
            />
            <CardTitle className="text-2xl font-bold dark:text-white">
              {getResultMessage()}
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6 space-y-6">
            <div className="flex justify-between items-center">
              <div className="text-center p-4 bg-gray-50 dark:bg-slate-700 rounded-lg flex-1 mr-2">
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                  Score
                </p>
                <p
                  className="text-3xl font-bold"
                  style={{ color: "rgb(64, 126, 139)" }}
                >
                  {score}/{quiz.length}
                </p>
              </div>
              <div className="text-center p-4 bg-gray-50 dark:bg-slate-700 rounded-lg flex-1 ml-2">
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                  Time
                </p>
                <p
                  className="text-3xl font-bold"
                  style={{ color: "rgb(64, 126, 139)" }}
                >
                  {formatTimeTaken()}
                </p>
              </div>
            </div>

            <div className="text-center pt-2">
              <div className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                Percentage
              </div>
              <div className="relative h-6 mb-1">
                <Progress value={percentage} className="h-6" />
                <span className="absolute inset-0 flex items-center justify-center text-sm font-semibold text-white">
                  {percentage}%
                </span>
              </div>
            </div>

            {/* Question breakdown */}
            <div className="pt-4">
              <h3 className="text-md font-semibold mb-4 dark:text-white">
                Question Breakdown
              </h3>
              {quiz.map((question, index) => {
                const isCorrect =
                  answers[question.id] === question.correctAnswer;
                return (
                  <div
                    key={question.id}
                    className="flex items-start mb-3 p-3 rounded-md"
                    style={{
                      backgroundColor: isCorrect
                        ? "rgba(64, 126, 139, 0.1)"
                        : "rgba(240, 128, 128, 0.1)",
                    }}
                  >
                    <div className="mr-2 mt-1">
                      {isCorrect ? (
                        <CheckCircle className="h-5 w-5 text-green-300" />
                      ) : (
                        <XCircle className="h-5 w-5 text-red-400" />
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium dark:text-white">
                        {question.question}
                      </p>
                      <p className="text-xs mt-1 dark:text-gray-300">
                        <span className="font-medium">Your answer:</span>{" "}
                        {answers[question.id] || "Not answered"}
                      </p>
                      {!isCorrect && (
                        <p className="text-xs mt-1 text-green-600 dark:text-green-300">
                          <span className="font-medium">Correct answer:</span>{" "}
                          {question.correctAnswer}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
          <CardFooter className="bg-gray-50 dark:bg-slate-800 p-4 flex justify-center">
            <Button
              onClick={handleRestart}
              className="flex items-center text-white bg-primary/80 "
            >
              <RotateCcw className="h-4 w-4 mr-2" />
              Restart Quiz
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  // Render quiz question
  return (
    <div className="w-full">
      <Card className="shadow-lg border-0 dark:bg-slate-800 dark:border-slate-700">
        <div className="h-1 w-full bg-gray-200 dark:bg-gray-700">
          <div
            className="h-1 transition-all duration-300 ease-in-out bg-primary/80"
            style={{
              width: `${progress}%`,
            }}
          />
        </div>
        <CardHeader className="pb-3">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
              Question {currentQuestionIndex + 1} of {quiz.length}
            </span>
            <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
              <Clock className="h-4 w-4 mr-1" />
              <span>Quiz in progress</span>
            </div>
          </div>
          <CardTitle className="text-xl leading-tight dark:text-white">
            {currentQuestion?.question}
          </CardTitle>
        </CardHeader>
        <CardContent className="pb-6">
          <RadioGroup
            value={answers[currentQuestion?.id] || ""}
            onValueChange={(choice) =>
              handleSelect(currentQuestion?.id, choice)
            }
            className="space-y-3"
          >
            {currentQuestion?.choices.map((choice, i) => (
              <div
                key={i}
                className={`border-2  rounded-lg transition-all hover:border-gray-400 dark:hover:border-gray-500 ${
                  answers[currentQuestion?.id] === choice
                    ? "border-primary/30 dark:border-primary/50 bg-primary/10 dark:bg-primary/10"
                    : "border-gray-200 dark:border-gray-700"
                }`}
              >
                <Label
                  htmlFor={`choice-${i}`}
                  className="flex items-center p-3 cursor-pointer w-full dark:text-gray-200"
                >
                  <RadioGroupItem
                    value={choice}
                    id={`choice-${i}`}
                    className="mr-3"
                  />
                  <span className="text-sm font-medium">{choice}</span>
                </Label>
              </div>
            ))}
          </RadioGroup>
        </CardContent>
        <CardFooter className="bg-gray-50 dark:bg-slate-800 p-4 flex justify-between">
          <ScaledClick whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Button
              onClick={handlePrevious}
              variant="outline"
              disabled={currentQuestionIndex === 0}
              className="px-3 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-700"
            >
              Previous
            </Button>
          </ScaledClick>
          <div>
            <ScaledClick
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {currentQuestionIndex === quiz.length - 1 ? (
                <Button
                  onClick={handleSubmit}
                  disabled={
                    !Object.keys(answers).length ||
                    Object.keys(answers).length < quiz.length
                  }
                  className="text-white"
                  style={{ backgroundColor: "rgb(64, 126, 139)" }}
                >
                  Finish Quiz
                </Button>
              ) : (
                <Button
                  onClick={handleNext}
                  disabled={!isCurrentQuestionAnswered}
                  className="flex items-center text-white bg-primary/80 hover:bg-primary-dark"
                >
                  Next
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              )}
            </ScaledClick>
          </div>
        </CardFooter>
      </Card>

      {currentQuestionIndex === quiz.length - 1 && (
        <div className="mt-4 p-4 bg-yellow-50 dark:bg-yellow-900/30 rounded-md border border-yellow-200 dark:border-yellow-800">
          <p className="text-sm text-center text-yellow-800 dark:text-yellow-200">
            {Object.keys(answers).length < quiz.length
              ? `Please answer all questions before submitting (${
                  Object.keys(answers).length
                }/${quiz.length} answered)`
              : "You've answered all questions! Click 'Finish Quiz' to see your results."}
          </p>
        </div>
      )}
    </div>
  );
}
