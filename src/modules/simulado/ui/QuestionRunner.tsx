import { useEffect, useState } from "react";
import type {
  AnswerSubmission,
  EvaluationResult,
  PresentedQuestion,
  SimuladoMode,
} from "../domain/simuladoTypes";
import { QuestionBanner } from "./QuestionBanner";

type QuestionRunnerProps = {
  readonly item: PresentedQuestion;
  readonly currentIndex: number;
  readonly totalQuestions: number;
  readonly mode: SimuladoMode;
  readonly existingAnswer?: AnswerSubmission | undefined;
  readonly existingEvaluation?: EvaluationResult | undefined;
  readonly onAnswer: (submission: AnswerSubmission) => void;
  readonly onNext: () => void;
  readonly onPrevious: () => void;
  readonly isLastQuestion: boolean;
};

const OPTION_LETTERS = ["A", "B", "C", "D", "E", "F"];

export function QuestionRunner({
  item,
  currentIndex,
  totalQuestions,
  mode,
  existingAnswer,
  existingEvaluation,
  onAnswer,
  onNext,
  onPrevious,
  isLastQuestion,
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

  // Sync state when question changes
  useEffect(() => {
    setSelectedOptionId(existingAnswer?.selectedOptionId ?? "");
    setBooleanAnswer(existingAnswer?.booleanAnswer);
    setTextAnswer(existingAnswer?.textAnswer ?? "");
    setSeconds(existingAnswer?.timeSpentSeconds ?? 0);
  }, [existingAnswer]);

  // Question timer
  useEffect(() => {
    if (existingEvaluation) return;
    const interval = setInterval(() => {
      setSeconds((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [existingEvaluation]);

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

  const progressPercent = Math.round(((currentIndex + 1) / totalQuestions) * 100);

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
        <div className="sim-runner__timer" aria-live="polite">
          <span className="sim-timer-tag">
            Tempo nesta questão: <strong>{seconds}s</strong>
          </span>
        </div>

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
            <button className="button button--primary" type="button" onClick={onNext}>
              {isLastQuestion ? "Finalizar simulado" : "Próxima questão"}
            </button>
          )}
        </footer>
      </div>
    </article>
  );
}
