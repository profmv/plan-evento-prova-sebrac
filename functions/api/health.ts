import type { Env } from "../_shared/env";

type HealthResponse = {
  readonly status: "ok";
  readonly environment: string;
  readonly version: string;
  readonly requestId: string;
};

const responseHeaders = {
  "cache-control": "no-store",
  "content-type": "application/json; charset=utf-8",
  "x-content-type-options": "nosniff",
} as const;

export const onRequestGet: PagesFunction<Env> = async (context) => {
  const requestId = context.request.headers.get("cf-ray") ?? crypto.randomUUID();
  const payload: HealthResponse = {
    status: "ok",
    environment: context.env.APP_ENV ?? "local",
    version: context.env.APP_VERSION ?? "0.1.0",
    requestId,
  };

  return Response.json(payload, {
    headers: responseHeaders,
    status: 200,
  });
};

export const onRequest: PagesFunction<Env> = async (context) => {
  if (context.request.method === "GET") {
    return onRequestGet(context);
  }

  return Response.json(
    {
      code: "METHOD_NOT_ALLOWED",
      message: "Método não permitido para este recurso.",
      requestId: context.request.headers.get("cf-ray") ?? crypto.randomUUID(),
    },
    {
      headers: {
        ...responseHeaders,
        allow: "GET",
      },
      status: 405,
    },
  );
};
