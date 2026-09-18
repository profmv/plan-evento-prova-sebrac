import type { RankingEntry } from "./recapSchemas";

export type TeamScoreProjection = Omit<RankingEntry, "rank">;

export function rankTeams(projections: readonly TeamScoreProjection[]): readonly RankingEntry[] {
  const sorted = [...projections].sort((left, right) => {
    if (left.totalPoints !== right.totalPoints) {
      return right.totalPoints - left.totalPoints;
    }

    const byName = left.displayName.localeCompare(right.displayName, "pt-BR", {
      sensitivity: "base",
    });
    if (byName !== 0) {
      return byName;
    }
    return left.id.localeCompare(right.id);
  });

  let previousPoints: number | undefined;
  let currentRank = 0;

  return sorted.map((team, index) => {
    if (previousPoints === undefined || team.totalPoints !== previousPoints) {
      currentRank = index + 1;
      previousPoints = team.totalPoints;
    }

    return {
      ...team,
      rank: currentRank,
    };
  });
}
