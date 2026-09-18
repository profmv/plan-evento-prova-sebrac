import { useState } from "react";
import type { Question } from "../../content/domain/contentSchemas";
import type { SimuladoFilters } from "../domain/simuladoTypes";

type SimuladoSetupProps = {
  readonly bank: readonly Question[];
  readonly onStart: (filters: SimuladoFilters) => void;
  readonly hasSavedAttempt: boolean;
  readonly onResumeSaved: () => void;
};

export function SimuladoSetup({
  bank,
  onStart,
  hasSavedAttempt,
  onResumeSaved,
}: SimuladoSetupProps) {
  const [timeLimitMinutes, setTimeLimitMinutes] = useState<number>(180);
  const questionCount = bank.length;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (questionCount === 0) return;
    onStart({
      axisId: "all",
      difficulty: "all",
      questionCount,
      mode: "EXAM",
      timeLimitMinutes,
    });
  };

  return (
    <section className="sim-setup-panel" aria-labelledby="sim-setup-title">
      <div className="sim-setup-header">
        <p className="eyebrow">Preparatório Curricular | Turma 001</p>
        <h1 id="sim-setup-title">Simulado Formativo de Conhecimentos Gerais</h1>
      </div>

      {hasSavedAttempt ? (
        <div className="sim-resume-banner" role="status">
          <div className="sim-resume-banner__info">
            <strong>Tentativa em andamento detectada</strong>
            <p>Você possui um simulado não concluído salvo neste navegador.</p>
          </div>
          <button className="button button--secondary" type="button" onClick={onResumeSaved}>
            Continuar de onde parou
          </button>
        </div>
      ) : null}

      <form className="sim-setup-form" onSubmit={handleSubmit}>
        <div className="sim-form-grid sim-form-grid--single">
          <div className="sim-form-group">
            <label htmlFor="select-time-limit">
              <strong>Duração do Exame</strong>
              <small>Controle de tempo com alertas</small>
            </label>
            <select
              id="select-time-limit"
              value={timeLimitMinutes}
              onChange={(e) => setTimeLimitMinutes(Number(e.target.value))}
            >
              <option value={60}>60 minutos</option>
              <option value={120}>120 minutos</option>
              <option value={180}>180 minutos</option>
            </select>
          </div>
        </div>

        <div className="sim-setup-footer">
          <button
            className="button button--primary sim-start-btn"
            type="submit"
            disabled={questionCount === 0}
          >
            Iniciar prova completa
          </button>
        </div>
      </form>
    </section>
  );
}
