import { z } from "zod";

const displayNameSchema = z.string().trim().min(2).max(80);

export const sessionIdSchema = z.uuid();
export const teamIdSchema = z.uuid();
export const roundIdSchema = z.uuid();
export const idempotencyKeySchema = z.string().trim().min(12).max(120);
export const publicCodeSchema = z
  .string()
  .trim()
  .toUpperCase()
  .regex(/^[A-Z0-9]{6,10}$/, {
    message: "O código deve conter de 6 a 10 letras ou números.",
  });

export const teamDraftSchema = z.object({
  displayName: displayNameSchema.max(40),
  colorToken: z.string().regex(/^[a-z][a-z0-9-]{1,30}$/),
});

export const createSessionCommandSchema = z
  .object({
    displayName: displayNameSchema,
    teams: z.array(teamDraftSchema).min(2).max(12),
    expiresAt: z.iso.datetime({ offset: true }).optional(),
  })
  .superRefine((command, context) => {
    const names = command.teams.map((team) => normalizeTeamName(team.displayName));
    if (new Set(names).size !== names.length) {
      context.addIssue({
        code: "custom",
        message: "Os nomes das equipes devem ser únicos na sessão.",
        path: ["teams"],
      });
    }
  });

export const joinSessionCommandSchema = z.object({
  publicCode: publicCodeSchema,
  teamId: teamIdSchema,
  optionalDisplayName: displayNameSchema.optional(),
});

export const addScoreEventCommandSchema = z.object({
  teamId: teamIdSchema,
  roundId: roundIdSchema.nullable().optional(),
  points: z.number().int().min(-1000).max(1000),
  reason: z.string().trim().min(5).max(240),
});

export const updateSessionCommandSchema = z
  .object({
    state: z.enum(["LOBBY", "ACTIVE", "PAUSED", "CLOSED"]).optional(),
    rankingVisible: z.boolean().optional(),
  })
  .refine((command) => command.state !== undefined || command.rankingVisible !== undefined, {
    message: "Informe ao menos uma alteração para a sessão.",
  });

export type CreateSessionCommand = z.infer<typeof createSessionCommandSchema>;
export type JoinSessionCommand = z.infer<typeof joinSessionCommandSchema>;
export type AddScoreEventCommand = z.infer<typeof addScoreEventCommandSchema>;
export type UpdateSessionCommand = z.infer<typeof updateSessionCommandSchema>;

export type PublicTeam = {
  readonly id: string;
  readonly displayName: string;
  readonly colorToken: string;
};

export type RankingEntry = PublicTeam & {
  readonly totalPoints: number;
  readonly eventCount: number;
  readonly rank: number;
};

export function normalizeTeamName(value: string): string {
  return value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()
    .replace(/\s+/g, " ")
    .toLocaleLowerCase("pt-BR");
}
