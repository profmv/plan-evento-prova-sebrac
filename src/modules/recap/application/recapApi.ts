import type { RankingEntry } from "../domain/recapSchemas";
import type { SessionSummary } from "./ports";

type ApiEnvelope<T> = { readonly data: T; readonly requestId: string };
type ApiFailure = {
  readonly code?: string;
  readonly message?: string;
  readonly requestId?: string;
};

export class RecapApiError extends Error {
  constructor(
    readonly code: string,
    message: string,
    readonly requestId?: string,
  ) {
    super(message);
    this.name = "RecapApiError";
  }
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`/api/v1${path}`, {
    ...init,
    headers: {
      accept: "application/json",
      ...init?.headers,
    },
  });
  const payload = (await response.json()) as ApiEnvelope<T> | ApiFailure;
  if (!response.ok || !("data" in payload)) {
    throw new RecapApiError(
      "code" in payload ? (payload.code ?? "REQUEST_FAILED") : "REQUEST_FAILED",
      "message" in payload
        ? (payload.message ?? "Não foi possível concluir a operação.")
        : "Não foi possível concluir a operação.",
      "requestId" in payload ? payload.requestId : undefined,
    );
  }
  return payload.data;
}

export function loadSession(publicCode: string): Promise<SessionSummary> {
  return request(`/sessions/code/${encodeURIComponent(publicCode.trim().toUpperCase())}`);
}

export function createSession(adminSecret: string): Promise<SessionSummary> {
  const teamNames = [
    "Equipe Alfa",
    "Equipe Beta",
    "Equipe Gama",
    "Equipe Delta",
    "Equipe Épsilon",
    "Equipe Zeta",
  ];
  const colors = ["orange", "blue", "green", "purple", "red", "teal"];
  return request("/sessions", {
    method: "POST",
    headers: {
      authorization: `Bearer ${adminSecret}`,
      "content-type": "application/json",
    },
    body: JSON.stringify({
      displayName: "Recap SENAC 2026 - Turma 001",
      teams: teamNames.map((displayName, index) => ({ displayName, colorToken: colors[index] })),
    }),
  });
}

export function joinSession(input: {
  readonly publicCode: string;
  readonly teamId: string;
  readonly optionalDisplayName?: string;
}): Promise<{
  readonly participantId: string;
  readonly participantToken: string;
  readonly expiresAt: string;
  readonly session: SessionSummary;
}> {
  return request("/join", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(input),
  });
}

export function loadRanking(sessionId: string): Promise<readonly RankingEntry[]> {
  return request(`/sessions/${encodeURIComponent(sessionId)}/ranking`);
}
