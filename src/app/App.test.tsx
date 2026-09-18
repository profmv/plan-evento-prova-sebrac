import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { joinSession, loadSession } from "../modules/recap/application/recapApi";
import { App } from "./App";

vi.mock("../modules/recap/application/recapApi", () => ({
  RecapApiError: class RecapApiError extends Error {},
  addScoreEvent: vi.fn(),
  createSession: vi.fn(),
  joinSession: vi.fn(),
  loadRanking: vi.fn(),
  loadSession: vi.fn(),
  updateSession: vi.fn(),
}));

const mockedLoadSession = vi.mocked(loadSession);
const mockedJoinSession = vi.mocked(joinSession);

const session = {
  id: "session-1",
  publicCode: "ABCD2345",
  displayName: "Recap",
  state: "LOBBY" as const,
  rankingVisible: true,
  journeyRound: 1,
  expiresAt: null,
  teams: [
    { id: "team-1", displayName: "Equipe Alfa", colorToken: "blue" },
    { id: "team-2", displayName: "Equipe Beta", colorToken: "green" },
  ],
};

describe("App", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });
  it("presents the team-first portal entry point", () => {
    render(<App />);

    expect(
      screen.getByRole("heading", { name: /revisão que transforma conhecimento em ação/i }),
    ).toBeInTheDocument();
    expect(screen.getByText("18")).toBeInTheDocument();
    expect(screen.getByText(/participantes previstos/i)).toBeInTheDocument();
  });

  it("opens the participant session view without requesting a permanent account", async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole("button", { name: /entrar na sessão/i }));

    expect(
      screen.getByRole("heading", { name: /entre na sessão da sua equipe/i }),
    ).toBeInTheDocument();
    expect(screen.getByLabelText(/código da sessão/i)).toBeInTheDocument();
    expect(screen.getByText(/nenhuma conta permanente/i)).toBeInTheDocument();
  });

  it("keeps unresolved production controls explicit", async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole("button", { name: /área do professor/i }));

    expect(screen.getByText(/nenhuma credencial padrão foi embutida/i)).toBeInTheDocument();
    expect(screen.getByText(/decisão pendente/i)).toBeInTheDocument();
  });

  it("shows the traceable team activity after a participant enters a session", async () => {
    mockedLoadSession.mockResolvedValue(session);
    mockedJoinSession.mockResolvedValue({
      participantId: "participant-1",
      participantToken: "participant-token",
      expiresAt: "2026-09-18T20:00:00.000Z",
      session,
    });
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole("button", { name: /entrar na sessão/i }));
    await user.type(screen.getByLabelText(/código da sessão/i), session.publicCode);
    await user.click(screen.getByRole("button", { name: /localizar sessão/i }));
    await user.click(await screen.findByRole("button", { name: /entrar na equipe/i }));

    expect(
      await screen.findByRole("heading", { name: /mapa de componentes/i }),
    ).toBeInTheDocument();
    expect(screen.getByLabelText(/resposta da equipe/i)).toBeInTheDocument();
    expect(mockedJoinSession).toHaveBeenCalledWith({
      publicCode: session.publicCode,
      teamId: "team-1",
    });
  });
});
