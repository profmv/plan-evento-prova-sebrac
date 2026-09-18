import { RecapApplicationError } from "../../src/modules/recap/application/recapService";
import type { Env } from "./env";

export async function authorizeAdmin(request: Request, env: Env): Promise<string> {
  const configuredSecret = env.ADMIN_SECRET;
  if (!configuredSecret || configuredSecret.length < 24) {
    throw new RecapApplicationError(
      "ADMIN_AUTH_NOT_CONFIGURED",
      "A autorização do professor ainda não foi configurada neste ambiente.",
      503,
    );
  }

  const header = request.headers.get("authorization") ?? "";
  const match = /^Bearer\s+(.+)$/iu.exec(header);
  if (!match?.[1]) {
    throw new RecapApplicationError(
      "ADMIN_AUTH_REQUIRED",
      "Informe a credencial administrativa para continuar.",
      401,
    );
  }

  const [providedHash, expectedHash] = await Promise.all([
    digest(match[1]),
    digest(configuredSecret),
  ]);
  if (!constantTimeEqual(providedHash.bytes, expectedHash.bytes)) {
    throw new RecapApplicationError(
      "ADMIN_AUTH_INVALID",
      "A credencial administrativa não é válida.",
      403,
    );
  }

  return `admin:${expectedHash.hex.slice(0, 16)}`;
}

async function digest(
  value: string,
): Promise<{ readonly bytes: Uint8Array; readonly hex: string }> {
  const bytes = new Uint8Array(
    await crypto.subtle.digest("SHA-256", new TextEncoder().encode(value)),
  );
  return {
    bytes,
    hex: Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0")).join(""),
  };
}

function constantTimeEqual(left: Uint8Array, right: Uint8Array): boolean {
  if (left.length !== right.length) {
    return false;
  }

  let difference = 0;
  for (let index = 0; index < left.length; index += 1) {
    difference |= (left[index] ?? 0) ^ (right[index] ?? 0);
  }
  return difference === 0;
}
