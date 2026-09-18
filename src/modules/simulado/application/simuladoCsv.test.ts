import { describe, expect, it } from "vitest";
import type { Question } from "../../content/domain/contentSchemas";
import { calculateSummary, evaluateAnswer } from "../domain/simuladoEngine";
import type { AnswerSubmission, EvaluationResult, SimuladoAttempt } from "../domain/simuladoTypes";
import { exportAttemptToCsv, importAttemptFromCsv } from "./simuladoCsv";

const qMc: Question = {
  id: "q-mc-csv-1",
  version: 1,
  status: "APPROVED",
  axisId: "support",
  unitIds: ["UC01"],
  difficulty: "FOUNDATION",
  type: "MULTIPLE_CHOICE",
  prompt: "Qual componente executa as instruções do processador?",
  options: [
    { id: "opt-cpu", text: "Unidade Central de Processamento" },
    { id: "opt-hd", text: "Disco Rígido" },
    { id: "opt-fonte", text: "Fonte de Alimentação" },
  ],
  correctOptionId: "opt-cpu",
  explanation: "A CPU executa as instruções de um programa em execução.",
  source: { kind: "COURSE_PLAN", reference: "UC01" },
  tags: ["cpu"],
};

const qTf: Question = {
  id: "q-tf-csv-1",
  version: 1,
  status: "APPROVED",
  axisId: "networks",
  unitIds: ["UC05"],
  difficulty: "INTERMEDIATE",
  type: "TRUE_FALSE",
  prompt: "O protocolo UDP garante entrega ordenada de pacotes.",
  correctAnswer: false,
  explanation: "O UDP não é orientado a conexão e não garante ordem nem entrega.",
  source: { kind: "COURSE_PLAN", reference: "UC05" },
  tags: ["udp"],
};

const qSa: Question = {
  id: "q-sa-csv-1",
  version: 1,
  status: "APPROVED",
  axisId: "development",
  unitIds: ["UC10"],
  difficulty: "FOUNDATION",
  type: "SHORT_ANSWER",
  prompt: "Qual comando SQL insere novas linhas em uma tabela?",
  acceptedAnswers: ["INSERT", "insert"],
  normalization: {
    trimWhitespace: true,
    collapseWhitespace: true,
    ignoreCase: true,
    ignoreDiacritics: true,
    ignorePunctuation: true,
  },
  explanation: "O comando INSERT adiciona novas linhas em uma tabela.",
  source: { kind: "COURSE_PLAN", reference: "UC10" },
  tags: ["sql"],
};

const bank: readonly Question[] = [qMc, qTf, qSa];

const shuffledMcOptions = [
  { id: "opt-fonte", text: "Fonte de Alimentação" },
  { id: "opt-cpu", text: "Unidade Central de Processamento" },
  { id: "opt-hd", text: "Disco Rígido" },
];

function buildInProgressAttempt(): SimuladoAttempt {
  const mcAnswer: AnswerSubmission = {
    questionId: qMc.id,
    selectedOptionId: "opt-cpu",
    timeSpentSeconds: 12,
  };
  const tfAnswer: AnswerSubmission = {
    questionId: qTf.id,
    booleanAnswer: true,
    timeSpentSeconds: 8,
  };

  const answers: Record<string, AnswerSubmission> = {
    [qMc.id]: mcAnswer,
    [qTf.id]: tfAnswer,
  };
  const evaluations: Record<string, EvaluationResult> = {
    [qMc.id]: evaluateAnswer(qMc, mcAnswer),
    [qTf.id]: evaluateAnswer(qTf, tfAnswer),
  };

  return {
    id: "attempt-csv-001",
    createdAt: "2026-03-01T10:00:00.000Z",
    filters: {
      axisId: "all",
      difficulty: "all",
      questionCount: 3,
      mode: "EXAM",
      timeLimitMinutes: 60,
    },
    questions: [
      { question: qMc, presentedOptions: shuffledMcOptions },
      { question: qTf },
      { question: qSa },
    ],
    answers,
    evaluations,
    isCompleted: false,
    flaggedQuestionIds: [qSa.id],
    remainingSeconds: 2400,
  };
}

function buildCompletedAttempt(): SimuladoAttempt {
  const inProgress = buildInProgressAttempt();
  const saAnswer: AnswerSubmission = {
    questionId: qSa.id,
    textAnswer: "insert",
    timeSpentSeconds: 20,
  };
  const answers: Record<string, AnswerSubmission> = { ...inProgress.answers, [qSa.id]: saAnswer };
  const evaluations: Record<string, EvaluationResult> = {
    ...inProgress.evaluations,
    [qSa.id]: evaluateAnswer(qSa, saAnswer),
  };
  const summary = calculateSummary(inProgress.questions, answers, evaluations);

  return {
    ...inProgress,
    answers,
    evaluations,
    isCompleted: true,
    completedAt: "2026-03-01T11:00:00.000Z",
    summary,
  };
}

function csvLines(csv: string): string[] {
  return csv.split("\r\n");
}

function columnValues(csv: string, columnName: string): string[] {
  const lines = csvLines(csv);
  const header = lines[0]?.split(";") ?? [];
  const idx = header.indexOf(columnName);
  return lines.slice(1).map((line) => line.split(";")[idx] ?? "");
}

describe("simuladoCsv", () => {
  it("round-trips an in-progress attempt with the three question types, flags, remaining time and shuffled options", () => {
    const attempt = buildInProgressAttempt();
    const csv = exportAttemptToCsv(attempt);
    const imported = importAttemptFromCsv(csv, bank);

    expect(imported.id).toBe(attempt.id);
    expect(imported.isCompleted).toBe(false);
    expect(imported.questions).toEqual(attempt.questions);
    expect(imported.answers).toEqual(attempt.answers);
    expect(imported.flaggedQuestionIds).toEqual(attempt.flaggedQuestionIds);
    expect(imported.remainingSeconds).toBe(attempt.remainingSeconds);
    expect(imported.summary).toBeUndefined();
  });

  it("round-trips a completed attempt, recomputing an equal summary", () => {
    const attempt = buildCompletedAttempt();
    const csv = exportAttemptToCsv(attempt);
    const imported = importAttemptFromCsv(csv, bank);

    expect(imported.isCompleted).toBe(true);
    expect(imported.completedAt).toBe(attempt.completedAt);
    expect(imported.answers).toEqual(attempt.answers);
    expect(imported.summary).toEqual(attempt.summary);
  });

  it("leaves 'correta' empty while in progress and fills it once the attempt is completed", () => {
    const inProgressCsv = exportAttemptToCsv(buildInProgressAttempt());
    for (const value of columnValues(inProgressCsv, "correta")) {
      expect(value).toBe("");
    }

    const completedCsv = exportAttemptToCsv(buildCompletedAttempt());
    const completedValues = columnValues(completedCsv, "correta");
    // Order matches attempt.questions: MC (correct), TF (incorrect on purpose), SA (correct).
    expect(completedValues).toEqual(["sim", "nao", "sim"]);
  });

  it("round-trips formula-injection-prone short answers safely", () => {
    const dangerousAnswers = ["=1+1", "'x", 'texto com ; e "aspas"\ne quebra de linha'];

    for (const dangerousText of dangerousAnswers) {
      const saAnswer: AnswerSubmission = {
        questionId: qSa.id,
        textAnswer: dangerousText,
        timeSpentSeconds: 5,
      };
      const attempt: SimuladoAttempt = {
        id: "attempt-csv-injection",
        createdAt: "2026-03-01T10:00:00.000Z",
        filters: { axisId: "all", difficulty: "all", questionCount: 1, mode: "EXAM" },
        questions: [{ question: qSa }],
        answers: { [qSa.id]: saAnswer },
        evaluations: { [qSa.id]: evaluateAnswer(qSa, saAnswer) },
        isCompleted: false,
        flaggedQuestionIds: [],
      };

      const csv = exportAttemptToCsv(attempt);
      // Guard against the raw cell ever reaching a spreadsheet as an active formula/reference.
      const resposta = columnValues(csv, "resposta")[0] ?? "";
      if (/^[=+\-@\t\r']/.test(dangerousText)) {
        expect(resposta.startsWith("'")).toBe(true);
      }

      const imported = importAttemptFromCsv(csv, bank);
      expect(imported.answers[qSa.id]?.textAnswer).toBe(dangerousText);
    }
  });

  it("imports a comma-delimited CSV without a BOM", () => {
    const attempt = buildInProgressAttempt();
    const csvWithSemicolons = exportAttemptToCsv(attempt);
    const csvWithCommas = csvWithSemicolons.replaceAll(";", ",");

    const imported = importAttemptFromCsv(csvWithCommas, bank);
    expect(imported.id).toBe(attempt.id);
    expect(imported.answers).toEqual(attempt.answers);
  });

  it("rejects a CSV missing a required column", () => {
    const csv = exportAttemptToCsv(buildInProgressAttempt());
    const withoutColumn = csv.replace("resposta_exibida;correta", "correta");
    expect(() => importAttemptFromCsv(withoutColumn, bank)).toThrow(/coluna/i);
  });

  it("rejects an unknown format version", () => {
    const csv = exportAttemptToCsv(buildInProgressAttempt());
    const tampered = csv
      .split("\r\n")
      .map((line, idx) => (idx === 0 ? line : line.replace(/^1;/, "9;")))
      .join("\r\n");
    expect(() => importAttemptFromCsv(tampered, bank)).toThrow(/versão/i);
  });

  it("rejects a question id that does not exist in the bank", () => {
    const csv = exportAttemptToCsv(buildInProgressAttempt());
    const tampered = csv.replace(qSa.id, "q-inexistente");
    expect(() => importAttemptFromCsv(tampered, bank)).toThrow(/inexistente/i);
  });

  it("rejects an opcoes_ordem that is not an exact permutation of the question's options", () => {
    const csv = exportAttemptToCsv(buildInProgressAttempt());
    const tampered = csv.replace("opt-fonte|opt-cpu|opt-hd", "opt-fonte|opt-cpu");
    expect(() => importAttemptFromCsv(tampered, bank)).toThrow(/permutação/i);
  });

  it("rejects a row whose type diverges from the question bank", () => {
    const csv = exportAttemptToCsv(buildInProgressAttempt());
    const lines = csvLines(csv);
    const tampered = lines
      .map((line) =>
        line.includes(qTf.id) ? line.replace(";TRUE_FALSE;", ";SHORT_ANSWER;") : line,
      )
      .join("\r\n");
    expect(() => importAttemptFromCsv(tampered, bank)).toThrow(/tipo/i);
  });

  it("rejects an 'ordem' sequence with a gap", () => {
    const csv = exportAttemptToCsv(buildInProgressAttempt());
    const lines = csvLines(csv);
    const tampered = lines
      .map((line) =>
        line.includes(qSa.id) ? line.replace(`;3;${qSa.id};`, `;4;${qSa.id};`) : line,
      )
      .join("\r\n");
    expect(() => importAttemptFromCsv(tampered, bank)).toThrow(/ordem/i);
  });

  it("rejects a CSV that mixes rows from two different attempts", () => {
    const csv = exportAttemptToCsv(buildInProgressAttempt());
    const lines = csvLines(csv);
    const lastLine = lines[lines.length - 1] ?? "";
    const mixedLastLine = lastLine.replace("attempt-csv-001", "attempt-csv-999");
    const tampered = [...lines.slice(0, -1), mixedLastLine].join("\r\n");
    expect(() => importAttemptFromCsv(tampered, bank)).toThrow(/mais de uma tentativa/i);
  });

  it("rejects a CSV with an unterminated quoted cell", () => {
    const csv = exportAttemptToCsv(buildInProgressAttempt());
    const lines = csvLines(csv);
    const tampered = [...lines, '"linha aberta sem fechamento'].join("\r\n");
    expect(() => importAttemptFromCsv(tampered, bank)).toThrow(/aspas/i);
  });

  it("rejects an invalid answer for a true/false question", () => {
    const csv = exportAttemptToCsv(buildInProgressAttempt());
    const tampered = csv.replace(";verdadeiro;", ";talvez;");
    expect(() => importAttemptFromCsv(tampered, bank)).toThrow(/resposta inválida/i);
  });

  it("rejects an empty file", () => {
    expect(() => importAttemptFromCsv("", bank)).toThrow(/vazio/i);
    expect(() => importAttemptFromCsv("   \n  ", bank)).toThrow(/vazio/i);
  });

  it("ignores tampering of the informational 'correta' column when recomputing the score", () => {
    const attempt = buildCompletedAttempt();
    const csv = exportAttemptToCsv(attempt);
    const tampered = csv.replaceAll(";sim\r\n", ";nao\r\n").replace(/;sim$/, ";nao");

    const imported = importAttemptFromCsv(tampered, bank);
    expect(imported.summary).toEqual(attempt.summary);
  });
});
