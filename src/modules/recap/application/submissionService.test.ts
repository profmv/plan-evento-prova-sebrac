import { describe, expect, it } from "vitest";
import { createSubmissionService, type SubmissionRepository } from "./submissionService";

const submittedAt = "2026-09-18T12:00:00.000Z";

class InMemorySubmissionRepository implements SubmissionRepository {
  participant: { id: string; teamId: string } | null = { id: "participant-1", teamId: "team-1" };
  saved: unknown;

  async findActiveParticipant() {
    return this.participant;
  }

  async saveSubmission(input: Parameters<SubmissionRepository["saveSubmission"]>[0]) {
    this.saved = input;
    return {
      id: input.id,
      sessionId: input.sessionId,
      teamId: input.command.teamId,
      teamName: "Equipe Alfa",
      activityId: input.command.activityId,
      journeyRound: input.command.journeyRound,
      responseText: input.command.responseText,
      status: "SUBMITTED" as const,
      feedbackText: null,
      awardedPoints: 0,
      revision: 1,
      submittedAt: input.submittedAt,
      reviewedAt: null,
    };
  }

  async findSubmissions() {
    return [];
  }

  async reviewSubmission() {
    return null;
  }
}

function createService(repository = new InMemorySubmissionRepository()) {
  return {
    repository,
    service: createSubmissionService({
      repository,
      now: () => new Date(submittedAt),
      randomUuid: () => "submission-1",
      sha256: async (value) => `hash:${value}`,
    }),
  };
}

describe("SubmissionService", () => {
  it("persists a submission only for the authenticated team", async () => {
    const { repository, service } = createService();

    const saved = await service.submit({
      sessionId: "session-1",
      participantToken: "participant-token-valid",
      command: {
        teamId: "team-1",
        activityId: "uc01-mapa-de-componentes",
        journeyRound: 1,
        responseText: "Mapa de componentes com conexões e justificativas técnicas.",
      },
    });

    expect(saved.status).toBe("SUBMITTED");
    expect(repository.saved).toMatchObject({ sessionId: "session-1", submittedAt });
  });

  it("rejects a submission from another team", async () => {
    const { service } = createService();

    await expect(
      service.submit({
        sessionId: "session-1",
        participantToken: "participant-token-valid",
        command: {
          teamId: "team-2",
          activityId: "uc01-mapa-de-componentes",
          journeyRound: 1,
          responseText: "Mapa de componentes com conexões e justificativas técnicas.",
        },
      }),
    ).rejects.toMatchObject({ code: "PARTICIPANT_NOT_AUTHORIZED", status: 403 });
  });
});
