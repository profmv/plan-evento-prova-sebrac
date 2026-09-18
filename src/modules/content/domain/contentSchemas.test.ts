import { describe, expect, it } from "vitest";
import taxonomyJson from "../../../../content/taxonomy/course.json";
import { courseTaxonomySchema, questionSchema } from "./contentSchemas";

describe("courseTaxonomySchema", () => {
  it("validates the 16 course units and 1,200 workload hours", () => {
    const taxonomy = courseTaxonomySchema.parse(taxonomyJson);

    expect(taxonomy.axes).toHaveLength(3);
    expect(taxonomy.units).toHaveLength(16);
    expect(taxonomy.units.reduce((total, unit) => total + unit.workloadHours, 0)).toBe(1200);
    expect(taxonomy.axes.map((axis) => axis.workloadHours)).toEqual([272, 308, 620]);
  });

  it("rejects a taxonomy that leaves a unit outside the axes", () => {
    const changed = structuredClone(taxonomyJson);
    changed.axes[0]?.unitIds.pop();

    expect(courseTaxonomySchema.safeParse(changed).success).toBe(false);
  });
});

describe("questionSchema", () => {
  const baseQuestion = {
    id: "support-cpu-001",
    version: 1,
    status: "APPROVED",
    axisId: "support",
    unitIds: ["UC01"],
    difficulty: "FOUNDATION",
    prompt: "Qual componente executa as instruções principais de um computador?",
    explanation: "A CPU interpreta e executa instruções, coordenando as operações do sistema.",
    source: {
      kind: "COURSE_PLAN",
      reference: "UC01",
    },
    tags: ["hardware", "cpu"],
  } as const;

  it("accepts a well-formed multiple-choice question", () => {
    const result = questionSchema.safeParse({
      ...baseQuestion,
      type: "MULTIPLE_CHOICE",
      options: [
        { id: "cpu", text: "Processador" },
        { id: "ram", text: "Memória RAM" },
        { id: "psu", text: "Fonte de alimentação" },
      ],
      correctOptionId: "cpu",
    });

    expect(result.success).toBe(true);
  });

  it("rejects a correct option that is not present", () => {
    const result = questionSchema.safeParse({
      ...baseQuestion,
      type: "MULTIPLE_CHOICE",
      options: [
        { id: "cpu", text: "Processador" },
        { id: "ram", text: "Memória RAM" },
        { id: "psu", text: "Fonte de alimentação" },
      ],
      correctOptionId: "missing",
    });

    expect(result.success).toBe(false);
  });

  it("requires license and attribution for external material", () => {
    const result = questionSchema.safeParse({
      ...baseQuestion,
      type: "TRUE_FALSE",
      correctAnswer: true,
      source: {
        kind: "EXTERNAL",
        reference: "https://example.invalid/question",
      },
    });

    expect(result.success).toBe(false);
  });
});
