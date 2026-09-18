import { type FormEvent, useEffect, useId, useState } from "react";
import coverageActivitiesData from "../../content/activities/coverage-all-units.json";
import activityData from "../../content/activities/uc10-consulta-inventario.json";
import { activitySchema } from "../modules/content/domain/contentSchemas";
import type { SessionSummary } from "../modules/recap/application/ports";
import {
  addScoreEvent,
  createSession,
  joinSession,
  loadRanking,
  loadSession,
  loadSubmissions,
  RecapApiError,
  reviewSubmission,
  submitActivity,
  updateSession,
} from "../modules/recap/application/recapApi";
import type { RankingEntry, UpdateSessionCommand } from "../modules/recap/domain/recapSchemas";
import type { ActivitySubmission } from "../modules/recap/domain/submissionSchemas";
import { SimuladoContainer } from "../modules/simulado/ui/SimuladoContainer";

type View = "home" | "join" | "teacher" | "simulator";

type Notice = {
  readonly kind: "info" | "success";
  readonly message: string;
};

const recapActivities = [
  activitySchema.parse(activityData),
  ...coverageActivitiesData.map((activity) => activitySchema.parse(activity)),
];

const externalPracticeResources: Readonly<
  Record<string, { readonly title: string; readonly url: string }>
> = {
  UC01: {
    title: "PC Anatomy: explorador de hardware",
    url: "https://pc-anatomy.brickshow.site/",
  },
  UC10: {
    title: "BuddySQL: prática interativa de SQL",
    url: "https://buddysql.seancoughlin.me/",
  },
};

const journeyAssignments: Readonly<Record<string, readonly string[]>> = {
  "Equipe Alfa": [
    "uc01-mapa-de-componentes",
    "uc02-plano-de-instalacao",
    "uc03-diagnostico-de-manutencao",
  ],
  "Equipe Beta": ["uc05-topologia-local", "uc06-incidente-de-rede", "uc07-plano-de-servidor"],
  "Equipe Gama": [
    "uc09-algoritmo-de-atendimento",
    "uc10-consulta-inventario",
    "uc11-caso-de-teste",
  ],
  "Equipe Delta": ["uc12-correcao-desktop", "uc13-pagina-web-acessivel", "uc08-projeto-de-redes"],
  "Equipe Épsilon": [
    "uc14-escolha-de-ativo-visual",
    "uc15-estrutura-de-site",
    "uc01-mapa-de-componentes",
  ],
  "Equipe Zeta": [
    "uc16-proposta-de-aplicativo",
    "uc04-atendimento-integrador",
    "uc09-algoritmo-de-atendimento",
  ],
};

const viewTitles: Readonly<Record<View, string>> = {
  home: "Início",
  join: "Entrar em uma sessão",
  teacher: "Painel do professor",
  simulator: "Simulado",
};

const isStaticPublication = import.meta.env.VITE_STATIC_PUBLICATION === "true";

function downloadEvidence(filename: string, content: string, mimeType: string) {
  const blob = new Blob([content], { type: `${mimeType};charset=utf-8` });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  link.click();
  URL.revokeObjectURL(link.href);
}

function HomeView({ onNavigate }: { readonly onNavigate: (view: View) => void }) {
  return (
    <>
      <section className="hero" aria-labelledby="hero-title">
        <div className="hero__content">
          <p className="eyebrow">Turma 001 | Técnico em Informática</p>
          <h1 id="hero-title">Revisão que transforma conhecimento em ação.</h1>
          <p className="hero__lead">
            Desafios colaborativos, prática orientada e feedback claro para revisar o curso em
            equipe antes da prova de conhecimentos gerais.
          </p>
          <div className="button-row">
            <button
              className="button button--primary"
              type="button"
              onClick={() => onNavigate("join")}
            >
              Entrar na sessão
            </button>
            <button
              className="button button--secondary"
              type="button"
              onClick={() => onNavigate("teacher")}
            >
              Área do professor
            </button>
          </div>
        </div>
        <section className="hero__summary" aria-label="Resumo da experiência">
          <div className="metric">
            <strong>3</strong>
            <span>eixos profissionais</span>
          </div>
          <div className="metric">
            <strong>16</strong>
            <span>unidades curriculares</span>
          </div>
          <div className="metric">
            <strong>18</strong>
            <span>participantes previstos</span>
          </div>
        </section>
      </section>

      <section className="section" aria-labelledby="paths-title">
        <div className="section-heading">
          <p className="eyebrow">Escolha o caminho</p>
          <h2 id="paths-title">Duas experiências, uma mesma revisão.</h2>
        </div>
        <div className="card-grid">
          <article className="feature-card feature-card--accent">
            <span className="feature-card__code" aria-hidden="true">
              EQ
            </span>
            <p className="eyebrow">Portal em equipe</p>
            <h3>Resolver, explicar e construir juntos</h3>
            <p>
              Participe de rodadas com quizzes, problemas técnicos, pequenos projetos e
              apresentações rápidas. O placar mostra equipes, não expõe resultados individuais.
            </p>
            <button className="text-button" type="button" onClick={() => onNavigate("join")}>
              Informar código da sessão
            </button>
          </article>

          <article className="feature-card">
            <span className="feature-card__code" aria-hidden="true">
              SI
            </span>
            <p className="eyebrow">Simulado formativo</p>
            <h3>Praticar, compreender e tentar novamente</h3>
            <p>
              Responda questões variadas, entenda cada correção e refaça somente os itens que
              precisam de reforço. Esta frente será liberada após o portal.
            </p>
            <button className="text-button" type="button" onClick={() => onNavigate("simulator")}>
              Ver estado do simulado
            </button>
          </article>
        </div>
      </section>

      <section className="section section--muted" aria-labelledby="axes-title">
        <div className="section-heading">
          <p className="eyebrow">Cobertura curricular</p>
          <h2 id="axes-title">O curso inteiro organizado em três eixos.</h2>
          <p>As atividades continuam ligadas às 16 UCs para preservar precisão curricular.</p>
        </div>
        <div className="axis-grid">
          <article className="axis-card">
            <span className="axis-card__number">01</span>
            <h3>Suporte e manutenção</h3>
            <p>Hardware, sistemas operacionais, atendimento, diagnóstico e infraestrutura.</p>
          </article>
          <article className="axis-card">
            <span className="axis-card__number">02</span>
            <h3>Redes e servidores</h3>
            <p>Conectividade, serviços, segurança, administração e operação de redes.</p>
          </article>
          <article className="axis-card">
            <span className="axis-card__number">03</span>
            <h3>Desenvolvimento</h3>
            <p>Lógica, banco de dados, interfaces, web, desktop, testes e projetos.</p>
          </article>
        </div>
      </section>
    </>
  );
}

function JoinView() {
  const codeId = useId();
  const [code, setCode] = useState("");
  const [session, setSession] = useState<SessionSummary | null>(null);
  const [teamId, setTeamId] = useState("");
  const [joinedTeamName, setJoinedTeamName] = useState<string | null>(null);
  const [joinedSession, setJoinedSession] = useState<SessionSummary | null>(null);
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setBusy(true);
    setMessage("");
    try {
      if (!session) {
        const found = await loadSession(code);
        setSession(found);
        setTeamId(found.teams[0]?.id ?? "");
        setMessage("Sessão encontrada. Escolha sua equipe.");
      } else {
        const participation = await joinSession({ publicCode: code, teamId });
        sessionStorage.setItem("recap:participant-token", participation.participantToken);
        sessionStorage.setItem("recap:session-id", participation.session.id);
        sessionStorage.setItem("recap:team-id", teamId);
        setJoinedTeamName(
          session.teams.find((team) => team.id === teamId)?.displayName ?? "sua equipe",
        );
        setJoinedSession(participation.session);
        setMessage("Entrada confirmada. Prepare a resposta da equipe.");
      }
    } catch (error) {
      setMessage(
        error instanceof RecapApiError ? error.message : "Não foi possível acessar a sessão.",
      );
    } finally {
      setBusy(false);
    }
  };

  return (
    <section className="panel panel--narrow" aria-labelledby="join-title">
      <p className="eyebrow">Acesso do participante</p>
      <h1 id="join-title">Entre na sessão da sua equipe.</h1>
      <p>
        Use o código exibido pelo professor. Nenhuma conta permanente ou endereço de e-mail é
        necessário.
      </p>
      {isStaticPublication ? (
        <p className="status-note" role="status">
          Esta publicação apresenta o portal e o simulado. Para abrir sessões e registrar entregas,
          use a instalação local com o servidor configurado pelo professor.
        </p>
      ) : null}
      {joinedTeamName ? (
        <ActivityView
          teamName={joinedTeamName}
          publicCode={joinedSession?.publicCode ?? code}
          journeyRound={joinedSession?.journeyRound ?? 1}
          sessionId={joinedSession?.id ?? sessionStorage.getItem("recap:session-id") ?? ""}
          teamId={sessionStorage.getItem("recap:team-id") ?? teamId}
        />
      ) : (
        <form className="form" onSubmit={submit}>
          <label htmlFor={codeId}>Código da sessão</label>
          <input
            id={codeId}
            name="sessionCode"
            type="text"
            inputMode="text"
            autoComplete="off"
            minLength={4}
            maxLength={12}
            placeholder="Exemplo: RECAP26"
            aria-describedby={`${codeId}-hint`}
            value={code}
            onChange={(event) => {
              setCode(event.target.value.toUpperCase());
              setSession(null);
            }}
            required
          />
          <p className="field-hint" id={`${codeId}-hint`}>
            Letras e números, sem espaços. O código não concede acesso administrativo.
          </p>
          {session ? (
            <>
              <label htmlFor={`${codeId}-team`}>Equipe</label>
              <select
                id={`${codeId}-team`}
                value={teamId}
                onChange={(event) => setTeamId(event.target.value)}
                required
              >
                {session.teams.map((team) => (
                  <option key={team.id} value={team.id}>
                    {team.displayName}
                  </option>
                ))}
              </select>
            </>
          ) : null}
          <button
            className="button button--primary"
            type="submit"
            disabled={
              isStaticPublication || busy || code.trim().length < 6 || (session !== null && !teamId)
            }
          >
            {busy ? "Processando..." : session ? "Entrar na equipe" : "Localizar sessão"}
          </button>
          {message ? (
            <p className="status-note" role="status">
              {message}
            </p>
          ) : null}
        </form>
      )}
    </section>
  );
}

function ActivityView({
  teamName,
  publicCode,
  journeyRound,
  sessionId,
  teamId,
}: {
  readonly teamName: string;
  readonly publicCode: string;
  readonly journeyRound: number;
  readonly sessionId: string;
  readonly teamId: string;
}) {
  const responseId = useId();
  const [activeJourneyRound, setActiveJourneyRound] = useState(journeyRound);
  const [response, setResponse] = useState("");
  const [submission, setSubmission] = useState<ActivitySubmission | null>(null);
  const [busy, setBusy] = useState(false);
  const assignedActivityId = journeyAssignments[teamName]?.[activeJourneyRound - 1];
  const activity =
    recapActivities.find((candidate) => candidate.id === assignedActivityId) ?? recapActivities[0];

  useEffect(() => {
    const refreshJourney = () => {
      void loadSession(publicCode)
        .then((session) => setActiveJourneyRound(session.journeyRound))
        .catch(() => undefined);
    };
    refreshJourney();
    const intervalId = window.setInterval(refreshJourney, 5000);
    return () => window.clearInterval(intervalId);
  }, [publicCode]);

  const practiceResource = activity
    ? externalPracticeResources[activity.unitIds[0] ?? ""]
    : undefined;

  if (!activity) {
    return null;
  }

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const participantToken = sessionStorage.getItem("recap:participant-token");
    if (!participantToken || !sessionId || !teamId) {
      setSubmission(null);
      return;
    }
    setBusy(true);
    try {
      setSubmission(
        await submitActivity({
          sessionId,
          participantToken,
          command: {
            teamId,
            activityId: activity.id,
            journeyRound: activeJourneyRound,
            responseText: response,
          },
        }),
      );
    } finally {
      setBusy(false);
    }
  };

  return (
    <section className="session-result" aria-labelledby="activity-title">
      <p className="eyebrow">Equipe {teamName}</p>
      <p>Rodada {activeJourneyRound} selecionada pelo professor.</p>
      <h2 id="activity-title">{activity.title}</h2>
      <p>{activity.summary}</p>
      <p className="field-hint">
        Status do conteúdo: {activity.status}. Realize esta atividade somente após a confirmação do
        professor.
      </p>
      <ol className="steps">
        {activity.instructions.map((instruction, index) => (
          <li key={instruction}>
            <span>{index + 1}</span>
            {instruction}
          </li>
        ))}
      </ol>
      <p>
        Evidência esperada: <strong>{activity.expectedEvidence}</strong>
      </p>
      {practiceResource ? (
        <p>
          Prática complementar opcional:{" "}
          <a href={practiceResource.url} target="_blank" rel="noreferrer">
            {practiceResource.title}
          </a>
          .
        </p>
      ) : null}
      <form className="form" onSubmit={submit}>
        <label htmlFor={responseId}>Resposta da equipe</label>
        <textarea
          id={responseId}
          value={response}
          onChange={(event) => setResponse(event.target.value)}
          minLength={20}
          rows={6}
          required
        />
        <button className="button button--primary" type="submit" disabled={busy}>
          {busy ? "Enviando..." : "Enviar para avaliação"}
        </button>
      </form>
      {submission ? (
        <p className="status-note" role="status">
          Entrega {submission.status === "SUBMITTED" ? "registrada" : "atualizada"}. O professor
          poderá devolver feedback e registrar os pontos desta atividade.
        </p>
      ) : null}
    </section>
  );
}

function TeacherView() {
  const secretId = useId();
  const [secret, setSecret] = useState("");
  const [session, setSession] = useState<SessionSummary | null>(null);
  const [ranking, setRanking] = useState<readonly RankingEntry[]>([]);
  const [submissions, setSubmissions] = useState<readonly ActivitySubmission[]>([]);
  const [teamId, setTeamId] = useState("");
  const [points, setPoints] = useState("10");
  const [reason, setReason] = useState("");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setBusy(true);
    setMessage("");
    try {
      const created = await createSession(secret);
      setSession(created);
      setTeamId(created.teams[0]?.id ?? "");
      setSubmissions([]);
      setMessage("Sessão criada e pronta para entrada das equipes.");
    } catch (error) {
      setMessage(
        error instanceof RecapApiError ? error.message : "Não foi possível criar a sessão.",
      );
    } finally {
      setBusy(false);
    }
  };

  const refreshSubmissions = async () => {
    if (!session) return;
    setBusy(true);
    try {
      setSubmissions(await loadSubmissions(secret, session.id));
    } catch (error) {
      setMessage(
        error instanceof RecapApiError ? error.message : "Não foi possível carregar as entregas.",
      );
    } finally {
      setBusy(false);
    }
  };

  const assessSubmission = async (submission: ActivitySubmission, accepted: boolean) => {
    const feedbackText = window.prompt("Feedback para a equipe (mínimo de 2 caracteres):");
    if (!feedbackText || feedbackText.trim().length < 2) return;
    const pointsText = window.prompt("Pontos da atividade (0 a 100):", accepted ? "10" : "0");
    const awardedPoints = Number(pointsText);
    if (!Number.isInteger(awardedPoints) || awardedPoints < 0 || awardedPoints > 100) return;
    setBusy(true);
    try {
      await reviewSubmission({
        adminSecret: secret,
        submissionId: submission.id,
        command: {
          status: accepted ? "ACCEPTED" : "NEEDS_REVISION",
          feedbackText,
          awardedPoints,
        },
      });
      await refreshSubmissions();
      if (session?.rankingVisible) setRanking(await loadRanking(session.id));
      setMessage("Feedback e progresso da equipe registrados.");
    } catch (error) {
      setMessage(
        error instanceof RecapApiError ? error.message : "Não foi possível registrar o feedback.",
      );
    } finally {
      setBusy(false);
    }
  };

  const exportSubmissions = (format: "csv" | "json") => {
    if (format === "json") {
      downloadEvidence(
        `recap-entregas-${session?.publicCode ?? "sessao"}.json`,
        JSON.stringify(
          { formatVersion: 1, exportedAt: new Date().toISOString(), submissions },
          null,
          2,
        ),
        "application/json",
      );
      return;
    }
    const headers = [
      "equipe",
      "atividade",
      "rodada",
      "status",
      "pontos",
      "enviado_em",
      "revisado_em",
      "feedback",
    ];
    const quoteCsvField = (value: string | number | null) =>
      `"${String(value ?? "").replaceAll('"', '""')}"`;
    const rows = submissions.map((item) =>
      [
        item.teamName,
        item.activityId,
        item.journeyRound,
        item.status,
        item.awardedPoints,
        item.submittedAt,
        item.reviewedAt,
        item.feedbackText,
      ]
        .map(quoteCsvField)
        .join(","),
    );
    downloadEvidence(
      `recap-entregas-${session?.publicCode ?? "sessao"}.csv`,
      [headers.join(","), ...rows].join("\n"),
      "text/csv",
    );
  };

  const changeSession = async (command: UpdateSessionCommand) => {
    if (!session) return;
    setBusy(true);
    setMessage("");
    try {
      const updated = await updateSession(secret, session.id, command);
      setSession(updated);
      if (updated.rankingVisible) {
        setRanking(await loadRanking(updated.id));
      } else {
        setRanking([]);
      }
      setMessage("Configuração da sessão atualizada.");
    } catch (error) {
      setMessage(
        error instanceof RecapApiError ? error.message : "Não foi possível atualizar a sessão.",
      );
    } finally {
      setBusy(false);
    }
  };

  const submitScore = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!session) return;
    const parsedPoints = Number(points);
    setBusy(true);
    setMessage("");
    try {
      await addScoreEvent({
        adminSecret: secret,
        sessionId: session.id,
        teamId,
        points: parsedPoints,
        reason,
      });
      setReason("");
      if (session.rankingVisible) {
        setRanking(await loadRanking(session.id));
      }
      setMessage("Pontuação registrada e auditada.");
    } catch (error) {
      setMessage(
        error instanceof RecapApiError ? error.message : "Não foi possível registrar a pontuação.",
      );
    } finally {
      setBusy(false);
    }
  };

  return (
    <section className="panel" aria-labelledby="teacher-title">
      <p className="eyebrow">Administração protegida</p>
      <h1 id="teacher-title">Prepare uma sessão com regras visíveis.</h1>
      <p>
        Use o segredo mostrado pelo launcher local. Nenhuma credencial padrão foi embutida nesta
        interface ou no código.
      </p>
      {isStaticPublication ? (
        <p className="status-note" role="status">
          A administração de sessões exige o servidor local ou a publicação Cloudflare com D1.
        </p>
      ) : null}
      <form className="form" onSubmit={submit}>
        <label htmlFor={secretId}>Segredo administrativo local</label>
        <input
          id={secretId}
          type="password"
          autoComplete="current-password"
          value={secret}
          onChange={(event) => setSecret(event.target.value)}
          minLength={24}
          required
        />
        <button
          className="button button--primary"
          type="submit"
          disabled={isStaticPublication || busy || secret.length < 24}
        >
          {busy ? "Criando..." : "Criar sessão com seis equipes"}
        </button>
        {message ? (
          <p className="status-note" role="status">
            {message}
          </p>
        ) : null}
      </form>
      {session ? (
        <>
          <section className="session-result" aria-labelledby="session-result-title">
            <h2 id="session-result-title">
              Código da sessão: <strong>{session.publicCode}</strong>
            </h2>
            <p>
              Estado atual: <strong>{session.state}</strong>. Compartilhe somente o código com os
              alunos; o segredo administrativo permanece reservado.
            </p>
            <p>Rodada atual: {session.journeyRound} de 3.</p>
            <ul>
              {session.teams.map((team) => (
                <li key={team.id}>{team.displayName}</li>
              ))}
            </ul>
          </section>

          <section className="session-result" aria-labelledby="controls-title">
            <h2 id="controls-title">Controles da sessão</h2>
            <div className="button-row">
              {[1, 2, 3].map((round) => (
                <button
                  className="button button--secondary"
                  type="button"
                  disabled={busy || session.journeyRound === round}
                  key={round}
                  onClick={() => changeSession({ journeyRound: round })}
                >
                  Rodada {round}
                </button>
              ))}
              {session.state === "LOBBY" ? (
                <button
                  className="button button--primary"
                  type="button"
                  disabled={busy}
                  onClick={() => changeSession({ state: "ACTIVE" })}
                >
                  Iniciar atividade
                </button>
              ) : null}
              {session.state === "ACTIVE" ? (
                <button
                  className="button button--secondary"
                  type="button"
                  disabled={busy}
                  onClick={() => changeSession({ state: "PAUSED" })}
                >
                  Pausar atividade
                </button>
              ) : null}
              {session.state === "PAUSED" ? (
                <button
                  className="button button--primary"
                  type="button"
                  disabled={busy}
                  onClick={() => changeSession({ state: "ACTIVE" })}
                >
                  Retomar atividade
                </button>
              ) : null}
              {session.state !== "CLOSED" ? (
                <button
                  className="button button--secondary"
                  type="button"
                  disabled={busy}
                  onClick={() => changeSession({ state: "CLOSED" })}
                >
                  Encerrar sessão
                </button>
              ) : null}
              <button
                className="button button--secondary"
                type="button"
                disabled={busy}
                onClick={() => changeSession({ rankingVisible: !session.rankingVisible })}
              >
                {session.rankingVisible ? "Ocultar placar" : "Mostrar placar"}
              </button>
            </div>
          </section>

          <section className="session-result" aria-labelledby="score-title">
            <h2 id="score-title">Registrar pontuação</h2>
            <form className="form" onSubmit={submitScore}>
              <label htmlFor="score-team">Equipe</label>
              <select
                id="score-team"
                value={teamId}
                onChange={(event) => setTeamId(event.target.value)}
                disabled={busy || session.state === "CLOSED"}
              >
                {session.teams.map((team) => (
                  <option key={team.id} value={team.id}>
                    {team.displayName}
                  </option>
                ))}
              </select>
              <label htmlFor="score-points">Pontos</label>
              <input
                id="score-points"
                type="number"
                min="-1000"
                max="1000"
                step="1"
                value={points}
                onChange={(event) => setPoints(event.target.value)}
                disabled={busy || session.state === "CLOSED"}
                required
              />
              <label htmlFor="score-reason">Motivo pedagógico</label>
              <input
                id="score-reason"
                type="text"
                minLength={5}
                maxLength={240}
                value={reason}
                onChange={(event) => setReason(event.target.value)}
                disabled={busy || session.state === "CLOSED"}
                required
              />
              <button
                className="button button--primary"
                type="submit"
                disabled={busy || session.state === "CLOSED" || !teamId || reason.trim().length < 5}
              >
                Registrar pontos
              </button>
            </form>
          </section>

          <section className="session-result" aria-labelledby="submissions-title">
            <div className="button-row">
              <h2 id="submissions-title">Entregas e feedback</h2>
              <button
                className="button button--secondary"
                type="button"
                disabled={busy}
                onClick={() => void refreshSubmissions()}
              >
                Atualizar entregas
              </button>
              <button
                className="button button--secondary"
                type="button"
                disabled={submissions.length === 0}
                onClick={() => exportSubmissions("csv")}
              >
                Exportar CSV
              </button>
              <button
                className="button button--secondary"
                type="button"
                disabled={submissions.length === 0}
                onClick={() => exportSubmissions("json")}
              >
                Exportar JSON
              </button>
            </div>
            {submissions.length ? (
              <ul className="submission-list">
                {submissions.map((submission) => (
                  <li key={submission.id}>
                    <strong>{submission.teamName}</strong> | Rodada {submission.journeyRound} |{" "}
                    {submission.activityId}
                    <p>{submission.responseText}</p>
                    <p>
                      Status: {submission.status}. Pontos: {submission.awardedPoints}.
                    </p>
                    {submission.feedbackText ? <p>Feedback: {submission.feedbackText}</p> : null}
                    {submission.status === "SUBMITTED" ? (
                      <div className="button-row">
                        <button
                          className="button button--primary"
                          type="button"
                          disabled={busy}
                          onClick={() => void assessSubmission(submission, true)}
                        >
                          Aceitar e pontuar
                        </button>
                        <button
                          className="button button--secondary"
                          type="button"
                          disabled={busy}
                          onClick={() => void assessSubmission(submission, false)}
                        >
                          Solicitar revisão
                        </button>
                      </div>
                    ) : null}
                  </li>
                ))}
              </ul>
            ) : (
              <p>
                Nenhuma entrega carregada. Use Atualizar entregas após uma equipe enviar a resposta.
              </p>
            )}
          </section>

          {session.rankingVisible ? (
            <section className="session-result" aria-labelledby="ranking-title">
              <h2 id="ranking-title">Placar</h2>
              {ranking.length ? (
                <ol>
                  {ranking.map((entry) => (
                    <li key={entry.id}>
                      {entry.displayName}: {entry.totalPoints} pontos
                    </li>
                  ))}
                </ol>
              ) : (
                <p>Ainda não há pontos registrados.</p>
              )}
            </section>
          ) : null}
        </>
      ) : null}
      <section className="readiness-grid" aria-label="Estado dos componentes">
        <article>
          <span className="status-tag status-tag--ready">Especificado</span>
          <h2>Equipes</h2>
          <p>Configuração inicial sugerida de seis equipes com três participantes.</p>
        </article>
        <article>
          <span className="status-tag status-tag--ready">Disponível</span>
          <h2>Sessão e placar</h2>
          <p>Sessões, entrada temporária e eventos idempotentes estão persistidos no D1 local.</p>
        </article>
        <article>
          <span className="status-tag status-tag--blocked">Decisão pendente</span>
          <h2>Retenção</h2>
          <p>Nomes opcionais não serão coletados em produção sem política aprovada.</p>
        </article>
      </section>
    </section>
  );
}

function SimulatorView() {
  return <SimuladoContainer />;
}

export function App() {
  const [view, setView] = useState<View>("home");
  const [notice, setNotice] = useState<Notice | null>(null);

  useEffect(() => {
    const handleUpdate = () => {
      setNotice({
        kind: "info",
        message: "Uma atualização está disponível para a próxima sessão.",
      });
    };
    const handleOffline = () => {
      setNotice({
        kind: "success",
        message: "Os arquivos básicos estão disponíveis neste dispositivo.",
      });
    };

    window.addEventListener("recap:update-available", handleUpdate);
    window.addEventListener("recap:offline-ready", handleOffline);

    return () => {
      window.removeEventListener("recap:update-available", handleUpdate);
      window.removeEventListener("recap:offline-ready", handleOffline);
    };
  }, []);

  const navigate = (nextView: View) => {
    setView(nextView);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="app-shell">
      <header className="site-header">
        <button
          className="brand"
          type="button"
          onClick={() => navigate("home")}
          aria-label="Ir para o início"
        >
          <span className="brand__mark" aria-hidden="true">
            R
          </span>
          <span>
            <strong>Recap</strong>
            <small>SENAC 2026</small>
          </span>
        </button>
        <nav aria-label="Navegação principal">
          <button
            type="button"
            aria-current={view === "home" ? "page" : undefined}
            onClick={() => navigate("home")}
          >
            Início
          </button>
          <button
            type="button"
            aria-current={view === "join" ? "page" : undefined}
            onClick={() => navigate("join")}
          >
            Sessão
          </button>
          <button
            type="button"
            aria-current={view === "simulator" ? "page" : undefined}
            onClick={() => navigate("simulator")}
          >
            Simulado
          </button>
        </nav>
        <span className="environment-badge" title="Ambiente atual">
          {isStaticPublication ? "PAGES" : "LOCAL"}
        </span>
      </header>

      {notice ? (
        <div className={`notice notice--${notice.kind}`} role="status">
          <span>{notice.message}</span>
          <button
            className="notice__dismiss"
            type="button"
            onClick={() => setNotice(null)}
            aria-label="Fechar aviso"
          >
            Fechar
          </button>
        </div>
      ) : null}

      <main id="conteudo-principal" tabIndex={-1}>
        <p className="visually-hidden" aria-live="polite">
          Página atual: {viewTitles[view]}
        </p>
        {view === "home" ? <HomeView onNavigate={navigate} /> : null}
        {view === "join" ? <JoinView /> : null}
        {view === "teacher" ? <TeacherView /> : null}
        {view === "simulator" ? <SimulatorView /> : null}
      </main>

      <footer className="site-footer">
        <p>Recap SENAC 2026 | Revisão formativa, não certificação institucional.</p>
        <p>Versão 0.1.0 | {isStaticPublication ? "Portal estático" : "Ambiente local"}</p>
      </footer>
    </div>
  );
}
