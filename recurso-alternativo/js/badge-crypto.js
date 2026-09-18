/**
 * Badge Cryptographic Engine - Recap SENAC 2026
 * Generates and validates cryptographic badges linked to student names.
 * Uses native Web Crypto API (SHA-256).
 */

const BadgeCrypto = (function () {
    const INSTITUTIONAL_SALT = "SENAC-TI-TURMA001-2026-RECAP-SECURE-KEY";

    /**
     * Converts an ArrayBuffer to a hex string
     * @param {ArrayBuffer} buffer
     * @returns {string}
     */
    function bufferToHex(buffer) {
        const byteArray = new Uint8Array(buffer);
        const hexCodes = [];
        for (let i = 0; i < byteArray.length; i++) {
            const hex = byteArray[i].toString(16).padStart(2, '0');
            hexCodes.push(hex);
        }
        return hexCodes.join('');
    }

    /**
     * Generates a cryptographic SHA-256 hash for a student badge
     * @param {string} studentName
     * @param {string} minigameId
     * @param {string} timestampIso
     * @param {string} details
     * @returns {Promise<string>}
     */
    async function generateBadgeHash(studentName, minigameId, timestampIso, details = "") {
        const normalizedName = (studentName || "ALUNO").trim().toUpperCase();
        const rawPayload = [
            "RECAP-SENAC-2026",
            normalizedName,
            minigameId,
            timestampIso,
            details,
            INSTITUTIONAL_SALT
        ].join("|");

        const encoder = new TextEncoder();
        const data = encoder.encode(rawPayload);
        const hashBuffer = await window.crypto.subtle.digest("SHA-256", data);
        return bufferToHex(hashBuffer);
    }

    /**
     * Generates a short verification code from the full hash
     * @param {string} fullHash
     * @returns {string}
     */
    function formatVerificationCode(fullHash) {
        if (!fullHash || fullHash.length < 16) return "SENAC-RECAP-UNKNOWN";
        const part1 = fullHash.substring(0, 4).toUpperCase();
        const part2 = fullHash.substring(4, 8).toUpperCase();
        const part3 = fullHash.substring(8, 12).toUpperCase();
        const part4 = fullHash.substring(12, 16).toUpperCase();
        return `SENAC-${part1}-${part2}-${part3}-${part4}`;
    }

    return {
        generateBadgeHash: generateBadgeHash,
        formatVerificationCode: formatVerificationCode
    };
})();

if (typeof window !== "undefined") {
    window.BadgeCrypto = BadgeCrypto;
}
