import type { SubmissionRepository } from "../../src/modules/recap/application/submissionService";
import type {
  ActivitySubmission,
  CreateSubmissionCommand,
  ReviewSubmissionCommand,
  SubmissionStatus,
} from "../../src/modules/recap/domain/submissionSchemas";

type SubmissionRow = {
  id: string;
  session_id: string;
  team_id: string;
  team_name: string;
  activity_id: string;
  journey_round: number;
  response_text: string;
  status: SubmissionStatus;
  feedback_text: string | null;
  awarded_points: number;
  revision: number;
  submitted_at: string;
  reviewed_at: string | null;
};

export class D1SubmissionRepository implements SubmissionRepository {
  constructor(private readonly database: D1Database) {}

  async findActiveParticipant(tokenHash: string, now: string) {
    return this.database
      .prepare(
        `SELECT id, team_id FROM participant_sessions
         WHERE token_hash = ? AND revoked_at IS NULL AND expires_at > ? LIMIT 1`,
      )
      .bind(tokenHash, now)
      .first<{ id: string; team_id: string }>()
      .then((row) => (row ? { id: row.id, teamId: row.team_id } : null));
  }

  async saveSubmission(input: {
    readonly id: string;
    readonly sessionId: string;
    readonly command: CreateSubmissionCommand;
    readonly submittedAt: string;
  }): Promise<ActivitySubmission> {
    await this.database
      .prepare(
        `INSERT INTO activity_submissions
         (id, session_id, team_id, activity_id, journey_round, response_text, status, submitted_at, created_at, updated_at)
         VALUES (?, ?, ?, ?, ?, ?, 'SUBMITTED', ?, ?, ?)
         ON CONFLICT(session_id, team_id, activity_id, journey_round) DO UPDATE SET
           response_text = excluded.response_text,
           status = 'SUBMITTED', feedback_text = NULL, awarded_points = 0,
           revision = activity_submissions.revision + 1, submitted_at = excluded.submitted_at,
           reviewed_at = NULL, updated_at = excluded.updated_at`,
      )
      .bind(
        input.id,
        input.sessionId,
        input.command.teamId,
        input.command.activityId,
        input.command.journeyRound,
        input.command.responseText,
        input.submittedAt,
        input.submittedAt,
        input.submittedAt,
      )
      .run();
    const submission = await this.database
      .prepare(
        `${submissionSelect} WHERE s.session_id = ? AND s.team_id = ? AND s.activity_id = ? AND s.journey_round = ?`,
      )
      .bind(
        input.sessionId,
        input.command.teamId,
        input.command.activityId,
        input.command.journeyRound,
      )
      .first<SubmissionRow>();
    if (!submission) throw new Error("Submission was not found after save.");
    return mapSubmission(submission);
  }

  async findSubmissions(sessionId: string): Promise<readonly ActivitySubmission[]> {
    const result = await this.database
      .prepare(`${submissionSelect} WHERE s.session_id = ? ORDER BY s.submitted_at DESC`)
      .bind(sessionId)
      .all<SubmissionRow>();
    return result.results.map(mapSubmission);
  }

  async reviewSubmission(input: {
    readonly submissionId: string;
    readonly command: ReviewSubmissionCommand;
    readonly reviewedAt: string;
  }): Promise<ActivitySubmission | null> {
    await this.database
      .prepare(
        `UPDATE activity_submissions SET status = ?, feedback_text = ?, awarded_points = ?,
         reviewed_at = ?, updated_at = ? WHERE id = ? AND status = 'SUBMITTED'`,
      )
      .bind(
        input.command.status,
        input.command.feedbackText,
        input.command.awardedPoints,
        input.reviewedAt,
        input.reviewedAt,
        input.submissionId,
      )
      .run();
    const row = await this.database
      .prepare(`${submissionSelect} WHERE s.id = ?`)
      .bind(input.submissionId)
      .first<SubmissionRow>();
    return row ? mapSubmission(row) : null;
  }
}

const submissionSelect = `SELECT s.id, s.session_id, s.team_id, t.display_name AS team_name,
  s.activity_id, s.journey_round, s.response_text, s.status, s.feedback_text, s.awarded_points,
  s.revision, s.submitted_at, s.reviewed_at FROM activity_submissions s
  JOIN teams t ON t.id = s.team_id`;

function mapSubmission(row: SubmissionRow): ActivitySubmission {
  return {
    id: row.id,
    sessionId: row.session_id,
    teamId: row.team_id,
    teamName: row.team_name,
    activityId: row.activity_id,
    journeyRound: row.journey_round,
    responseText: row.response_text,
    status: row.status,
    feedbackText: row.feedback_text,
    awardedPoints: row.awarded_points,
    revision: row.revision,
    submittedAt: row.submitted_at,
    reviewedAt: row.reviewed_at,
  };
}
