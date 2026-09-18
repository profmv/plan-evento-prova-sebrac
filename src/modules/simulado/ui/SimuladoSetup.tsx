import { useState } from "react";
import type { AxisId, Difficulty, Question } from "../../content/domain/contentSchemas";
import { filterQuestions } from "../domain/simuladoEngine";
import type { SimuladoFilters, SimuladoMode } from "../domain/simuladoTypes";

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
  const [axisId, setAxisId] = useState<"all" | AxisId>("all");
  const [difficulty, setDifficulty] = useState<"all" | Difficulty>("all");
  const [questionCount, setQuestionCount] = useState<number>(10);
  const [mode, setMode] = useState<SimuladoMode>("INSTANT_FEEDBACK");

  const matchingQuestions = filterQuestions(bank, { axisId, difficulty });
  const maxAvailable = matchingQuestions.length;
  const effectiveCount = Math.min(questionCount, maxAvailable);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (maxAvailable === 0) return;
    onStart({
      axisId,
      difficulty,
      questionCount: effectiveCount,
      mode,
    });
  };

  return (
    <section className="sim-setup-panel" aria-labelledby="sim-setup-title">
      <div className="sim-setup-header">
        <p className="eyebrow">Preparatório Curricular | Turma 001</p>
        <h1 id="sim-setup-title">Simulado Formativo de Conhecimentos Gerais</h1>
        <p className="sim-lead">
          Treine para a avaliação geral com questões selecionadas aleatoriamente, justificativas
          técnicas aprofundadas e opção de refazer apenas os erros para fixação imediata.
        </p>
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
              <option value={15}>15 questões (Completo ~ 25 min)</option>
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
