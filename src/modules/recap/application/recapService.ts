import { rankTeams } from "../domain/ranking";
import {
  type AddScoreEventCommand,
  type JoinSessionCommand,
  normalizeTeamName,
} from "../domain/recapSchemas";
import type {
  AddScoreEventRecord,
  CreateSessionInput,
  CreateSessionRecord,
  RecapClock,
  RecapCrypto,
  RecapRepository,
  SessionSummary,
} from "./ports";

const publicCodeAlphabet = "23456789ABCDEFGHJKLMNPQRSTUVWXYZ";
const participantLifetimeMilliseconds = 8 * 60 * 60 * 1000;

export class RecapApplicationError extends Error {
  constructor(
    readonly code: string,
    message: string,
    readonly status: number,
  ) {
    super(message);
    this.name = "RecapApplicationError";
  }
}

export type RecapServiceDependencies = {
  readonly repository: RecapRepository;
  readonly clock: RecapClock;
  readonly crypto: RecapCrypto;
};

export function createRecapService(dependencies: RecapServiceDependencies) {
  const { repository, clock, crypto } = dependencies;

  return {
    async createSession(input: CreateSessionInput) {
      const now = clock.now();
      const expiresAt = input.command.expiresAt ?? null;
      if (expiresAt !== null && new Date(expiresAt).getTime() <= now.getTime()) {
        throw new RecapApplicationError(
          "INVALID_EXPIRATION",
          "A validade da sessão deve estar no futuro.",
          400,
        );
      }

      for (let attempt = 0; attempt < 5; attempt += 1) {
        const publicCode = generatePublicCode(crypto, 8);
        if (await repository.publicCodeExists(publicCode)) {
          continue;
        }

        const record: CreateSessionRecord = {
          id: crypto.randomUuid(),
          publicCode,
          displayName: input.command.displayName,
          state: "LOBBY",
          rankingVisible: true,
          expiresAt,
          createdAt: now.toISOString(),
          teams: input.command.teams.map((team) => ({
            id: crypto.randomUuid(),
            displayName: team.displayName,
            normalizedName: normalizeTeamName(team.displayName),
            colorToken: team.colorToken,
            createdAt: now.toISOString(),
          })),
          actorId: input.actorId,
          requestId: input.requestId,
        };

        const created = await repository.createSession(record);
        if (created) {
          return {
            id: record.id,
            publicCode: record.publicCode,
            displayName: record.displayName,
            state: record.state,
            rankingVisible: record.rankingVisible,
            expiresAt: record.expiresAt,
            teams: record.teams.map(({ id, displayName, colorToken }) => ({
              id,
              displayName,
              colorToken,
            })),
          } satisfies SessionSummary;
        }
      }

      throw new RecapApplicationError(
        "PUBLIC_CODE_EXHAUSTED",
        "Não foi possível gerar um código de sessão único. Tente novamente.",
        503,
      );
    },

    async getPublicSession(publicCode: string) {
      const session = await repository.findSessionByCode(publicCode);
      if (!session || session.state === "DRAFT") {
        throw new RecapApplicationError("SESSION_NOT_FOUND", "Sessão não encontrada.", 404);
      }
      return session;
    },

    async joinSession(command: JoinSessionCommand) {
      const session = await repository.findSessionByCode(command.publicCode);
      if (!session || session.state === "DRAFT") {
        throw new RecapApplicationError("SESSION_NOT_FOUND", "Sessão não encontrada.", 404);
      }
      if (session.state === "CLOSED") {
        throw new RecapApplicationError("SESSION_CLOSED", "Esta sessão já foi encerrada.", 409);
      }

      const team = session.teams.find((candidate) => candidate.id === command.teamId);
      if (!team) {
        throw new RecapApplicationError(
          "TEAM_NOT_IN_SESSION",
          "A equipe escolhida não pertence a esta sessão.",
          400,
        );
      }

      const now = clock.now();
      const defaultExpiration = new Date(now.getTime() + participantLifetimeMilliseconds);
      const sessionExpiration = session.expiresAt ? new Date(session.expiresAt) : null;
      const expiration =
        sessionExpiration && sessionExpiration < defaultExpiration
          ? sessionExpiration
          : defaultExpiration;
      const token = encodeBase64Url(crypto.randomBytes(32));
      const tokenHash = await crypto.sha256(token);
      const participantId = crypto.randomUuid();

      await repository.createParticipant({
        id: participantId,
        sessionId: session.id,
        teamId: team.id,
        tokenHash,
        optionalDisplayName: command.optionalDisplayName ?? null,
        createdAt: now.toISOString(),
        expiresAt: expiration.toISOString(),
      });

      return {
        participantId,
        participantToken: token,
        expiresAt: expiration.toISOString(),
        session,
        team,
      };
    },

    async addScoreEvent(input: {
      readonly sessionId: string;
      readonly command: AddScoreEventCommand;
      readonly idempotencyKey: string;
      readonly actorId: string;
      readonly requestId: string;
    }) {
      const session = await repository.findSessionById(input.sessionId);
      if (!session) {
        throw new RecapApplicationError("SESSION_NOT_FOUND", "Sessão não encontrada.", 404);
      }
      if (session.state === "CLOSED") {
        throw new RecapApplicationError("SESSION_CLOSED", "Esta sessão já foi encerrada.", 409);
      }
      if (!session.teams.some((team) => team.id === input.command.teamId)) {
        throw new RecapApplicationError(
          "TEAM_NOT_IN_SESSION",
          "A equipe escolhida não pertence a esta sessão.",
          400,
        );
      }

      const payloadHash = await crypto.sha256(
        JSON.stringify({
          teamId: input.command.teamId,
          roundId: input.command.roundId ?? null,
          points: input.command.points,
          reason: input.command.reason,
        }),
      );
      const existing = await repository.findScoreEvent(input.sessionId, input.idempotencyKey);
      if (existing) {
        if (existing.payloadHash !== payloadHash) {
          throw new RecapApplicationError(
            "IDEMPOTENCY_CONFLICT",
            "A chave idempotente já foi usada com outro comando.",
            409,
          );
        }
        return { applied: false, event: existing } as const;
      }

      const record: AddScoreEventRecord = {
        id: crypto.randomUuid(),
        sessionId: input.sessionId,
        teamId: input.command.teamId,
        roundId: input.command.roundId ?? null,
        idempotencyKey: input.idempotencyKey,
        points: input.command.points,
        reason: input.command.reason,
        actorId: input.actorId,
        requestId: input.requestId,
        payloadHash,
        createdAt: clock.now().toISOString(),
      };

      await repository.addScoreEvent(record);
      return { applied: true, event: record } as const;
    },

    async getRanking(sessionId: string) {
      const session = await repository.findSessionById(sessionId);
      if (!session) {
        throw new RecapApplicationError("SESSION_NOT_FOUND", "Sessão não encontrada.", 404);
      }
      if (!session.rankingVisible) {
        throw new RecapApplicationError(
          "RANKING_HIDDEN",
          "O professor ocultou o ranking temporariamente.",
          403,
        );
      }
      return rankTeams(await repository.getRanking(sessionId));
    },
  };
}

function generatePublicCode(crypto: RecapCrypto, length: number): string {
  const maximumAcceptedByte =
    Math.floor(256 / publicCodeAlphabet.length) * publicCodeAlphabet.length;
  let code = "";

  while (code.length < length) {
    for (const byte of crypto.randomBytes(length * 2)) {
      if (byte >= maximumAcceptedByte) {
        continue;
      }
      code += publicCodeAlphabet[byte % publicCodeAlphabet.length];
      if (code.length === length) {
        return code;
      }
    }
  }

  return code;
}

function encodeBase64Url(bytes: Uint8Array): string {
  let binary = "";
  for (const byte of bytes) {
    binary += String.fromCharCode(byte);
  }
  return btoa(binary).replaceAll("+", "-").replaceAll("/", "_").replace(/=+$/u, "");
}
