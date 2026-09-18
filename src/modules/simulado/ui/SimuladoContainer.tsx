import { useState } from "react";
import { bundledQuestionBank } from "../application/questionBank";
import { exportAttemptToCsv, importAttemptFromCsv } from "../application/simuladoCsv";
import {
  createAttempt,
  createReinforcementAttempt,
  finishAttempt,
  recordAnswer,
  toggleAttemptFlag,
  updateRemainingTime,
} from "../application/simuladoService";
import type { AnswerSubmission, SimuladoAttempt, SimuladoFilters } from "../domain/simuladoTypes";
import { downloadCsvFile } from "./browserDownload";
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

  const handleFinish = () => {
    if (!attempt) return;
    const completed = finishAttempt(attempt, browserAttemptStorage);
    setAttempt(completed);
  };

  const handleNext = () => {
    if (!attempt) return;
    const isLast = currentIndex >= attempt.questions.length - 1;
    if (isLast) {
      handleFinish();
    } else {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const handlePrevious = () => {
    setCurrentIndex((prev) => Math.max(0, prev - 1));
  };

  const handleJumpToQuestion = (index: number) => {
    setCurrentIndex(index);
  };

  const handleToggleFlag = (questionId: string) => {
    if (!attempt) return;
    const updated = toggleAttemptFlag(attempt, questionId, browserAttemptStorage);
    setAttempt(updated);
  };

  const handleTickRemainingSeconds = (seconds: number) => {
    if (!attempt) return;
    const updated = updateRemainingTime(attempt, seconds, browserAttemptStorage);
    setAttempt(updated);
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

  const handleExportProgress = () => {
    if (!attempt) return;
    const csv = exportAttemptToCsv(attempt);
    downloadCsvFile(`simulado-progresso-${attempt.id}.csv`, csv);
  };

  const handleImportProgress = (csvText: string) => {
    const imported = importAttemptFromCsv(csvText, bundledQuestionBank);
    browserAttemptStorage.save(imported);
    setAttempt(imported);
    const firstUnanswered = imported.questions.findIndex((q) => !imported.answers[q.question.id]);
    setCurrentIndex(firstUnanswered >= 0 ? firstUnanswered : 0);
  };

  const currentItem = attempt?.questions[currentIndex];

  const paletteItems = attempt?.questions.map((q, idx) => {
    const qId = q.question.id;
    return {
      index: idx,
      questionId: qId,
      isAnswered: Boolean(attempt.answers[qId]),
      isFlagged: Boolean(attempt.flaggedQuestionIds?.includes(qId)),
      isCurrent: idx === currentIndex,
    };
  });

  return (
    <div className="sim-container">
      {!attempt ? (
        <SimuladoSetup
          bank={bundledQuestionBank}
          onStart={handleStart}
          hasSavedAttempt={hasSavedAttempt}
          onResumeSaved={handleResumeSaved}
          onImportProgress={handleImportProgress}
        />
      ) : attempt.isCompleted ? (
        <SimuladoResults
          attempt={attempt}
          onRetryMissed={handleRetryMissed}
          onRestartNew={handleRestartNew}
          onExportProgress={handleExportProgress}
        />
      ) : currentItem ? (
        <QuestionRunner
          item={currentItem}
          currentIndex={currentIndex}
          totalQuestions={attempt.questions.length}
          mode={attempt.filters.mode}
          existingAnswer={attempt.answers[currentItem.question.id]}
          existingEvaluation={attempt.evaluations[currentItem.question.id]}
          isFlagged={attempt.flaggedQuestionIds?.includes(currentItem.question.id)}
          timeLimitMinutes={attempt.filters.timeLimitMinutes}
          remainingSeconds={attempt.remainingSeconds}
          paletteItems={paletteItems}
          onAnswer={handleAnswer}
          onNext={handleNext}
          onPrevious={handlePrevious}
          onJumpToQuestion={handleJumpToQuestion}
          onToggleFlag={() => handleToggleFlag(currentItem.question.id)}
          onTickRemainingSeconds={handleTickRemainingSeconds}
          onFinish={handleFinish}
          isLastQuestion={currentIndex === attempt.questions.length - 1}
          onExportProgress={handleExportProgress}
        />
      ) : null}
    </div>
  );
}
