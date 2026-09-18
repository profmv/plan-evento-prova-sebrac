import type {
  ActivitySubmission,
  CreateSubmissionCommand,
  ReviewSubmissionCommand,
} from "../domain/submissionSchemas";
import { RecapApplicationError } from "./recapService";

export type SubmissionParticipant = {
  readonly id: string;
  readonly teamId: string;
};

export interface SubmissionRepository {
  findActiveParticipant(tokenHash: string, now: string): Promise<SubmissionParticipant | null>;
  saveSubmission(input: {
    readonly id: string;
    readonly sessionId: string;
    readonly command: CreateSubmissionCommand;
    readonly submittedAt: string;
  }): Promise<ActivitySubmission>;
  findSubmissions(sessionId: string): Promise<readonly ActivitySubmission[]>;
  reviewSubmission(input: {
    readonly submissionId: string;
    readonly command: ReviewSubmissionCommand;
    readonly reviewedAt: string;
  }): Promise<ActivitySubmission | null>;
}

export function createSubmissionService(dependencies: {
  readonly repository: SubmissionRepository;
  readonly now: () => Date;
  readonly randomUuid: () => string;
  readonly sha256: (value: string) => Promise<string>;
}) {
  const { repository, now, randomUuid, sha256 } = dependencies;

  return {
    async submit(input: {
      readonly sessionId: string;
      readonly participantToken: string;
      readonly command: CreateSubmissionCommand;
    }) {
      const timestamp = now().toISOString();
      const participant = await repository.findActiveParticipant(
        await sha256(input.participantToken),
        timestamp,
      );
      if (!participant || participant.teamId !== input.command.teamId) {
        throw new RecapApplicationError(
          "PARTICIPANT_NOT_AUTHORIZED",
          "A participação da equipe não é válida para esta entrega.",
          403,
        );
      }
      return repository.saveSubmission({
        id: randomUuid(),
        sessionId: input.sessionId,
        command: input.command,
        submittedAt: timestamp,
      });
    },

    async list(sessionId: string) {
      return repository.findSubmissions(sessionId);
    },

    async review(input: {
      readonly submissionId: string;
      readonly command: ReviewSubmissionCommand;
    }) {
      const submission = await repository.reviewSubmission({
        submissionId: input.submissionId,
        command: input.command,
        reviewedAt: now().toISOString(),
      });
      if (!submission) {
        throw new RecapApplicationError("SUBMISSION_NOT_FOUND", "Entrega não encontrada.", 404);
      }
      return submission;
    },
  };
}
