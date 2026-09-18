import { createRecapService } from "../../../src/modules/recap/application/recapService";
import { createSubmissionService } from "../../../src/modules/recap/application/submissionService";
import {
  addScoreEventCommandSchema,
  createSessionCommandSchema,
  idempotencyKeySchema,
  joinSessionCommandSchema,
  publicCodeSchema,
  sessionIdSchema,
  updateSessionCommandSchema,
} from "../../../src/modules/recap/domain/recapSchemas";
import {
  createSubmissionCommandSchema,
  reviewSubmissionCommandSchema,
  submissionIdSchema,
} from "../../../src/modules/recap/domain/submissionSchemas";
import { authorizeAdmin } from "../../_shared/adminAuth";
import { D1RecapRepository } from "../../_shared/d1RecapRepository";
import { D1SubmissionRepository } from "../../_shared/d1SubmissionRepository";
import type { Env } from "../../_shared/env";
import {
  ApiInputError,
  apiErrorResponse,
  getRequestId,
  jsonResponse,
  parseJson,
} from "../../_shared/http";
import { systemClock, webCrypto } from "../../_shared/recapRuntime";

export const onRequest: PagesFunction<Env> = async (context) => {
  const requestId = getRequestId(context.request);
  const url = new URL(context.request.url);
  const route = url.pathname.replace(/^\/api\/v1\/?/u, "").replace(/\/$/u, "");
  const service = createRecapService({
    repository: new D1RecapRepository(context.env.DB),
    clock: systemClock,
    crypto: webCrypto,
  });
  const submissionService = createSubmissionService({
    repository: new D1SubmissionRepository(context.env.DB),
    now: () => systemClock.now(),
    randomUuid: () => webCrypto.randomUuid(),
    sha256: (value) => webCrypto.sha256(value),
  });

  try {
    if (context.request.method === "POST" && route === "sessions") {
      const actorId = await authorizeAdmin(context.request, context.env);
      const command = await parseJson(context.request, createSessionCommandSchema);
      const session = await service.createSession({ command, actorId, requestId });
      return jsonResponse({ data: session, requestId }, 201);
    }

    if (context.request.method === "GET" && route.startsWith("sessions/code/")) {
      const code = parsePathValue(publicCodeSchema, route.slice("sessions/code/".length));
      const session = await service.getPublicSession(code);
      return jsonResponse({ data: session, requestId });
    }

    if (context.request.method === "POST" && route === "join") {
      const command = await parseJson(context.request, joinSessionCommandSchema);
      const participation = await service.joinSession(command);
      return jsonResponse({ data: participation, requestId }, 201);
    }

    const sessionMatch = /^sessions\/([^/]+)$/u.exec(route);
    if (context.request.method === "PATCH" && sessionMatch?.[1]) {
      const actorId = await authorizeAdmin(context.request, context.env);
      const sessionId = parsePathValue(sessionIdSchema, sessionMatch[1]);
      const command = await parseJson(context.request, updateSessionCommandSchema);
      const session = await service.updateSession({ sessionId, command, actorId, requestId });
      return jsonResponse({ data: session, requestId });
    }

    const rankingMatch = /^sessions\/([^/]+)\/ranking$/u.exec(route);
    if (context.request.method === "GET" && rankingMatch?.[1]) {
      const sessionId = parsePathValue(sessionIdSchema, rankingMatch[1]);
      const ranking = await service.getRanking(sessionId);
      return jsonResponse({ data: ranking, requestId });
    }

    const submissionsMatch = /^sessions\/([^/]+)\/submissions$/u.exec(route);
    if (submissionsMatch?.[1]) {
      const sessionId = parsePathValue(sessionIdSchema, submissionsMatch[1]);
      if (context.request.method === "POST") {
        const participantToken = context.request.headers.get("x-participant-token")?.trim() ?? "";
        if (participantToken.length < 20) {
          throw new ApiInputError(
            "INVALID_PARTICIPANT_TOKEN",
            "A identificação da equipe é inválida.",
            [],
          );
        }
        const command = await parseJson(context.request, createSubmissionCommandSchema);
        const submission = await submissionService.submit({ sessionId, participantToken, command });
        return jsonResponse({ data: submission, requestId }, 201);
      }
      if (context.request.method === "GET") {
        await authorizeAdmin(context.request, context.env);
        const submissions = await submissionService.list(sessionId);
        return jsonResponse({ data: submissions, requestId });
      }
    }

    const submissionReviewMatch = /^submissions\/([^/]+)\/feedback$/u.exec(route);
    if (context.request.method === "PATCH" && submissionReviewMatch?.[1]) {
      const actorId = await authorizeAdmin(context.request, context.env);
      const submissionId = parsePathValue(submissionIdSchema, submissionReviewMatch[1]);
      const command = await parseJson(context.request, reviewSubmissionCommandSchema);
      const submission = await submissionService.review({ submissionId, command });
      if (submission.awardedPoints > 0) {
        await service.addScoreEvent({
          sessionId: submission.sessionId,
          command: {
            teamId: submission.teamId,
            points: submission.awardedPoints,
            reason: `Avaliação da atividade ${submission.activityId}`,
          },
          idempotencyKey: `submission-${submission.id}-revision-${submission.revision}`,
          actorId,
          requestId,
        });
      }
      return jsonResponse({ data: submission, requestId });
    }

    const scoreMatch = /^sessions\/([^/]+)\/score-events$/u.exec(route);
    if (context.request.method === "POST" && scoreMatch?.[1]) {
      const actorId = await authorizeAdmin(context.request, context.env);
      const sessionId = parsePathValue(sessionIdSchema, scoreMatch[1]);
      const idempotencyKey = parsePathValue(
        idempotencyKeySchema,
        context.request.headers.get("idempotency-key") ?? "",
      );
      const command = await parseJson(context.request, addScoreEventCommandSchema);
      const result = await service.addScoreEvent({
        sessionId,
        command,
        idempotencyKey,
        actorId,
        requestId,
      });
      return jsonResponse({ data: result, requestId }, result.applied ? 201 : 200);
    }

    return jsonResponse(
      { code: "ROUTE_NOT_FOUND", message: "Recurso não encontrado.", requestId },
      404,
    );
  } catch (error) {
    return apiErrorResponse(error, requestId);
  }
};

function parsePathValue<T>(
  schema: { safeParse(value: unknown): { success: true; data: T } | { success: false } },
  value: string,
): T {
  const result = schema.safeParse(decodeURIComponent(value));
  if (!result.success) {
    throw new ApiInputError(
      "INVALID_PATH_PARAMETER",
      "O identificador informado não é válido.",
      [],
    );
  }
  return result.data;
}
