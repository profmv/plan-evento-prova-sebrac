import type { z } from "zod";
import { RecapApplicationError } from "../../src/modules/recap/application/recapService";

const maximumJsonBytes = 64 * 1024;

const jsonHeaders = {
  "cache-control": "no-store",
  "content-type": "application/json; charset=utf-8",
  "referrer-policy": "no-referrer",
  "x-content-type-options": "nosniff",
} as const;

export function getRequestId(request: Request): string {
  return request.headers.get("cf-ray") ?? crypto.randomUUID();
}

export function jsonResponse(data: unknown, status = 200, headers?: HeadersInit): Response {
  return Response.json(data, {
    headers: {
      ...jsonHeaders,
      ...headers,
    },
    status,
  });
}

export async function parseJson<T>(request: Request, schema: z.ZodType<T>): Promise<T> {
  const contentType = request.headers.get("content-type")?.toLowerCase() ?? "";
  if (!contentType.startsWith("application/json")) {
    throw new ApiInputError("CONTENT_TYPE_REQUIRED", "Envie o corpo como application/json.", []);
  }

  const declaredLength = Number(request.headers.get("content-length") ?? "0");
  if (Number.isFinite(declaredLength) && declaredLength > maximumJsonBytes) {
    throw new ApiInputError("BODY_TOO_LARGE", "O corpo da requisição excede 64 KiB.", []);
  }

  let value: unknown;
  try {
    const text = await request.text();
    if (new TextEncoder().encode(text).byteLength > maximumJsonBytes) {
      throw new ApiInputError("BODY_TOO_LARGE", "O corpo da requisição excede 64 KiB.", []);
    }
    value = JSON.parse(text) as unknown;
  } catch (error) {
    if (error instanceof ApiInputError) {
      throw error;
    }
    throw new ApiInputError("INVALID_JSON", "O corpo não contém JSON válido.", []);
  }

  const result = schema.safeParse(value);
  if (!result.success) {
    throw new ApiInputError(
      "VALIDATION_ERROR",
      "Revise os campos informados.",
      result.error.issues.map((issue) => ({
        path: issue.path.join("."),
        message: issue.message,
      })),
    );
  }
  return result.data;
}

export function apiErrorResponse(error: unknown, requestId: string): Response {
  if (error instanceof ApiInputError) {
    return jsonResponse(
      {
        code: error.code,
        message: error.message,
        requestId,
        fields: error.fields,
      },
      error.status,
    );
  }

  if (error instanceof RecapApplicationError) {
    return jsonResponse(
      {
        code: error.code,
        message: error.message,
        requestId,
      },
      error.status,
    );
  }

  console.error(
    JSON.stringify({
      level: "error",
      requestId,
      error: error instanceof Error ? error.name : "UnknownError",
      message: error instanceof Error ? error.message : "Unknown failure",
    }),
  );

  return jsonResponse(
    {
      code: "INTERNAL_ERROR",
      message: "Não foi possível concluir a operação.",
      requestId,
    },
    500,
  );
}

export class ApiInputError extends Error {
  readonly status = 400;

  constructor(
    readonly code: string,
    message: string,
    readonly fields: readonly { readonly path: string; readonly message: string }[],
  ) {
    super(message);
    this.name = "ApiInputError";
  }
}
