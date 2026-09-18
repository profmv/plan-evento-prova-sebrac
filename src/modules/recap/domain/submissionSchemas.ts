import { z } from "zod";

export const submissionIdSchema = z.uuid();

export const createSubmissionCommandSchema = z.object({
  teamId: z.uuid(),
  activityId: z
    .string()
    .trim()
    .min(3)
    .max(120)
    .regex(/^[a-z0-9-]+$/),
  journeyRound: z.number().int().min(1).max(3),
  responseText: z.string().trim().min(20).max(6000),
});

export const reviewSubmissionCommandSchema = z.object({
  status: z.enum(["NEEDS_REVISION", "ACCEPTED"]),
  feedbackText: z.string().trim().min(2).max(2000),
  awardedPoints: z.number().int().min(0).max(100),
});

export type CreateSubmissionCommand = z.infer<typeof createSubmissionCommandSchema>;
export type ReviewSubmissionCommand = z.infer<typeof reviewSubmissionCommandSchema>;

export type SubmissionStatus = "SUBMITTED" | "NEEDS_REVISION" | "ACCEPTED";

export type ActivitySubmission = {
  readonly id: string;
  readonly sessionId: string;
  readonly teamId: string;
  readonly teamName: string;
  readonly activityId: string;
  readonly journeyRound: number;
  readonly responseText: string;
  readonly status: SubmissionStatus;
  readonly feedbackText: string | null;
  readonly awardedPoints: number;
  readonly revision: number;
  readonly submittedAt: string;
  readonly reviewedAt: string | null;
};
