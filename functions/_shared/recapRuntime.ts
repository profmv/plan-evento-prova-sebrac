import type { RecapClock, RecapCrypto } from "../../src/modules/recap/application/ports";

export const systemClock: RecapClock = {
  now: () => new Date(),
};

export const webCrypto: RecapCrypto = {
  randomUuid: () => crypto.randomUUID(),
  randomBytes(length) {
    const bytes = new Uint8Array(length);
    crypto.getRandomValues(bytes);
    return bytes;
  },
  async sha256(value) {
    const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(value));
    return Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, "0")).join(
      "",
    );
  },
};
