-- Summary: creates the auditable session, team, round, and score-event model for the portal.
PRAGMA foreign_keys = ON;

CREATE TABLE sessions (
  id TEXT PRIMARY KEY NOT NULL,
  public_code TEXT NOT NULL COLLATE NOCASE,
  display_name TEXT NOT NULL,
  state TEXT NOT NULL CHECK (state IN ('DRAFT', 'LOBBY', 'ACTIVE', 'PAUSED', 'CLOSED')),
  ranking_visible INTEGER NOT NULL DEFAULT 1 CHECK (ranking_visible IN (0, 1)),
  configuration_json TEXT NOT NULL DEFAULT '{}',
  version INTEGER NOT NULL DEFAULT 1 CHECK (version > 0),
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  expires_at TEXT,
  UNIQUE (public_code)
);

CREATE TABLE teams (
  id TEXT PRIMARY KEY NOT NULL,
  session_id TEXT NOT NULL,
  display_name TEXT NOT NULL,
  normalized_name TEXT NOT NULL,
  color_token TEXT NOT NULL,
  is_active INTEGER NOT NULL DEFAULT 1 CHECK (is_active IN (0, 1)),
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  FOREIGN KEY (session_id) REFERENCES sessions(id) ON DELETE CASCADE,
  UNIQUE (session_id, normalized_name)
);

CREATE TABLE participant_sessions (
  id TEXT PRIMARY KEY NOT NULL,
  session_id TEXT NOT NULL,
  team_id TEXT NOT NULL,
  token_hash TEXT NOT NULL,
  optional_display_name TEXT,
  created_at TEXT NOT NULL,
  last_seen_at TEXT NOT NULL,
  expires_at TEXT NOT NULL,
  revoked_at TEXT,
  FOREIGN KEY (session_id) REFERENCES sessions(id) ON DELETE CASCADE,
  FOREIGN KEY (team_id) REFERENCES teams(id) ON DELETE RESTRICT,
  UNIQUE (token_hash)
);

CREATE TABLE activity_versions (
  id TEXT NOT NULL,
  version INTEGER NOT NULL CHECK (version > 0),
  status TEXT NOT NULL CHECK (status IN ('DRAFT', 'IN_REVIEW', 'APPROVED', 'REJECTED', 'RETIRED')),
  axis_id TEXT NOT NULL,
  title TEXT NOT NULL,
  definition_json TEXT NOT NULL,
  content_hash TEXT NOT NULL,
  created_at TEXT NOT NULL,
  PRIMARY KEY (id, version),
  UNIQUE (content_hash)
);

CREATE TABLE rounds (
  id TEXT PRIMARY KEY NOT NULL,
  session_id TEXT NOT NULL,
  activity_id TEXT NOT NULL,
  activity_version INTEGER NOT NULL,
  state TEXT NOT NULL CHECK (state IN ('READY', 'ACTIVE', 'PAUSED', 'CLOSED', 'CANCELLED')),
  sequence_number INTEGER NOT NULL CHECK (sequence_number > 0),
  started_at TEXT,
  closed_at TEXT,
  created_at TEXT NOT NULL,
  FOREIGN KEY (session_id) REFERENCES sessions(id) ON DELETE CASCADE,
  FOREIGN KEY (activity_id, activity_version) REFERENCES activity_versions(id, version) ON DELETE RESTRICT,
  UNIQUE (session_id, sequence_number)
);

CREATE TABLE score_events (
  id TEXT PRIMARY KEY NOT NULL,
  session_id TEXT NOT NULL,
  team_id TEXT NOT NULL,
  round_id TEXT,
  idempotency_key TEXT NOT NULL,
  kind TEXT NOT NULL CHECK (kind IN ('AUTOMATIC_AWARD', 'MANUAL_AWARD', 'ADJUSTMENT')),
  points INTEGER NOT NULL CHECK (points BETWEEN -100000 AND 100000),
  reason TEXT NOT NULL,
  actor_kind TEXT NOT NULL CHECK (actor_kind IN ('SYSTEM', 'TEACHER')),
  actor_id TEXT NOT NULL,
  metadata_json TEXT NOT NULL DEFAULT '{}',
  created_at TEXT NOT NULL,
  FOREIGN KEY (session_id) REFERENCES sessions(id) ON DELETE CASCADE,
  FOREIGN KEY (team_id) REFERENCES teams(id) ON DELETE RESTRICT,
  FOREIGN KEY (round_id) REFERENCES rounds(id) ON DELETE RESTRICT,
  UNIQUE (session_id, idempotency_key)
);

CREATE TABLE admin_audit_events (
  id TEXT PRIMARY KEY NOT NULL,
  session_id TEXT,
  actor_id TEXT NOT NULL,
  action TEXT NOT NULL,
  target_type TEXT NOT NULL,
  target_id TEXT,
  request_id TEXT NOT NULL,
  safe_details_json TEXT NOT NULL DEFAULT '{}',
  created_at TEXT NOT NULL,
  FOREIGN KEY (session_id) REFERENCES sessions(id) ON DELETE SET NULL
);

CREATE INDEX idx_sessions_state ON sessions(state);
CREATE INDEX idx_sessions_expires_at ON sessions(expires_at);
CREATE INDEX idx_teams_session ON teams(session_id, is_active);
CREATE INDEX idx_participants_session ON participant_sessions(session_id, revoked_at);
CREATE INDEX idx_rounds_session_state ON rounds(session_id, state);
CREATE INDEX idx_score_events_session_team ON score_events(session_id, team_id, created_at);
CREATE INDEX idx_score_events_round ON score_events(round_id, created_at);
CREATE INDEX idx_audit_session_created ON admin_audit_events(session_id, created_at);

CREATE VIEW team_score_totals AS
SELECT
  teams.session_id AS session_id,
  teams.id AS team_id,
  teams.display_name AS display_name,
  COALESCE(SUM(score_events.points), 0) AS total_points,
  COUNT(score_events.id) AS event_count
FROM teams
LEFT JOIN score_events ON score_events.team_id = teams.id
WHERE teams.is_active = 1
GROUP BY teams.session_id, teams.id, teams.display_name;
