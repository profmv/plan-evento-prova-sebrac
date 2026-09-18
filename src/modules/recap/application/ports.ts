import type { TeamScoreProjection } from "../domain/ranking";
import type { CreateSessionCommand, PublicTeam } from "../domain/recapSchemas";

export type SessionState = "DRAFT" | "LOBBY" | "ACTIVE" | "PAUSED" | "CLOSED";

export type SessionSummary = {
  readonly id: string;
  readonly publicCode: string;
  readonly displayName: string;
  readonly state: SessionState;
  readonly rankingVisible: boolean;
  readonly expiresAt: string | null;
  readonly teams: readonly PublicTeam[];
};

export type CreateSessionRecord = {
  readonly id: string;
  readonly publicCode: string;
  readonly displayName: string;
  readonly state: "LOBBY";
  readonly rankingVisible: true;
  readonly expiresAt: string | null;
  readonly createdAt: string;
  readonly teams: readonly (PublicTeam & {
    readonly normalizedName: string;
    readonly createdAt: string;
  })[];
  readonly actorId: string;
  readonly requestId: string;
};

export type CreateParticipantRecord = {
  readonly id: string;
  readonly sessionId: string;
  readonly teamId: string;
  readonly tokenHash: string;
  readonly optionalDisplayName: string | null;
  readonly createdAt: string;
  readonly expiresAt: string;
};

export type AddScoreEventRecord = {
  readonly id: string;
  readonly sessionId: string;
  readonly teamId: string;
  readonly roundId: string | null;
  readonly idempotencyKey: string;
  readonly points: number;
  readonly reason: string;
  readonly actorId: string;
  readonly requestId: string;
  readonly payloadHash: string;
  readonly createdAt: string;
};

export type StoredScoreEvent = {
  readonly id: string;
  readonly teamId: string;
  readonly points: number;
  readonly reason: string;
  readonly payloadHash: string;
};

export interface RecapRepository {
  publicCodeExists(publicCode: string): Promise<boolean>;
  createSession(record: CreateSessionRecord): Promise<boolean>;
  findSessionByCode(publicCode: string): Promise<SessionSummary | null>;
  findSessionById(sessionId: string): Promise<SessionSummary | null>;
  createParticipant(record: CreateParticipantRecord): Promise<void>;
  findScoreEvent(sessionId: string, idempotencyKey: string): Promise<StoredScoreEvent | null>;
  addScoreEvent(record: AddScoreEventRecord): Promise<void>;
  getRanking(sessionId: string): Promise<readonly TeamScoreProjection[]>;
}

export interface RecapClock {
  now(): Date;
}

export interface RecapCrypto {
  randomUuid(): string;
  randomBytes(length: number): Uint8Array;
  sha256(value: string): Promise<string>;
}

export type CreateSessionInput = {
  readonly command: CreateSessionCommand;
  readonly actorId: string;
  readonly requestId: string;
};
