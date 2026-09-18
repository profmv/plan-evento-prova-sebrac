import { type FormEvent, useEffect, useId, useState } from "react";
import type { SessionSummary } from "../modules/recap/application/ports";
import {
  createSession,
  joinSession,
  loadSession,
  RecapApiError,
} from "../modules/recap/application/recapApi";

type View = "home" | "join" | "teacher" | "simulator";

type Notice = {
  readonly kind: "info" | "success";
  readonly message: string;
};

const viewTitles: Readonly<Record<View, string>> = {
  home: "Início",
  join: "Entrar em uma sessão",
  teacher: "Painel do professor",
  simulator: "Simulado",
};

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
        setMessage(
          `Entrada confirmada em ${session.teams.find((team) => team.id === teamId)?.displayName ?? "sua equipe"}.`,
        );
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
          disabled={busy || code.trim().length < 6 || (session !== null && !teamId)}
        >
          {busy ? "Processando..." : session ? "Entrar na equipe" : "Localizar sessão"}
        </button>
        {message ? (
          <p className="status-note" role="status">
            {message}
          </p>
        ) : null}
      </form>
    </section>
  );
}

function TeacherView() {
  const secretId = useId();
  const [secret, setSecret] = useState("");
  const [session, setSession] = useState<SessionSummary | null>(null);
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setBusy(true);
    setMessage("");
    try {
      const created = await createSession(secret);
      setSession(created);
      setSecret("");
      setMessage("Sessão criada e pronta para entrada das equipes.");
    } catch (error) {
      setMessage(
        error instanceof RecapApiError ? error.message : "Não foi possível criar a sessão.",
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
          disabled={busy || secret.length < 24}
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
        <section className="session-result" aria-labelledby="session-result-title">
          <h2 id="session-result-title">
            Código da sessão: <strong>{session.publicCode}</strong>
          </h2>
          <p>
            Compartilhe somente este código com os alunos. O segredo administrativo permanece
            reservado.
          </p>
          <ul>
            {session.teams.map((team) => (
              <li key={team.id}>{team.displayName}</li>
            ))}
          </ul>
        </section>
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
  return (
    <section className="panel" aria-labelledby="simulator-title">
      <p className="eyebrow">Segundo marco</p>
      <h1 id="simulator-title">Simulado formativo em preparação.</h1>
      <p>
        O motor terá múltipla escolha, verdadeiro ou falso e resposta curta, com ordem aleatória,
        explicações e reforço dos erros. O banco completo terá no mínimo 300 questões aprovadas.
      </p>
      <ol className="steps">
        <li>
          <span>1</span> Configurar eixo, UC, dificuldade e quantidade.
        </li>
        <li>
          <span>2</span> Responder uma seleção sem repetição.
        </li>
        <li>
          <span>3</span> Compreender a correção de cada questão.
        </li>
        <li>
          <span>4</span> Refazer somente o que precisa de reforço.
        </li>
      </ol>
    </section>
  );
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
          LOCAL
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
        <p>Versão 0.1.0 | Ambiente local</p>
      </footer>
    </div>
  );
}
