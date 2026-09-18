import type { AxisId, Difficulty, Question } from "../../content/domain/contentSchemas";

export type SimuladoMode = "INSTANT_FEEDBACK" | "EXAM";

export type SimuladoFilters = {
  readonly axisId: "all" | AxisId;
  readonly difficulty: "all" | Difficulty;
  readonly questionCount: number;
  readonly mode: SimuladoMode;
};

export type PresentedOption = {
  readonly id: string;
  readonly text: string;
};

export type PresentedQuestion = {
  readonly question: Question;
  readonly presentedOptions?: readonly PresentedOption[] | undefined;
};

export type AnswerSubmission = {
  readonly questionId: string;
  readonly selectedOptionId?: string | undefined;
  readonly booleanAnswer?: boolean | undefined;
  readonly textAnswer?: string | undefined;
  readonly timeSpentSeconds: number;
};

export type EvaluationResult = {
  readonly questionId: string;
  readonly isCorrect: boolean;
  readonly explanation: string;
  readonly curricularUnits: readonly string[];
  readonly axisId: AxisId;
  readonly userAnswerDisplay: string;
  readonly correctAnswerDisplay: string;
};

export type AxisScoreSummary = {
  readonly total: number;
  readonly correct: number;
  readonly percentage: number;
};

export type SimuladoSummary = {
  readonly totalQuestions: number;
  readonly correctCount: number;
  readonly incorrectCount: number;
  readonly scorePercentage: number;
  readonly totalTimeSeconds: number;
  readonly performanceByAxis: Readonly<Record<AxisId, AxisScoreSummary>>;
  readonly missedQuestionIds: readonly string[];
};

export type SimuladoAttempt = {
  readonly id: string;
  readonly parentAttemptId?: string | undefined;
  readonly createdAt: string;
  readonly completedAt?: string | undefined;
  readonly filters: SimuladoFilters;
  readonly questions: readonly PresentedQuestion[];
  readonly answers: Readonly<Record<string, AnswerSubmission>>;
  readonly evaluations: Readonly<Record<string, EvaluationResult>>;
  readonly isCompleted: boolean;
  readonly summary?: SimuladoSummary | undefined;
};
