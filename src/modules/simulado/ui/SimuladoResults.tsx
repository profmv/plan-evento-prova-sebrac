import { useState } from "react";
import type { AxisId } from "../../content/domain/contentSchemas";
import type { SimuladoAttempt } from "../domain/simuladoTypes";
import { CertificateModal } from "./CertificateModal";

type SimuladoResultsProps = {
  readonly attempt: SimuladoAttempt;
  readonly onRetryMissed: () => void;
  readonly onRestartNew: () => void;
  readonly onExportProgress?: (() => void) | undefined;
};

const AXIS_TITLES: Record<AxisId, string> = {
  support: "Suporte e Manutenção",
  networks: "Redes e Servidores",
  development: "Desenvolvimento de Aplicativos",
};

export function SimuladoResults({
  attempt,
  onRetryMissed,
  onRestartNew,
  onExportProgress,
}: SimuladoResultsProps) {
  const [showCertificate, setShowCertificate] = useState(false);
  const summary = attempt.summary;

  if (!summary) {
    return (
      <div className="sim-panel">
        <p>A tentativa ainda não foi finalizada.</p>
        <button className="button button--primary" type="button" onClick={onRestartNew}>
          Voltar ao início
        </button>
      </div>
    );
  }

  const hasMissed = summary.missedQuestionIds.length > 0;

  return (
    <section className="sim-results-panel" aria-labelledby="results-title">
      <header className="sim-results-header">
        <p className="eyebrow">Desempenho da Tentativa</p>
        <h1 id="results-title">Resultado do Simulado</h1>
        <p className="sim-lead">
          Confira sua pontuação, o diagnóstico por eixo do curso e o gabarito comentado para cada
          questão.
        </p>
      </header>

      <div className="sim-score-grid">
        <div className="sim-score-card sim-score-card--main">
          <span className="sim-score-card__label">Aproveitamento Geral</span>
          <div className="sim-score-card__number">{summary.scorePercentage}%</div>
          <span className="sim-score-card__sub">
            {summary.correctCount} de {summary.totalQuestions} questões corretas
          </span>
        </div>

        <div className="sim-score-card">
          <span className="sim-score-card__label">Tempo Total</span>
          <div className="sim-score-card__number">
            {Math.floor(summary.totalTimeSeconds / 60)}m {summary.totalTimeSeconds % 60}s
          </div>
          <span className="sim-score-card__sub">
            Média de {Math.round(summary.totalTimeSeconds / Math.max(1, summary.totalQuestions))}s
            por questão
          </span>
        </div>

        <div className="sim-score-card">
          <span className="sim-score-card__label">Status Pedagógico</span>
          <div className="sim-score-badge">
            {summary.scorePercentage >= 80
              ? "Excelente Fixação"
              : summary.scorePercentage >= 60
                ? "Bom Domínio"
                : "Necessita Reforço"}
          </div>
          <span className="sim-score-card__sub">
            {hasMissed
              ? `${summary.incorrectCount} questão(ões) para revisar`
              : "Parabéns, você acertou todas!"}
          </span>
        </div>
      </div>

      <section className="sim-axis-breakdown" aria-labelledby="axis-breakdown-title">
        <h2 id="axis-breakdown-title">Aproveitamento por Eixo Curricular</h2>
        <div className="sim-axis-grid">
          {(
            Object.entries(summary.performanceByAxis) as [
              AxisId,
              { total: number; correct: number; percentage: number },
            ][]
          ).map(([axisId, stat]) => {
            if (stat.total === 0) return null;
            return (
              <div key={axisId} className="sim-axis-card">
                <div className="sim-axis-card__header">
                  <strong>{AXIS_TITLES[axisId]}</strong>
                  <span>
                    {stat.correct}/{stat.total} ({stat.percentage}%)
                  </span>
                </div>
                <div
                  className="sim-axis-card__bar"
                  role="progressbar"
                  aria-valuenow={stat.percentage}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-label={`Aproveitamento em ${AXIS_TITLES[axisId]}`}
                >
                  <div
                    className="sim-axis-card__bar-fill"
                    style={{ width: `${stat.percentage}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <div className="sim-results-actions">
        {hasMissed ? (
          <button
            className="button button--primary sim-retry-missed-btn"
            type="button"
            onClick={onRetryMissed}
          >
            Refazer apenas as {summary.incorrectCount} questões erradas
          </button>
        ) : null}

        <button
          className="button button--secondary"
          type="button"
          onClick={() => setShowCertificate(true)}
        >
          Emitir Certificado Simbólico
        </button>

        {onExportProgress ? (
          <button className="button button--secondary" type="button" onClick={onExportProgress}>
            Exportar resultado (.csv)
          </button>
        ) : null}

        <button className="text-button" type="button" onClick={onRestartNew}>
          Configurar novo simulado
        </button>
      </div>

      <section className="sim-review-section" aria-labelledby="review-title">
        <h2 id="review-title">Gabarito Comentado e Diagnóstico</h2>
        <div className="sim-review-list">
          {attempt.questions.map((item, idx) => {
            const evalResult = attempt.evaluations[item.question.id];
            const isCorrect = evalResult?.isCorrect ?? false;

            return (
              <article
                key={item.question.id}
                className={`sim-review-card ${
                  isCorrect ? "sim-review-card--correct" : "sim-review-card--incorrect"
                }`}
              >
                <div className="sim-review-card__header">
                  <span className="sim-review-card__index">Questão {idx + 1}</span>
                  <span className={`sim-tag ${isCorrect ? "sim-tag--success" : "sim-tag--danger"}`}>
                    {isCorrect ? "Acerto" : "Erro"}
                  </span>
                  <span className="sim-tag sim-tag--neutral">
                    {item.question.unitIds.join(", ")}
                  </span>
                </div>

                <p className="sim-review-card__prompt">{item.question.prompt}</p>

                <div className="sim-review-card__answers">
                  <p>
                    <strong>Sua resposta:</strong>{" "}
                    <span>{evalResult?.userAnswerDisplay ?? "Não respondida"}</span>
                  </p>
                  {!isCorrect ? (
                    <p className="sim-review-card__expected-text">
                      <strong>Gabarito oficial:</strong>{" "}
                      <span>{evalResult?.correctAnswerDisplay}</span>
                    </p>
                  ) : null}
                </div>

                <div className="sim-review-card__explanation">
                  <strong>Por que essa resposta?</strong>
                  <p>{item.question.explanation}</p>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      {showCertificate ? (
        <CertificateModal
          summary={summary}
          attemptId={attempt.id}
          onClose={() => setShowCertificate(false)}
        />
      ) : null}
    </section>
  );
}
