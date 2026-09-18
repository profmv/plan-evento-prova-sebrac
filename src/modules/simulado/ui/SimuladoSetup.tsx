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
        <div className="sim-form-grid">
          <div className="sim-form-group">
            <label htmlFor="select-axis">
              <strong>Eixo Curricular</strong>
              <small>Área profissional das questões</small>
            </label>
            <select
              id="select-axis"
              value={axisId}
              onChange={(e) => setAxisId(e.target.value as "all" | AxisId)}
            >
              <option value="all">Todos os 3 eixos (Geral do Curso)</option>
              <option value="support">Suporte e Manutenção (UC01 a UC04)</option>
              <option value="networks">Redes e Servidores (UC05 a UC08)</option>
              <option value="development">Desenvolvimento de Apps (UC09 a UC16)</option>
            </select>
          </div>

          <div className="sim-form-group">
            <label htmlFor="select-difficulty">
              <strong>Nível de Dificuldade</strong>
              <small>Complexidade técnica exigida</small>
            </label>
            <select
              id="select-difficulty"
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value as "all" | Difficulty)}
            >
              <option value="all">Todas as dificuldades (Mista)</option>
              <option value="FOUNDATION">Básica (Conceitos fundamentais)</option>
              <option value="INTERMEDIATE">Intermediária (Diagnóstico e aplicação)</option>
              <option value="ADVANCED">Avançada (Comandos e arquitetura)</option>
            </select>
          </div>

          <div className="sim-form-group">
            <label htmlFor="select-count">
              <strong>Quantidade de Questões</strong>
              <small>Disponíveis no filtro: {maxAvailable}</small>
            </label>
            <select
              id="select-count"
              value={questionCount}
              onChange={(e) => setQuestionCount(Number(e.target.value))}
            >
              <option value={5}>5 questões (Rápido ~ 8 min)</option>
              <option value={10}>10 questões (Padrão ~ 15 min)</option>
              <option value={15}>15 questões (Completo M1 ~ 25 min)</option>
              <option value={30}>30 questões (Intensivo ~ 45 min)</option>
              <option value={60}>60 questões (Simulado Extensivo ~ 2h)</option>
              <option value={90}>90 questões (Maratona Completa ~ 3h)</option>
            </select>
          </div>

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
              <option value={0}>Sem limite (Cronômetro progressivo)</option>
              <option value={60}>60 minutos (Treino rápido)</option>
              <option value={120}>120 minutos (Simulado padrão)</option>
              <option value={180}>180 minutos (Exame Completo 3 Horas)</option>
            </select>
          </div>

          <div className="sim-form-group">
            <label htmlFor="select-mode">
              <strong>Dinâmica de Feedback</strong>
              <small>Como as explicações são exibidas</small>
            </label>
            <select
              id="select-mode"
              value={mode}
              onChange={(e) => setMode(e.target.value as SimuladoMode)}
            >
              <option value="INSTANT_FEEDBACK">
                Feedback Imediato (Explicação após cada resposta)
              </option>
              <option value="EXAM">Modo Exame Realista (Revisão completa ao final)</option>
            </select>
          </div>
        </div>

        <div className="sim-setup-footer">
          <div className="sim-setup-badge">
            <span>Sorteio aleatório sem repetição</span>
            <strong>{effectiveCount} questão(ões) selecionadas</strong>
          </div>
          <button
            className="button button--primary sim-start-btn"
            type="submit"
            disabled={maxAvailable === 0}
          >
            Iniciar Simulado
          </button>
        </div>
      </form>
    </section>
  );
}
