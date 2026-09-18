import { z } from "zod";

export const axisIdSchema = z.enum(["support", "networks", "development"]);
export const contentStatusSchema = z.enum([
  "DRAFT",
  "IN_REVIEW",
  "APPROVED",
  "REJECTED",
  "RETIRED",
]);
export const difficultySchema = z.enum(["FOUNDATION", "INTERMEDIATE", "ADVANCED"]);
export const unitIdSchema = z.string().regex(/^UC(?:0[1-9]|1[0-6])$/, {
  message: "A unidade curricular deve usar o formato UC01 a UC16.",
});

const nonEmptyTextSchema = z.string().trim().min(1);
const identifierSchema = z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
  message: "O identificador deve usar letras minúsculas, números e hífens.",
});

export const courseUnitSchema = z.object({
  id: unitIdSchema,
  number: z.number().int().min(1).max(16),
  title: nonEmptyTextSchema,
  workloadHours: z.number().int().positive(),
  axisId: axisIdSchema,
  kind: z.enum(["COMPETENCY", "INTEGRATING_PROJECT"]),
  prerequisiteUnitIds: z.array(unitIdSchema),
  corequisiteUnitIds: z.array(unitIdSchema),
});

export const courseAxisSchema = z.object({
  id: axisIdSchema,
  title: nonEmptyTextSchema,
  qualificationTitle: nonEmptyTextSchema,
  workloadHours: z.number().int().positive(),
  unitIds: z.array(unitIdSchema).min(1),
});

export const courseTaxonomySchema = z
  .object({
    schemaVersion: z.literal(1),
    courseId: z.literal("tecnico-em-informatica-mf2023"),
    title: nonEmptyTextSchema,
    totalWorkloadHours: z.literal(1200),
    axes: z.array(courseAxisSchema).length(3),
    units: z.array(courseUnitSchema).length(16),
    source: z.object({
      document: nonEmptyTextSchema,
      pages: z.array(z.number().int().positive()).min(1),
    }),
  })
  .superRefine((taxonomy, context) => {
    const unitIds = taxonomy.units.map((unit) => unit.id);
    const uniqueUnitIds = new Set(unitIds);

    if (uniqueUnitIds.size !== unitIds.length) {
      context.addIssue({
        code: "custom",
        message: "As unidades curriculares devem possuir identificadores únicos.",
        path: ["units"],
      });
    }

    const allAxisUnitIds = taxonomy.axes.flatMap((axis) => axis.unitIds);
    const uniqueAxisUnitIds = new Set(allAxisUnitIds);
    if (allAxisUnitIds.length !== 16 || uniqueAxisUnitIds.size !== 16) {
      context.addIssue({
        code: "custom",
        message: "Os três eixos devem classificar exatamente as 16 UCs, sem repetição.",
        path: ["axes"],
      });
    }

    for (const axis of taxonomy.axes) {
      const assignedUnits = taxonomy.units.filter((unit) => unit.axisId === axis.id);
      const assignedHours = assignedUnits.reduce((total, unit) => total + unit.workloadHours, 0);
      const declaredIds = new Set(axis.unitIds);

      if (assignedHours !== axis.workloadHours) {
        context.addIssue({
          code: "custom",
          message: `A carga horária calculada do eixo ${axis.id} não coincide com a declarada.`,
          path: ["axes", taxonomy.axes.indexOf(axis), "workloadHours"],
        });
      }

      if (assignedUnits.some((unit) => !declaredIds.has(unit.id))) {
        context.addIssue({
          code: "custom",
          message: `A lista de UCs do eixo ${axis.id} diverge das UCs classificadas.`,
          path: ["axes", taxonomy.axes.indexOf(axis), "unitIds"],
        });
      }
    }

    const totalHours = taxonomy.units.reduce((total, unit) => total + unit.workloadHours, 0);
    if (totalHours !== taxonomy.totalWorkloadHours) {
      context.addIssue({
        code: "custom",
        message: "A soma das cargas horárias das UCs deve ser 1.200 horas.",
        path: ["totalWorkloadHours"],
      });
    }
  });

const contentSourceSchema = z
  .object({
    kind: z.enum(["COURSE_PLAN", "ORIGINAL", "EXTERNAL"]),
    reference: nonEmptyTextSchema,
    license: z.string().trim().min(1).optional(),
    attribution: z.string().trim().min(1).optional(),
  })
  .superRefine((source, context) => {
    if (source.kind === "EXTERNAL" && (!source.license || !source.attribution)) {
      context.addIssue({
        code: "custom",
        message: "Conteúdo externo exige licença e atribuição explícitas.",
      });
    }
  });

const baseQuestionSchema = z.object({
  id: identifierSchema,
  version: z.number().int().positive(),
  status: contentStatusSchema,
  axisId: axisIdSchema,
  unitIds: z.array(unitIdSchema).min(1),
  difficulty: difficultySchema,
  prompt: nonEmptyTextSchema,
  explanation: z.string().trim().min(20),
  source: contentSourceSchema,
  tags: z.array(identifierSchema).min(1),
});

const multipleChoiceQuestionSchema = baseQuestionSchema
  .extend({
    type: z.literal("MULTIPLE_CHOICE"),
    options: z
      .array(
        z.object({
          id: identifierSchema,
          text: nonEmptyTextSchema,
        }),
      )
      .min(3)
      .max(6),
    correctOptionId: identifierSchema,
  })
  .superRefine((question, context) => {
    const optionIds = question.options.map((option) => option.id);
    const normalizedTexts = question.options.map((option) =>
      option.text.toLocaleLowerCase("pt-BR"),
    );

    if (new Set(optionIds).size !== optionIds.length) {
      context.addIssue({
        code: "custom",
        message: "As alternativas devem ter IDs únicos.",
        path: ["options"],
      });
    }
    if (new Set(normalizedTexts).size !== normalizedTexts.length) {
      context.addIssue({
        code: "custom",
        message: "As alternativas não podem repetir o mesmo texto.",
        path: ["options"],
      });
    }
    if (!optionIds.includes(question.correctOptionId)) {
      context.addIssue({
        code: "custom",
        message: "A alternativa correta deve existir na lista de alternativas.",
        path: ["correctOptionId"],
      });
    }
  });

const trueFalseQuestionSchema = baseQuestionSchema.extend({
  type: z.literal("TRUE_FALSE"),
  correctAnswer: z.boolean(),
});

const shortAnswerQuestionSchema = baseQuestionSchema.extend({
  type: z.literal("SHORT_ANSWER"),
  acceptedAnswers: z.array(nonEmptyTextSchema).min(1),
  normalization: z.object({
    trimWhitespace: z.boolean().default(true),
    collapseWhitespace: z.boolean().default(true),
    ignoreCase: z.boolean().default(true),
    ignoreDiacritics: z.boolean().default(false),
    ignorePunctuation: z.boolean().default(false),
  }),
});

export const questionSchema = z.union([
  multipleChoiceQuestionSchema,
  trueFalseQuestionSchema,
  shortAnswerQuestionSchema,
]);

export const activitySchema = z.object({
  id: identifierSchema,
  version: z.number().int().positive(),
  status: contentStatusSchema,
  axisId: axisIdSchema,
  unitIds: z.array(unitIdSchema).min(1),
  difficulty: difficultySchema,
  type: z.enum(["QUIZ", "PROBLEM", "PROJECT", "PRESENTATION", "INTERACTIVE"]),
  title: nonEmptyTextSchema,
  summary: z.string().trim().min(20),
  estimatedMinutes: z.number().int().min(3).max(180),
  instructions: z.array(nonEmptyTextSchema).min(1),
  materials: z.array(nonEmptyTextSchema),
  expectedEvidence: nonEmptyTextSchema,
  scoring: z.object({
    maxPoints: z.number().int().positive(),
    criteria: z.array(nonEmptyTextSchema).min(1),
  }),
  source: contentSourceSchema,
});

export type CourseTaxonomy = z.infer<typeof courseTaxonomySchema>;
export type CourseAxis = z.infer<typeof courseAxisSchema>;
export type CourseUnit = z.infer<typeof courseUnitSchema>;
export type Question = z.infer<typeof questionSchema>;
export type Activity = z.infer<typeof activitySchema>;
