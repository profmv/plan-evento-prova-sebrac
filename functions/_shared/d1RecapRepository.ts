import type {
  AddScoreEventRecord,
  CreateParticipantRecord,
  CreateSessionRecord,
  RecapRepository,
  SessionState,
  SessionSummary,
  StoredScoreEvent,
} from "../../src/modules/recap/application/ports";
import type { TeamScoreProjection } from "../../src/modules/recap/domain/ranking";

type SessionRow = {
  id: string;
  public_code: string;
  display_name: string;
  state: SessionState;
  ranking_visible: number;
  expires_at: string | null;
};

type TeamRow = {
  id: string;
  display_name: string;
  color_token: string;
};

export class D1RecapRepository implements RecapRepository {
  constructor(private readonly database: D1Database) {}

  async publicCodeExists(publicCode: string): Promise<boolean> {
    const row = await this.database
      .prepare("SELECT 1 AS found FROM sessions WHERE public_code = ? LIMIT 1")
      .bind(publicCode)
      .first<{ found: number }>();
    return row?.found === 1;
  }

  async createSession(record: CreateSessionRecord): Promise<boolean> {
    const statements = [
      this.database
        .prepare(
          `INSERT INTO sessions
           (id, public_code, display_name, state, ranking_visible, expires_at, created_at, updated_at)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        )
        .bind(
          record.id,
          record.publicCode,
          record.displayName,
          record.state,
          record.rankingVisible ? 1 : 0,
          record.expiresAt,
          record.createdAt,
          record.createdAt,
        ),
      ...record.teams.map((team) =>
        this.database
          .prepare(
            `INSERT INTO teams
             (id, session_id, display_name, normalized_name, color_token, created_at, updated_at)
             VALUES (?, ?, ?, ?, ?, ?, ?)`,
          )
          .bind(
            team.id,
            record.id,
            team.displayName,
            team.normalizedName,
            team.colorToken,
            team.createdAt,
            team.createdAt,
          ),
      ),
      this.database
        .prepare(
          `INSERT INTO admin_audit_events
           (id, session_id, actor_id, action, target_type, target_id, request_id, created_at)
           VALUES (?, ?, ?, 'SESSION_CREATED', 'SESSION', ?, ?, ?)`,
        )
        .bind(
          crypto.randomUUID(),
          record.id,
          record.actorId,
          record.id,
          record.requestId,
          record.createdAt,
        ),
    ];

    try {
      await this.database.batch(statements);
      return true;
    } catch (error) {
      if (
        error instanceof Error &&
        /UNIQUE constraint failed: sessions\.public_code/iu.test(error.message)
      ) {
        return false;
      }
      throw error;
    }
  }

  async findSessionByCode(publicCode: string): Promise<SessionSummary | null> {
    const row = await this.database
      .prepare(
        `SELECT id, public_code, display_name, state, ranking_visible, expires_at
         FROM sessions WHERE public_code = ? LIMIT 1`,
      )
      .bind(publicCode)
      .first<SessionRow>();
    return row ? this.hydrateSession(row) : null;
  }

  async findSessionById(sessionId: string): Promise<SessionSummary | null> {
    const row = await this.database
      .prepare(
        `SELECT id, public_code, display_name, state, ranking_visible, expires_at
         FROM sessions WHERE id = ? LIMIT 1`,
      )
      .bind(sessionId)
      .first<SessionRow>();
    return row ? this.hydrateSession(row) : null;
  }

  async createParticipant(record: CreateParticipantRecord): Promise<void> {
    await this.database
      .prepare(
        `INSERT INTO participant_sessions
         (id, session_id, team_id, token_hash, optional_display_name, created_at, last_seen_at, expires_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      )
      .bind(
        record.id,
        record.sessionId,
        record.teamId,
        record.tokenHash,
        record.optionalDisplayName,
        record.createdAt,
        record.createdAt,
        record.expiresAt,
      )
      .run();
  }

  async findScoreEvent(
    sessionId: string,
    idempotencyKey: string,
  ): Promise<StoredScoreEvent | null> {
    const row = await this.database
      .prepare(
        `SELECT id, team_id, points, reason, metadata_json
         FROM score_events WHERE session_id = ? AND idempotency_key = ? LIMIT 1`,
      )
      .bind(sessionId, idempotencyKey)
      .first<{
        id: string;
        team_id: string;
        points: number;
        reason: string;
        metadata_json: string;
      }>();
    if (!row) return null;
    const metadata = JSON.parse(row.metadata_json) as { payloadHash?: string };
    return {
      id: row.id,
      teamId: row.team_id,
      points: row.points,
      reason: row.reason,
      payloadHash: metadata.payloadHash ?? "",
    };
  }

  async addScoreEvent(record: AddScoreEventRecord): Promise<void> {
    await this.database.batch([
      this.database
        .prepare(
          `INSERT INTO score_events
           (id, session_id, team_id, round_id, idempotency_key, kind, points, reason,
            actor_kind, actor_id, metadata_json, created_at)
           VALUES (?, ?, ?, ?, ?, 'MANUAL_AWARD', ?, ?, 'TEACHER', ?, ?, ?)`,
        )
        .bind(
          record.id,
          record.sessionId,
          record.teamId,
          record.roundId,
          record.idempotencyKey,
          record.points,
          record.reason,
          record.actorId,
          JSON.stringify({ payloadHash: record.payloadHash, requestId: record.requestId }),
          record.createdAt,
        ),
      this.database
        .prepare(
          `INSERT INTO admin_audit_events
           (id, session_id, actor_id, action, target_type, target_id, request_id, created_at)
           VALUES (?, ?, ?, 'SCORE_EVENT_CREATED', 'SCORE_EVENT', ?, ?, ?)`,
        )
        .bind(
          crypto.randomUUID(),
          record.sessionId,
          record.actorId,
          record.id,
          record.requestId,
          record.createdAt,
        ),
    ]);
  }

  async getRanking(sessionId: string): Promise<readonly TeamScoreProjection[]> {
    const result = await this.database
      .prepare(
        `SELECT team_score_totals.team_id AS team_id,
                team_score_totals.display_name AS display_name,
                team_score_totals.total_points AS total_points,
                team_score_totals.event_count AS event_count,
                teams.color_token AS color_token
         FROM team_score_totals
         JOIN teams ON teams.id = team_score_totals.team_id
         WHERE team_score_totals.session_id = ?`,
      )
      .bind(sessionId)
      .all<{
        team_id: string;
        display_name: string;
        total_points: number;
        event_count: number;
        color_token: string;
      }>();
    return result.results.map((row) => ({
      id: row.team_id,
      displayName: row.display_name,
      colorToken: row.color_token,
      totalPoints: row.total_points,
      eventCount: row.event_count,
    }));
  }

  private async hydrateSession(row: SessionRow): Promise<SessionSummary> {
    const result = await this.database
      .prepare(
        `SELECT id, display_name, color_token FROM teams
         WHERE session_id = ? AND is_active = 1 ORDER BY display_name COLLATE NOCASE`,
      )
      .bind(row.id)
      .all<TeamRow>();
    return {
      id: row.id,
      publicCode: row.public_code,
      displayName: row.display_name,
      state: row.state,
      rankingVisible: row.ranking_visible === 1,
      expiresAt: row.expires_at,
      teams: result.results.map((team) => ({
        id: team.id,
        displayName: team.display_name,
        colorToken: team.color_token,
      })),
    };
  }
}
