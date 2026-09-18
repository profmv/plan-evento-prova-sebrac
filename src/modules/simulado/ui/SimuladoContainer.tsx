import { useState } from "react";
import { bundledQuestionBank } from "../application/questionBank";
import {
  createAttempt,
  createReinforcementAttempt,
  finishAttempt,
  recordAnswer,
} from "../application/simuladoService";
import type { AnswerSubmission, SimuladoAttempt, SimuladoFilters } from "../domain/simuladoTypes";
import { browserAttemptStorage } from "./browserStorage";
import { QuestionRunner } from "./QuestionRunner";
import { SimuladoResults } from "./SimuladoResults";
import { SimuladoSetup } from "./SimuladoSetup";
import "./simulado.css";

export function SimuladoContainer() {
  const [attempt, setAttempt] = useState<SimuladoAttempt | null>(() => {
    return browserAttemptStorage.load();
  });
  const [currentIndex, setCurrentIndex] = useState<number>(() => {
    const saved = browserAttemptStorage.load();
    if (saved && !saved.isCompleted) {
      const firstUnanswered = saved.questions.findIndex((q) => !saved.answers[q.question.id]);
      return firstUnanswered >= 0 ? firstUnanswered : 0;
    }
    return 0;
  });

  const hasSavedAttempt = attempt !== null && !attempt.isCompleted;

  const handleStart = (filters: SimuladoFilters) => {
    try {
      const newAttempt = createAttempt(filters, bundledQuestionBank, browserAttemptStorage);
      setAttempt(newAttempt);
      setCurrentIndex(0);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Não foi possível iniciar o simulado.");
    }
  };

  const handleResumeSaved = () => {
    const saved = browserAttemptStorage.load();
    if (saved) {
      setAttempt(saved);
      // Find first unanswered question or default to 0
      const firstUnanswered = saved.questions.findIndex((q) => !saved.answers[q.question.id]);
      setCurrentIndex(firstUnanswered >= 0 ? firstUnanswered : 0);
    }
  };

  const handleAnswer = (submission: AnswerSubmission) => {
    if (!attempt) return;
    const updated = recordAnswer(attempt, submission, browserAttemptStorage);
    setAttempt(updated);
  };

  const handleNext = () => {
    if (!attempt) return;
    const isLast = currentIndex >= attempt.questions.length - 1;
    if (isLast) {
      const completed = finishAttempt(attempt, browserAttemptStorage);
      setAttempt(completed);
    } else {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const handlePrevious = () => {
    setCurrentIndex((prev) => Math.max(0, prev - 1));
  };

  const handleRetryMissed = () => {
    if (!attempt) return;
    try {
      const retryAttempt = createReinforcementAttempt(
        attempt,
        bundledQuestionBank,
        browserAttemptStorage,
      );
      setAttempt(retryAttempt);
      setCurrentIndex(0);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Não há questões erradas para reforço.");
    }
  };

  const handleRestartNew = () => {
    browserAttemptStorage.clear();
    setAttempt(null);
    setCurrentIndex(0);
  };

  const currentItem = attempt?.questions[currentIndex];

  return (
    <div className="sim-container">
      {!attempt ? (
        <SimuladoSetup
          bank={bundledQuestionBank}
          onStart={handleStart}
          hasSavedAttempt={hasSavedAttempt}
          onResumeSaved={handleResumeSaved}
        />
      ) : attempt.isCompleted ? (
        <SimuladoResults
          attempt={attempt}
          onRetryMissed={handleRetryMissed}
          onRestartNew={handleRestartNew}
        />
      ) : currentItem ? (
        <QuestionRunner
          item={currentItem}
          currentIndex={currentIndex}
          totalQuestions={attempt.questions.length}
          mode={attempt.filters.mode}
          existingAnswer={attempt.answers[currentItem.question.id]}
          existingEvaluation={attempt.evaluations[currentItem.question.id]}
          onAnswer={handleAnswer}
          onNext={handleNext}
          onPrevious={handlePrevious}
          isLastQuestion={currentIndex === attempt.questions.length - 1}
        />
      ) : null}
    </div>
  );
}
