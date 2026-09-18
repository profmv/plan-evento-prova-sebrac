import type { AxisId, Question } from "../../content/domain/contentSchemas";
import type {
  AnswerSubmission,
  AxisScoreSummary,
  EvaluationResult,
  PresentedOption,
  PresentedQuestion,
  SimuladoFilters,
  SimuladoSummary,
} from "./simuladoTypes";

export function shuffleArray<T>(items: readonly T[], randomFn = Math.random): T[] {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(randomFn() * (i + 1));
    const itemI = result[i];
    const itemJ = result[j];
    if (itemI !== undefined && itemJ !== undefined) {
      result[i] = itemJ;
      result[j] = itemI;
    }
  }
  return result;
}

export function filterQuestions(
  allQuestions: readonly Question[],
  filters: Pick<SimuladoFilters, "axisId" | "difficulty">,
): Question[] {
  return allQuestions.filter((question) => {
    if (filters.axisId !== "all" && question.axisId !== filters.axisId) {
      return false;
    }
    if (filters.difficulty !== "all" && question.difficulty !== filters.difficulty) {
      return false;
    }
    return true;
  });
}

export function preparePresentedQuestions(
  questions: readonly Question[],
  count: number,
  randomFn = Math.random,
): PresentedQuestion[] {
  const shuffledQuestions = shuffleArray(questions, randomFn);
  const selected = shuffledQuestions.slice(0, count);

  return selected.map((question) => {
    if (question.type === "MULTIPLE_CHOICE") {
      const shuffledOptions: PresentedOption[] = shuffleArray(
        question.options.map((opt) => ({ id: opt.id, text: opt.text })),
        randomFn,
      );
      return {
        question,
        presentedOptions: shuffledOptions,
      };
    }
    return {
      question,
    };
  });
}

export function normalizeText(
  input: string,
  options: {
    readonly trimWhitespace: boolean;
    readonly collapseWhitespace: boolean;
    readonly ignoreCase: boolean;
    readonly ignoreDiacritics: boolean;
    readonly ignorePunctuation: boolean;
  },
): string {
  let result = input;
  if (options.trimWhitespace) {
    result = result.trim();
  }
  if (options.collapseWhitespace) {
    result = result.replace(/\s+/g, " ");
  }
  if (options.ignoreCase) {
    result = result.toLowerCase();
  }
  if (options.ignoreDiacritics) {
    result = result.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  }
  if (options.ignorePunctuation) {
    result = result.replace(/[.,/#!$%^&*;:{}=\-_`~()?]/g, "");
  }
  return result;
}

export function evaluateAnswer(question: Question, submission: AnswerSubmission): EvaluationResult {
  if (question.type === "MULTIPLE_CHOICE") {
    const isCorrect = submission.selectedOptionId === question.correctOptionId;
    const chosen = question.options.find((opt) => opt.id === submission.selectedOptionId);
    const correct = question.options.find((opt) => opt.id === question.correctOptionId);

    return {
      questionId: question.id,
      isCorrect,
      explanation: question.explanation,
      curricularUnits: question.unitIds,
      axisId: question.axisId,
      userAnswerDisplay: chosen ? chosen.text : "Não respondida",
      correctAnswerDisplay: correct ? correct.text : "Alternativa correta",
    };
  }

  if (question.type === "TRUE_FALSE") {
    const isCorrect = submission.booleanAnswer === question.correctAnswer;
    const userDisplay =
      submission.booleanAnswer === undefined
        ? "Não respondida"
        : submission.booleanAnswer
          ? "Verdadeiro"
          : "Falso";
    const correctDisplay = question.correctAnswer ? "Verdadeiro" : "Falso";

    return {
      questionId: question.id,
      isCorrect,
      explanation: question.explanation,
      curricularUnits: question.unitIds,
      axisId: question.axisId,
      userAnswerDisplay: userDisplay,
      correctAnswerDisplay: correctDisplay,
    };
  }

  if (question.type === "SHORT_ANSWER") {
    const userRaw = submission.textAnswer ?? "";
    const normalizedUser = normalizeText(userRaw, question.normalization);

    const isCorrect = question.acceptedAnswers.some((accepted) => {
      const normalizedAccepted = normalizeText(accepted, question.normalization);
      return normalizedUser === normalizedAccepted;
    });

    return {
      questionId: question.id,
      isCorrect,
      explanation: question.explanation,
      curricularUnits: question.unitIds,
      axisId: question.axisId,
      userAnswerDisplay: userRaw.trim() ? userRaw : "Não respondida",
      correctAnswerDisplay: question.acceptedAnswers[0] ?? "",
    };
  }

  throw new Error(`Tipo de questão não suportado: ${(question as Question).type}`);
}

export function calculateSummary(
  presentedQuestions: readonly PresentedQuestion[],
  answers: Readonly<Record<string, AnswerSubmission>>,
  evaluations: Readonly<Record<string, EvaluationResult>>,
): SimuladoSummary {
  let correctCount = 0;
  let totalTimeSeconds = 0;
  const missedQuestionIds: string[] = [];

  const axes: Record<AxisId, { total: number; correct: number }> = {
    support: { total: 0, correct: 0 },
    networks: { total: 0, correct: 0 },
    development: { total: 0, correct: 0 },
  };

  for (const item of presentedQuestions) {
    const qId = item.question.id;
    const axis = item.question.axisId;
    axes[axis].total += 1;

    const evaluation = evaluations[qId];
    if (evaluation?.isCorrect) {
      correctCount += 1;
      axes[axis].correct += 1;
    } else {
      missedQuestionIds.push(qId);
    }

    const answer = answers[qId];
    if (answer) {
      totalTimeSeconds += answer.timeSpentSeconds;
    }
  }

  const totalQuestions = presentedQuestions.length;
  const incorrectCount = totalQuestions - correctCount;
  const scorePercentage =
    totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 0;

  const performanceByAxis = (Object.keys(axes) as AxisId[]).reduce<
    Record<AxisId, AxisScoreSummary>
  >(
    (acc, axisId) => {
      const current = axes[axisId];
      acc[axisId] = {
        total: current.total,
        correct: current.correct,
        percentage: current.total > 0 ? Math.round((current.correct / current.total) * 100) : 0,
      };
      return acc;
    },
    {} as Record<AxisId, AxisScoreSummary>,
  );

  return {
    totalQuestions,
    correctCount,
    incorrectCount,
    scorePercentage,
    totalTimeSeconds,
    performanceByAxis,
    missedQuestionIds,
  };
}

export function buildReinforcementQuestions(
  allOriginalQuestions: readonly Question[],
  missedQuestionIds: readonly string[],
  randomFn = Math.random,
): PresentedQuestion[] {
  const missedMap = new Set(missedQuestionIds);
  const eligibleQuestions = allOriginalQuestions.filter((q) => missedMap.has(q.id));
  return preparePresentedQuestions(eligibleQuestions, eligibleQuestions.length, randomFn);
}

export function toggleFlagQuestion(
  currentFlagged: readonly string[] | undefined,
  questionId: string,
): readonly string[] {
  const flags = new Set(currentFlagged ?? []);
  if (flags.has(questionId)) {
    flags.delete(questionId);
  } else {
    flags.add(questionId);
  }
  return Array.from(flags);
}
