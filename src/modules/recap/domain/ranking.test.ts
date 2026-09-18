import { describe, expect, it } from "vitest";
import { rankTeams, type TeamScoreProjection } from "./ranking";

const teams: readonly TeamScoreProjection[] = [
  { id: "b", displayName: "Equipe Beta", colorToken: "blue", totalPoints: 20, eventCount: 2 },
  { id: "a", displayName: "Equipe Alfa", colorToken: "orange", totalPoints: 30, eventCount: 3 },
  { id: "g", displayName: "Equipe Gama", colorToken: "green", totalPoints: 20, eventCount: 1 },
];

describe("rankTeams", () => {
  it("sorts by points and assigns competition ranks", () => {
    const ranking = rankTeams(teams);

    expect(ranking.map((team) => [team.displayName, team.rank])).toEqual([
      ["Equipe Alfa", 1],
      ["Equipe Beta", 2],
      ["Equipe Gama", 2],
    ]);
  });

  it("is deterministic without inventing a tie breaker", () => {
    const ranking = rankTeams([...teams].reverse());

    expect(ranking[1]?.rank).toBe(2);
    expect(ranking[2]?.rank).toBe(2);
    expect(ranking.map((team) => team.displayName)).toEqual([
      "Equipe Alfa",
      "Equipe Beta",
      "Equipe Gama",
    ]);
  });

  it("does not mutate the input projection", () => {
    const input = [...teams];

    rankTeams(input);

    expect(input).toEqual(teams);
  });
});
