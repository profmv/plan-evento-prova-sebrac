import { describe, expect, it } from "vitest";
import type { Question } from "../../content/domain/contentSchemas";
import {
  calculateSummary,
  evaluateAnswer,
  filterQuestions,
  normalizeText,
  preparePresentedQuestions,
  shuffleArray,
} from "./simuladoEngine";

const qMc1: Question = {
  id: "q-mc-1",
  version: 1,
  status: "APPROVED",
  axisId: "support",
  unitIds: ["UC01"],
  difficulty: "FOUNDATION",
  type: "MULTIPLE_CHOICE",
  prompt: "Qual componente armazena dados temporariamente?",
  options: [
    { id: "opt-ram", text: "Memória RAM" },
    { id: "opt-ssd", text: "SSD NVMe" },
    { id: "opt-gpu", text: "Placa de Vídeo" },
  ],
  correctOptionId: "opt-ram",
  explanation: "A memória RAM é uma memória volátil usada para dados temporários.",
  source: { kind: "COURSE_PLAN", reference: "UC01" },
  tags: ["ram", "hardware"],
};

const qTf1: Question = {
  id: "q-tf-1",
  version: 1,
  status: "APPROVED",
  axisId: "networks",
  unitIds: ["UC05"],
  difficulty: "INTERMEDIATE",
  type: "TRUE_FALSE",
  prompt: "O protocolo TCP garante entrega ordenada de pacotes.",
  correctAnswer: true,
  explanation: "O TCP é orientado a conexão e garante entrega ordenada e sem perda.",
  source: { kind: "COURSE_PLAN", reference: "UC05" },
  tags: ["tcp", "redes"],
};

const qSa1: Question = {
  id: "q-sa-1",
  version: 1,
  status: "APPROVED",
  axisId: "development",
  unitIds: ["UC10"],
  difficulty: "FOUNDATION",
  type: "SHORT_ANSWER",
  prompt: "Qual cláusula SQL define critérios de filtro para linhas individuais?",
  acceptedAnswers: ["WHERE", "where"],
  normalization: {
    trimWhitespace: true,
    collapseWhitespace: true,
    ignoreCase: true,
    ignoreDiacritics: true,
    ignorePunctuation: true,
  },
  explanation: "A cláusula WHERE filtra registros antes de qualquer agrupamento.",
  source: { kind: "COURSE_PLAN", reference: "UC10" },
  tags: ["sql", "where"],
};

const sampleQuestions: readonly Question[] = [qMc1, qTf1, qSa1];

describe("simuladoEngine", () => {
  it("normalizes text according to options", () => {
    const res = normalizeText("  ÁÉÍÓÚ 123!  ", {
      trimWhitespace: true,
      collapseWhitespace: true,
      ignoreCase: true,
      ignoreDiacritics: true,
      ignorePunctuation: true,
    });
    expect(res).toBe("aeiou 123");
  });

  it("filters questions correctly by axis and difficulty", () => {
    const supportOnly = filterQuestions(sampleQuestions, { axisId: "support", difficulty: "all" });
    expect(supportOnly).toHaveLength(1);
    expect(supportOnly[0]?.id).toBe("q-mc-1");

    const foundationOnly = filterQuestions(sampleQuestions, {
      axisId: "all",
      difficulty: "FOUNDATION",
    });
    expect(foundationOnly).toHaveLength(2);
  });

  it("shuffles array deterministically with a mock random function", () => {
    const items = [1, 2, 3, 4];
    const shuffled = shuffleArray(items, () => 0.5);
    expect(shuffled).toHaveLength(4);
    expect(new Set(shuffled).size).toBe(4);
  });

  it("shuffles multiple choice options while preserving option identity", () => {
    const presented = preparePresentedQuestions([qMc1], 1);
    expect(presented).toHaveLength(1);
    const item = presented[0];
    expect(item?.presentedOptions).toBeDefined();
    expect(item?.presentedOptions).toHaveLength(3);

    const ids = item?.presentedOptions?.map((o) => o.id);
    expect(ids).toContain("opt-ram");
    expect(ids).toContain("opt-ssd");
    expect(ids).toContain("opt-gpu");
  });

  it("evaluates multiple choice correctly", () => {
    const correctRes = evaluateAnswer(qMc1, {
      questionId: qMc1.id,
      selectedOptionId: "opt-ram",
      timeSpentSeconds: 10,
    });
    expect(correctRes.isCorrect).toBe(true);

    const incorrectRes = evaluateAnswer(qMc1, {
      questionId: qMc1.id,
      selectedOptionId: "opt-ssd",
      timeSpentSeconds: 12,
    });
    expect(incorrectRes.isCorrect).toBe(false);
  });

  it("evaluates true/false correctly", () => {
    const correctRes = evaluateAnswer(qTf1, {
      questionId: qTf1.id,
      booleanAnswer: true,
      timeSpentSeconds: 5,
    });
    expect(correctRes.isCorrect).toBe(true);

    const incorrectRes = evaluateAnswer(qTf1, {
      questionId: qTf1.id,
      booleanAnswer: false,
      timeSpentSeconds: 7,
    });
    expect(incorrectRes.isCorrect).toBe(false);
  });

  it("normalizes and evaluates short answer correctly", () => {
    const res = evaluateAnswer(qSa1, {
      questionId: qSa1.id,
      textAnswer: "   wHeRe.  ",
      timeSpentSeconds: 8,
    });
    expect(res.isCorrect).toBe(true);
  });

  it("computes attempt summary correctly", () => {
    const presented = preparePresentedQuestions(sampleQuestions, 3);
    const answers = {
      "q-mc-1": { questionId: "q-mc-1", selectedOptionId: "opt-ram", timeSpentSeconds: 10 },
      "q-tf-1": { questionId: "q-tf-1", booleanAnswer: false, timeSpentSeconds: 5 },
      "q-sa-1": { questionId: "q-sa-1", textAnswer: "WHERE", timeSpentSeconds: 15 },
    };
    const evaluations = {
      "q-mc-1": evaluateAnswer(qMc1, answers["q-mc-1"]),
      "q-tf-1": evaluateAnswer(qTf1, answers["q-tf-1"]),
      "q-sa-1": evaluateAnswer(qSa1, answers["q-sa-1"]),
    };

    const summary = calculateSummary(presented, answers, evaluations);
    expect(summary.totalQuestions).toBe(3);
    expect(summary.correctCount).toBe(2);
    expect(summary.incorrectCount).toBe(1);
    expect(summary.scorePercentage).toBe(67);
    expect(summary.totalTimeSeconds).toBe(30);
    expect(summary.missedQuestionIds).toEqual(["q-tf-1"]);
    expect(summary.performanceByAxis.support.percentage).toBe(100);
    expect(summary.performanceByAxis.networks.percentage).toBe(0);
    expect(summary.performanceByAxis.development.percentage).toBe(100);
  });
});
