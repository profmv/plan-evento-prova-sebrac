import { useEffect, useState } from "react";
import type {
  AnswerSubmission,
  EvaluationResult,
  PresentedQuestion,
  SimuladoMode,
} from "../domain/simuladoTypes";
import { QuestionBanner } from "./QuestionBanner";

export type QuestionPaletteItem = {
  readonly index: number;
  readonly questionId: string;
  readonly isAnswered: boolean;
  readonly isFlagged: boolean;
  readonly isCurrent: boolean;
};

type QuestionRunnerProps = {
  readonly item: PresentedQuestion;
  readonly currentIndex: number;
  readonly totalQuestions: number;
  readonly mode: SimuladoMode;
  readonly existingAnswer?: AnswerSubmission | undefined;
  readonly existingEvaluation?: EvaluationResult | undefined;
  readonly isFlagged?: boolean | undefined;
  readonly timeLimitMinutes?: number | undefined;
  readonly remainingSeconds?: number | undefined;
  readonly paletteItems?: readonly QuestionPaletteItem[] | undefined;
  readonly onAnswer: (submission: AnswerSubmission) => void;
  readonly onNext: () => void;
  readonly onPrevious: () => void;
  readonly onJumpToQuestion?: ((index: number) => void) | undefined;
  readonly onToggleFlag?: (() => void) | undefined;
  readonly onTickRemainingSeconds?: ((seconds: number) => void) | undefined;
  readonly onFinish?: (() => void) | undefined;
  readonly isLastQuestion: boolean;
  readonly onExportProgress?: (() => void) | undefined;
};

const OPTION_LETTERS = ["A", "B", "C", "D", "E", "F"];

function formatCountdown(totalSec: number): string {
  const safeSec = Math.max(0, totalSec);
  const h = Math.floor(safeSec / 3600);
  const m = Math.floor((safeSec % 3600) / 60);
  const s = safeSec % 60;
  if (h > 0) {
    return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  }
  return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
}

export function QuestionRunner({
  item,
  currentIndex,
  totalQuestions,
  mode,
  existingAnswer,
  existingEvaluation,
  isFlagged = false,
  timeLimitMinutes,
  remainingSeconds: initialRemainingSeconds,
  paletteItems,
  onAnswer,
  onNext,
  onPrevious,
  onJumpToQuestion,
  onToggleFlag,
  onTickRemainingSeconds,
  onFinish,
  isLastQuestion,
  onExportProgress,
}: QuestionRunnerProps) {
  const { question, presentedOptions } = item;

  const [selectedOptionId, setSelectedOptionId] = useState<string>(
    existingAnswer?.selectedOptionId ?? "",
  );
  const [booleanAnswer, setBooleanAnswer] = useState<boolean | undefined>(
    existingAnswer?.booleanAnswer,
  );
  const [textAnswer, setTextAnswer] = useState<string>(existingAnswer?.textAnswer ?? "");
  const [seconds, setSeconds] = useState<number>(existingAnswer?.timeSpentSeconds ?? 0);
  const [isPaletteOpen, setIsPaletteOpen] = useState<boolean>(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState<boolean>(false);

  // Global countdown state
  const hasCountdown = Boolean(timeLimitMinutes && timeLimitMinutes > 0);
  const [countdown, setCountdown] = useState<number>(
    initialRemainingSeconds ?? (timeLimitMinutes ? timeLimitMinutes * 60 : 0),
  );

  // Sync state when question changes
  useEffect(() => {
    setSelectedOptionId(existingAnswer?.selectedOptionId ?? "");
    setBooleanAnswer(existingAnswer?.booleanAnswer);
    setTextAnswer(existingAnswer?.textAnswer ?? "");
    setSeconds(existingAnswer?.timeSpentSeconds ?? 0);
  }, [existingAnswer]);

  // Per-question elapsed timer
  useEffect(() => {
    if (existingEvaluation) return;
    const interval = setInterval(() => {
      setSeconds((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [existingEvaluation]);

  // Global countdown timer
  useEffect(() => {
    if (!hasCountdown) return;

    const interval = setInterval(() => {
      setCountdown((prev) => {
        const next = prev - 1;
        onTickRemainingSeconds?.(Math.max(0, next));
        if (next <= 0) {
          clearInterval(interval);
          onFinish?.();
          return 0;
        }
        return next;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [hasCountdown, onFinish, onTickRemainingSeconds]);

  const hasAnswered = existingEvaluation !== undefined;

  const handleConfirm = () => {
    if (question.type === "MULTIPLE_CHOICE" && !selectedOptionId) return;
    if (question.type === "TRUE_FALSE" && booleanAnswer === undefined) return;
    if (question.type === "SHORT_ANSWER" && !textAnswer.trim()) return;

    onAnswer({
      questionId: question.id,
      selectedOptionId: question.type === "MULTIPLE_CHOICE" ? selectedOptionId : undefined,
      booleanAnswer: question.type === "TRUE_FALSE" ? booleanAnswer : undefined,
      textAnswer: question.type === "SHORT_ANSWER" ? textAnswer : undefined,
      timeSpentSeconds: seconds,
    });
  };

  const answeredCount = paletteItems?.filter((p) => p.isAnswered).length ?? 0;
  const unansweredCount = totalQuestions - answeredCount;
  const flaggedCount = paletteItems?.filter((p) => p.isFlagged).length ?? 0;

  const handleFinishAttempt = () => {
    if (unansweredCount > 0 || flaggedCount > 0) {
      setIsConfirmModalOpen(true);
    } else if (onFinish) {
      onFinish();
    } else {
      onNext();
    }
  };

  const progressPercent = Math.round(((currentIndex + 1) / totalQuestions) * 100);

  let countdownUrgencyClass = "sim-countdown--normal";
  if (hasCountdown) {
    if (countdown <= 300) {
      countdownUrgencyClass = "sim-countdown--critical";
    } else if (countdown <= 900) {
      countdownUrgencyClass = "sim-countdown--warning";
    }
  }

  return (
    <article className="sim-runner" aria-labelledby="question-prompt">
      <QuestionBanner
        question={question}
        currentIndex={currentIndex}
        totalQuestions={totalQuestions}
      />

      <div
        className="sim-progress-bar"
        role="progressbar"
        aria-valuenow={progressPercent}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={`Progresso: questão ${currentIndex + 1} de ${totalQuestions}`}
      >
        <div className="sim-progress-bar__fill" style={{ width: `${progressPercent}%` }} />
      </div>

      <div className="sim-runner__body">
        <div className="sim-runner__meta-bar">
          <div className="sim-runner__timers" aria-live="polite">
            <span className="sim-timer-tag">
              Tempo nesta questão: <strong>{seconds}s</strong>
            </span>
            {hasCountdown ? (
              <span className={`sim-timer-tag sim-timer-countdown ${countdownUrgencyClass}`}>
                Tempo restante: <strong>{formatCountdown(countdown)}</strong>
              </span>
            ) : null}
          </div>

          <div className="sim-runner__quick-tools">
            <button
              type="button"
              className={`sim-flag-btn ${isFlagged ? "sim-flag-btn--active" : ""}`}
              onClick={onToggleFlag}
              title="Marcar questão para revisar antes da entrega final"
            >
              <span aria-hidden="true">{isFlagged ? "★" : "☆"}</span>
              <span>{isFlagged ? "Marcada para revisão" : "Marcar para revisão"}</span>
            </button>

            {onExportProgress ? (
              <button type="button" className="sim-flag-btn" onClick={onExportProgress}>
                Exportar progresso (.csv)
              </button>
            ) : null}

            {paletteItems && paletteItems.length > 0 ? (
              <button
                type="button"
                aria-expanded={isPaletteOpen}
                className="sim-palette-toggle-btn"
                onClick={() => setIsPaletteOpen((prev) => !prev)}
              >
                <span>
                  Paleta ({answeredCount}/{totalQuestions})
                </span>
                <span aria-hidden="true">{isPaletteOpen ? "▲" : "▼"}</span>
              </button>
            ) : null}
          </div>
        </div>

        {isPaletteOpen && paletteItems ? (
          <aside
            className="sim-palette-drawer"
            aria-label="Navegação rápida pelas questões do exame"
          >
            <div className="sim-palette-drawer__header">
              <strong>Mapa de Questões da Prova</strong>
              <small>Clique em qualquer número para ir direto à questão</small>
            </div>
            <div className="sim-palette-drawer__grid">
              {paletteItems.map((p) => {
                let statusClass = "";
                if (p.isCurrent) statusClass = "sim-palette-item--current";
                else if (p.isAnswered) statusClass = "sim-palette-item--answered";
                else statusClass = "sim-palette-item--unanswered";

                return (
                  <button
                    key={p.questionId}
                    type="button"
                    className={`sim-palette-item ${statusClass} ${p.isFlagged ? "sim-palette-item--flagged" : ""}`}
                    onClick={() => {
                      onJumpToQuestion?.(p.index);
                      setIsPaletteOpen(false);
                    }}
                    aria-label={`Questão ${p.index + 1}${p.isCurrent ? ", atual" : ""}${p.isAnswered ? ", respondida" : ", em branco"}${p.isFlagged ? ", marcada para revisão" : ""}`}
                  >
                    <span>{p.index + 1}</span>
                    {p.isFlagged ? (
                      <span className="sim-palette-item__flag-dot" aria-hidden="true">
                        ★
                      </span>
                    ) : null}
                  </button>
                );
              })}
            </div>
            <div className="sim-palette-drawer__legend">
              <span>
                <span className="legend-dot legend-dot--current" /> Atual
              </span>
              <span>
                <span className="legend-dot legend-dot--answered" /> Respondida
              </span>
              <span>
                <span className="legend-dot legend-dot--unanswered" /> Em branco
              </span>
              <span>
                <span className="legend-dot legend-dot--flagged" /> Revisar
              </span>
            </div>
          </aside>
        ) : null}

        <h2 id="question-prompt" className="sim-prompt">
          {question.prompt}
        </h2>

        <div className="sim-interactive-zone">
          {question.type === "MULTIPLE_CHOICE" && presentedOptions ? (
            <div className="sim-options-grid">
              {presentedOptions.map((opt, idx) => {
                const letter = OPTION_LETTERS[idx] ?? `${idx + 1}`;
                const isSelected = selectedOptionId === opt.id;
                let stateClass = "";

                if (hasAnswered && mode === "INSTANT_FEEDBACK") {
                  if (opt.id === question.correctOptionId) {
                    stateClass = "sim-option-card--correct";
                  } else if (isSelected) {
                    stateClass = "sim-option-card--wrong";
                  }
                } else if (isSelected) {
                  stateClass = "sim-option-card--selected";
                }

                return (
                  <button
                    key={opt.id}
                    type="button"
                    aria-pressed={isSelected}
                    disabled={hasAnswered && mode === "INSTANT_FEEDBACK"}
                    className={`sim-option-card ${stateClass}`}
                    onClick={() => setSelectedOptionId(opt.id)}
                  >
                    <span className="sim-option-card__letter" aria-hidden="true">
                      {letter}
                    </span>
                    <span className="sim-option-card__text">{opt.text}</span>
                  </button>
                );
              })}
            </div>
          ) : null}

          {question.type === "TRUE_FALSE" ? (
            <div className="sim-tf-grid">
              <button
                type="button"
                aria-pressed={booleanAnswer === true}
                disabled={hasAnswered && mode === "INSTANT_FEEDBACK"}
                className={`sim-tf-card ${booleanAnswer === true ? "sim-tf-card--selected" : ""}`}
                onClick={() => setBooleanAnswer(true)}
              >
                <span className="sim-tf-card__icon" aria-hidden="true">
                  V
                </span>
                <strong>Verdadeiro</strong>
              </button>
              <button
                type="button"
                aria-pressed={booleanAnswer === false}
                disabled={hasAnswered && mode === "INSTANT_FEEDBACK"}
                className={`sim-tf-card ${booleanAnswer === false ? "sim-tf-card--selected" : ""}`}
                onClick={() => setBooleanAnswer(false)}
              >
                <span className="sim-tf-card__icon" aria-hidden="true">
                  F
                </span>
                <strong>Falso</strong>
              </button>
            </div>
          ) : null}

          {question.type === "SHORT_ANSWER" ? (
            <div className="sim-short-answer-box">
              <label htmlFor="input-short-answer">
                <strong>Digite sua resposta curta:</strong>
              </label>
              <input
                id="input-short-answer"
                type="text"
                autoComplete="off"
                disabled={hasAnswered && mode === "INSTANT_FEEDBACK"}
                placeholder="Exemplo de comando, termo ou sintaxe..."
                value={textAnswer}
                onChange={(e) => setTextAnswer(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !hasAnswered) {
                    e.preventDefault();
                    handleConfirm();
                  }
                }}
              />
            </div>
          ) : null}
        </div>

        {hasAnswered && mode === "INSTANT_FEEDBACK" && existingEvaluation ? (
          <section
            className={`sim-feedback-card ${
              existingEvaluation.isCorrect
                ? "sim-feedback-card--success"
                : "sim-feedback-card--incorrect"
            }`}
            aria-live="polite"
          >
            <div className="sim-feedback-card__header">
              <span className="sim-feedback-tag">
                {existingEvaluation.isCorrect ? "Resposta Correta" : "Resposta Incorreta"}
              </span>
            </div>
            <p className="sim-feedback-card__explanation">
              <strong>Explicação técnica:</strong> {existingEvaluation.explanation}
            </p>
            {!existingEvaluation.isCorrect ? (
              <p className="sim-feedback-card__expected">
                <strong>Resposta esperada:</strong> {existingEvaluation.correctAnswerDisplay}
              </p>
            ) : null}
          </section>
        ) : null}

        <footer className="sim-runner__actions">
          <button
            className="button button--secondary"
            type="button"
            onClick={onPrevious}
            disabled={currentIndex === 0}
          >
            Voltar
          </button>

          {!hasAnswered ? (
            <button
              className="button button--primary"
              type="button"
              onClick={handleConfirm}
              disabled={
                (question.type === "MULTIPLE_CHOICE" && !selectedOptionId) ||
                (question.type === "TRUE_FALSE" && booleanAnswer === undefined) ||
                (question.type === "SHORT_ANSWER" && !textAnswer.trim())
              }
            >
              Confirmar resposta
            </button>
          ) : (
            <button
              className="button button--primary"
              type="button"
              onClick={isLastQuestion ? handleFinishAttempt : onNext}
            >
              {isLastQuestion ? "Finalizar simulado" : "Próxima questão"}
            </button>
          )}

          {mode === "EXAM" && !isLastQuestion ? (
            <button
              className="button button--secondary sim-finish-shortcut"
              type="button"
              onClick={handleFinishAttempt}
            >
              Finalizar exame agora
            </button>
          ) : null}
        </footer>
      </div>

      {isConfirmModalOpen ? (
        <div
          className="sim-modal-overlay"
          role="dialog"
          aria-modal="true"
          aria-labelledby="confirm-finish-title"
        >
          <div className="sim-modal-card">
            <h3 id="confirm-finish-title">Confirmar Entrega da Prova</h3>
            <p className="sim-modal-desc">
              Revise a situação das suas questões antes de finalizar o exame e gerar a pontuação.
            </p>
            <div className="sim-modal-stats">
              <div className="sim-modal-stat-row">
                <span>Respondidas:</span>
                <strong>
                  {answeredCount} de {totalQuestions}
                </strong>
              </div>
              {unansweredCount > 0 ? (
                <div className="sim-modal-stat-row sim-modal-stat-row--warn">
                  <span>Em branco / Sem resposta:</span>
                  <strong>{unansweredCount} questão(ões)</strong>
                </div>
              ) : null}
              {flaggedCount > 0 ? (
                <div className="sim-modal-stat-row sim-modal-stat-row--flag">
                  <span>Marcadas para revisão:</span>
                  <strong>{flaggedCount} questão(ões)</strong>
                </div>
              ) : null}
            </div>
            <div className="sim-modal-actions">
              <button
                type="button"
                className="button button--secondary"
                onClick={() => {
                  setIsConfirmModalOpen(false);
                  setIsPaletteOpen(true);
                }}
              >
                Voltar e revisar pendências
              </button>
              <button
                type="button"
                className="button button--primary"
                onClick={() => {
                  setIsConfirmModalOpen(false);
                  if (onFinish) {
                    onFinish();
                  } else {
                    onNext();
                  }
                }}
              >
                Confirmar entrega final
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </article>
  );
}
