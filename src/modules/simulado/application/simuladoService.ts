import type { Question } from "../../content/domain/contentSchemas";
import {
  buildReinforcementQuestions,
  calculateSummary,
  evaluateAnswer,
  filterQuestions,
  preparePresentedQuestions,
} from "../domain/simuladoEngine";
import type { AnswerSubmission, SimuladoAttempt, SimuladoFilters } from "../domain/simuladoTypes";
import { bundledQuestionBank } from "./questionBank";

export type AttemptStorage = {
  readonly save: (attempt: SimuladoAttempt) => void;
  readonly load: () => SimuladoAttempt | null;
  readonly clear: () => void;
};

function generateAttemptId(): string {
  return `attempt-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 7)}`;
}

export function createAttempt(
  filters: SimuladoFilters,
  bank: readonly Question[] = bundledQuestionBank,
  storage?: AttemptStorage,
): SimuladoAttempt {
  const filtered = filterQuestions(bank, filters);
  if (filtered.length === 0) {
    throw new Error("Nenhuma questão atende aos filtros selecionados.");
  }

  const requestedCount = Math.min(filters.questionCount, filtered.length);
  const presentedQuestions = preparePresentedQuestions(filtered, requestedCount);

  const attempt: SimuladoAttempt = {
    id: generateAttemptId(),
    createdAt: new Date().toISOString(),
    filters,
    questions: presentedQuestions,
    answers: {},
    evaluations: {},
    isCompleted: false,
  };

  storage?.save(attempt);
  return attempt;
}

export function recordAnswer(
  attempt: SimuladoAttempt,
  submission: AnswerSubmission,
  storage?: AttemptStorage,
): SimuladoAttempt {
  const targetItem = attempt.questions.find((q) => q.question.id === submission.questionId);
  if (!targetItem) {
    throw new Error(`Questão ${submission.questionId} não pertence a esta tentativa.`);
  }

  const evaluation = evaluateAnswer(targetItem.question, submission);

  const updatedAnswers = {
    ...attempt.answers,
    [submission.questionId]: submission,
  };

  const updatedEvaluations = {
    ...attempt.evaluations,
    [submission.questionId]: evaluation,
  };

  const updatedAttempt: SimuladoAttempt = {
    ...attempt,
    answers: updatedAnswers,
    evaluations: updatedEvaluations,
  };

  storage?.save(updatedAttempt);
  return updatedAttempt;
}

export function finishAttempt(attempt: SimuladoAttempt, storage?: AttemptStorage): SimuladoAttempt {
  const summary = calculateSummary(attempt.questions, attempt.answers, attempt.evaluations);

  const completedAttempt: SimuladoAttempt = {
    ...attempt,
    isCompleted: true,
    completedAt: new Date().toISOString(),
    summary,
  };

  storage?.save(completedAttempt);
  return completedAttempt;
}

export function createReinforcementAttempt(
  previousAttempt: SimuladoAttempt,
  bank: readonly Question[] = bundledQuestionBank,
  storage?: AttemptStorage,
): SimuladoAttempt {
  const missedIds = previousAttempt.summary?.missedQuestionIds ?? [];
  if (missedIds.length === 0) {
    throw new Error("Não há questões incorretas para reforço nesta tentativa.");
  }

  const reinforcementQuestions = buildReinforcementQuestions(bank, missedIds);

  const newAttempt: SimuladoAttempt = {
    id: generateAttemptId(),
    parentAttemptId: previousAttempt.id,
    createdAt: new Date().toISOString(),
    filters: {
      ...previousAttempt.filters,
      questionCount: reinforcementQuestions.length,
    },
    questions: reinforcementQuestions,
    answers: {},
    evaluations: {},
    isCompleted: false,
  };

  storage?.save(newAttempt);
  return newAttempt;
}
