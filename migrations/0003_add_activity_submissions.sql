-- Summary: persists team activity submissions, review feedback, and completion state.

CREATE TABLE activity_submissions (
  id TEXT PRIMARY KEY NOT NULL,
  session_id TEXT NOT NULL,
  team_id TEXT NOT NULL,
  activity_id TEXT NOT NULL,
  journey_round INTEGER NOT NULL CHECK (journey_round BETWEEN 1 AND 3),
  response_text TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('SUBMITTED', 'NEEDS_REVISION', 'ACCEPTED')),
  feedback_text TEXT,
  awarded_points INTEGER NOT NULL DEFAULT 0 CHECK (awarded_points BETWEEN 0 AND 100),
  revision INTEGER NOT NULL DEFAULT 1 CHECK (revision > 0),
  submitted_at TEXT NOT NULL,
  reviewed_at TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  FOREIGN KEY (session_id) REFERENCES sessions(id) ON DELETE CASCADE,
  FOREIGN KEY (team_id) REFERENCES teams(id) ON DELETE RESTRICT,
  UNIQUE (session_id, team_id, activity_id, journey_round)
);

CREATE INDEX idx_activity_submissions_session ON activity_submissions(session_id, submitted_at DESC);
CREATE INDEX idx_activity_submissions_team ON activity_submissions(session_id, team_id, status);
