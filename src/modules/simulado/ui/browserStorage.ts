import type { AttemptStorage } from "../application/simuladoService";
import type { SimuladoAttempt } from "../domain/simuladoTypes";

const STORAGE_KEY = "recap_simulado_active_attempt_v1";

export const browserAttemptStorage: AttemptStorage = {
  save(attempt: SimuladoAttempt): void {
    try {
      if (typeof window !== "undefined" && window.localStorage) {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(attempt));
      }
    } catch {
      // Ignore quota or security errors in strict browsing modes
    }
  },

  load(): SimuladoAttempt | null {
    try {
      if (typeof window !== "undefined" && window.localStorage) {
        const raw = window.localStorage.getItem(STORAGE_KEY);
        if (!raw) return null;
        return JSON.parse(raw) as SimuladoAttempt;
      }
    } catch {
      return null;
    }
    return null;
  },

  clear(): void {
    try {
      if (typeof window !== "undefined" && window.localStorage) {
        window.localStorage.removeItem(STORAGE_KEY);
      }
    } catch {
      // Ignore
    }
  },
};
