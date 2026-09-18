import { describe, expect, it } from "vitest";
import type { TeamScoreProjection } from "../domain/ranking";
import type {
  AddScoreEventRecord,
  CreateParticipantRecord,
  CreateSessionRecord,
  RecapCrypto,
  RecapRepository,
  SessionState,
  SessionSummary,
  StoredScoreEvent,
  UpdateSessionRecord,
} from "./ports";
import { createRecapService, type RecapApplicationError } from "./recapService";

const now = new Date("2026-09-18T12:00:00.000Z");

class InMemoryRecapRepository implements RecapRepository {
  readonly updates: UpdateSessionRecord[] = [];

  constructor(private session: SessionSummary) {}

  async publicCodeExists(_publicCode: string): Promise<boolean> {
    return false;
  }

  async createSession(_record: CreateSessionRecord): Promise<boolean> {
    return true;
  }

  async findSessionByCode(_publicCode: string): Promise<SessionSummary | null> {
    return null;
  }

  async findSessionById(sessionId: string): Promise<SessionSummary | null> {
    return this.session.id === sessionId ? this.session : null;
  }

  async updateSession(record: UpdateSessionRecord): Promise<boolean> {
    if (this.session.id !== record.sessionId || this.session.state !== record.previousState) {
      return false;
    }
    this.session = {
      ...this.session,
      state: record.state,
      rankingVisible: record.rankingVisible,
      journeyRound: record.journeyRound,
    };
    this.updates.push(record);
    return true;
  }

  async createParticipant(_record: CreateParticipantRecord): Promise<void> {}

  async findScoreEvent(
    _sessionId: string,
    _idempotencyKey: string,
  ): Promise<StoredScoreEvent | null> {
    return null;
  }

  async addScoreEvent(_record: AddScoreEventRecord): Promise<void> {}

  async getRanking(_sessionId: string): Promise<readonly TeamScoreProjection[]> {
    return [];
  }
}

function createService(state: SessionState = "LOBBY") {
  const repository = new InMemoryRecapRepository({
    id: "session-1",
    publicCode: "ABCD2345",
    displayName: "Recap",
    state,
    rankingVisible: true,
    journeyRound: 1,
    expiresAt: null,
    teams: [],
  });
  const crypto: RecapCrypto = {
    randomUuid: () => "unused",
    randomBytes: () => new Uint8Array(),
    sha256: async (value) => value,
  };
  return {
    repository,
    service: createRecapService({ repository, clock: { now: () => now }, crypto }),
  };
}

describe("RecapService.updateSession", () => {
  it("applies the allowed lifecycle transitions and records each update", async () => {
    const { repository, service } = createService();

    await service.updateSession({
      sessionId: "session-1",
      command: { state: "ACTIVE" },
      actorId: "teacher-1",
      requestId: "request-1",
    });
    await service.updateSession({
      sessionId: "session-1",
      command: { state: "PAUSED" },
      actorId: "teacher-1",
      requestId: "request-2",
    });
    const closed = await service.updateSession({
      sessionId: "session-1",
      command: { state: "CLOSED" },
      actorId: "teacher-1",
      requestId: "request-3",
    });

    expect(closed.state).toBe("CLOSED");
    expect(repository.updates.map((update) => [update.previousState, update.state])).toEqual([
      ["LOBBY", "ACTIVE"],
      ["ACTIVE", "PAUSED"],
      ["PAUSED", "CLOSED"],
    ]);
  });

  it("rejects invalid transitions and any attempt to reopen a closed session", async () => {
    const { service } = createService();

    await expect(
      service.updateSession({
        sessionId: "session-1",
        command: { state: "PAUSED" },
        actorId: "teacher-1",
        requestId: "request-1",
      }),
    ).rejects.toMatchObject<Partial<RecapApplicationError>>({
      code: "INVALID_SESSION_TRANSITION",
      status: 409,
    });

    const closed = createService("CLOSED").service;
    await expect(
      closed.updateSession({
        sessionId: "session-1",
        command: { state: "ACTIVE" },
        actorId: "teacher-1",
        requestId: "request-2",
      }),
    ).rejects.toMatchObject<Partial<RecapApplicationError>>({
      code: "SESSION_CLOSED",
      status: 409,
    });
  });

  it("updates ranking visibility without changing the lifecycle state", async () => {
    const { repository, service } = createService("ACTIVE");

    const updated = await service.updateSession({
      sessionId: "session-1",
      command: { rankingVisible: false },
      actorId: "teacher-1",
      requestId: "request-1",
    });

    expect(updated).toMatchObject({ state: "ACTIVE", rankingVisible: false });
    expect(repository.updates).toHaveLength(1);
    expect(repository.updates[0]).toMatchObject({ previousState: "ACTIVE", state: "ACTIVE" });
  });
});
