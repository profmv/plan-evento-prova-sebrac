/**
 * Minigame Communication Bridge - Recap SENAC 2026
 * Facilitates completion signaling from minigames to the centralizer hub.
 */

const MinigameBridge = (function () {
    const STORAGE_KEY_PREFIX = "SENAC_RECAP_MINIGAME_";

    /**
     * Signals that the minigame has been successfully completed.
     * @param {string} gameId
     * @param {object} metadata
     */
    function completeGame(gameId, metadata = {}) {
        const payload = {
            type: "SENAC_MINIGAME_COMPLETED",
            gameId: gameId,
            timestamp: new Date().toISOString(),
            score: metadata.score || 100,
            elapsedSeconds: metadata.elapsedSeconds || 0,
            details: metadata.details || "Concluído com sucesso"
        };

        // Notify parent window if running inside iframe or popup
        if (window.parent && window.parent !== window) {
            window.parent.postMessage(payload, "*");
        }
        if (window.opener && window.opener !== window) {
            window.opener.postMessage(payload, "*");
        }

        // Also persist in localStorage as a backup
        try {
            const rawStorage = localStorage.getItem("SENAC_RECAP_COMPLETED_GAMES") || "{}";
            const completed = JSON.parse(rawStorage);
            completed[gameId] = payload;
            localStorage.setItem("SENAC_RECAP_COMPLETED_GAMES", JSON.stringify(completed));
        } catch (e) {
            console.error("Failed to write to localStorage", e);
        }

        console.log(`[MinigameBridge] Minigame ${gameId} marked as completed.`);
    }

    return {
        completeGame: completeGame
    };
})();

if (typeof window !== "undefined") {
    window.MinigameBridge = MinigameBridge;
}
