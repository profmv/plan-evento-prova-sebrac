-- Summary: persists the teacher-selected Recap journey round for every session.

ALTER TABLE sessions ADD COLUMN journey_round INTEGER NOT NULL DEFAULT 1 CHECK (journey_round BETWEEN 1 AND 3);
