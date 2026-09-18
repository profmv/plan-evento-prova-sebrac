import {
  type AxisId,
  axisIdSchema,
  type Difficulty,
  difficultySchema,
  type Question,
} from "../../content/domain/contentSchemas";
import { calculateSummary, evaluateAnswer } from "../domain/simuladoEngine";
import type {
  AnswerSubmission,
  EvaluationResult,
  PresentedOption,
  PresentedQuestion,
  SimuladoAttempt,
  SimuladoFilters,
  SimuladoMode,
} from "../domain/simuladoTypes";
import { bundledQuestionBank } from "./questionBank";

const MAX_CSV_LENGTH = 2_000_000;
const EXPORT_DELIMITER = ";";
const ATTEMPT_ID_PATTERN = /^[A-Za-z0-9_-]{1,64}$/;
const FORMULA_INJECTION_PATTERN = /^[=+\-@\t\r']/;

const CSV_COLUMNS = [
  "formato_versao",
  "tentativa_id",
  "tentativa_pai_id",
  "criada_em",
  "concluida_em",
  "modo",
  "filtro_eixo",
  "filtro_dificuldade",
  "limite_minutos",
  "tempo_restante_s",
  "ordem",
  "questao_id",
  "tipo",
  "opcoes_ordem",
  "resposta",
  "tempo_gasto_s",
  "marcada",
  "resposta_exibida",
  "correta",
] as const;

type CsvColumnName = (typeof CSV_COLUMNS)[number];

function protectCsvCell(value: string): string {
  return FORMULA_INJECTION_PATTERN.test(value) ? `'${value}` : value;
}

function stripCsvProtection(value: string): string {
  return value.startsWith("'") ? value.slice(1) : value;
}

function quoteCsvField(value: string, delimiter: string): string {
  const needsQuoting =
    value.includes(delimiter) ||
    value.includes('"') ||
    value.includes("\n") ||
    value.includes("\r");
  if (!needsQuoting) return value;
  return `"${value.replaceAll('"', '""')}"`;
}

function serializeCsvRows(rows: readonly (readonly string[])[]): string {
  return rows
    .map((row) =>
      row
        .map((rawCell) => quoteCsvField(protectCsvCell(rawCell), EXPORT_DELIMITER))
        .join(EXPORT_DELIMITER),
    )
    .join("\r\n");
}

/**
 * Splits raw CSV text into rows of unescaped cells. A quote only opens a
 * quoted region when it is the very first character of a cell; elsewhere it
 * is a literal character. An unterminated quoted region is a parse error.
 */
function parseCsvRows(text: string, delimiter: string): string[][] {
  const rows: string[][] = [];
  let currentRow: string[] = [];
  let currentCell = "";
  let inQuotes = false;
  let cellStarted = false;
  let i = 0;
  const n = text.length;

  const pushCell = () => {
    currentRow.push(currentCell);
    currentCell = "";
    cellStarted = false;
  };
  const pushRow = () => {
    pushCell();
    rows.push(currentRow);
    currentRow = [];
  };

  while (i < n) {
    const ch = text.charAt(i);
    if (inQuotes) {
      if (ch === '"') {
        if (text.charAt(i + 1) === '"') {
          currentCell += '"';
          i += 2;
          continue;
        }
        inQuotes = false;
        i += 1;
        continue;
      }
      currentCell += ch;
      i += 1;
      continue;
    }
    if (ch === '"' && !cellStarted) {
      inQuotes = true;
      cellStarted = true;
      i += 1;
      continue;
    }
    if (ch === delimiter) {
      pushCell();
      i += 1;
      continue;
    }
    if (ch === "\r") {
      pushRow();
      i += 1;
      if (text.charAt(i) === "\n") i += 1;
      continue;
    }
    if (ch === "\n") {
      pushRow();
      i += 1;
      continue;
    }
    currentCell += ch;
    cellStarted = true;
    i += 1;
  }

  if (inQuotes) {
    throw new Error("CSV malformado: aspas não fechadas.");
  }

  if (currentCell !== "" || currentRow.length > 0) {
    pushRow();
  }

  return rows;
}

/** Detects ";" or "," by scanning the header line only, honoring the same quoting rule as parseCsvRows. */
function detectDelimiter(text: string): "," | ";" {
  let inQuotes = false;
  let cellStarted = false;
  let i = 0;
  const n = text.length;

  while (i < n) {
    const ch = text.charAt(i);
    if (inQuotes) {
      if (ch === '"') {
        if (text.charAt(i + 1) === '"') {
          i += 2;
          continue;
        }
        inQuotes = false;
        i += 1;
        continue;
      }
      i += 1;
      continue;
    }
    if (ch === '"' && !cellStarted) {
      inQuotes = true;
      cellStarted = true;
      i += 1;
      continue;
    }
    if (ch === ";" || ch === ",") return ch;
    if (ch === "\n" || ch === "\r") break;
    cellStarted = true;
    i += 1;
  }

  throw new Error("Não foi possível detectar o delimitador do CSV (use ';' ou ',').");
}

function readCell(
  row: readonly string[],
  columnIndex: ReadonlyMap<string, number>,
  name: CsvColumnName,
): string {
  const idx = columnIndex.get(name);
  if (idx === undefined) {
    throw new Error(`Coluna obrigatória ausente no CSV: ${name}.`);
  }
  const value = row[idx];
  if (value === undefined) {
    throw new Error("Linha do CSV com número de colunas inválido.");
  }
  return value;
}

type AttemptCommonFields = {
  readonly formatoVersao: string;
  readonly tentativaId: string;
  readonly tentativaPaiId: string;
  readonly criadaEm: string;
  readonly concluidaEm: string;
  readonly modo: string;
  readonly filtroEixo: string;
  readonly filtroDificuldade: string;
  readonly limiteMinutos: string;
  readonly tempoRestanteS: string;
};

function readCommonFields(
  row: readonly string[],
  columnIndex: ReadonlyMap<string, number>,
): AttemptCommonFields {
  return {
    formatoVersao: readCell(row, columnIndex, "formato_versao"),
    tentativaId: readCell(row, columnIndex, "tentativa_id"),
    tentativaPaiId: readCell(row, columnIndex, "tentativa_pai_id"),
    criadaEm: readCell(row, columnIndex, "criada_em"),
    concluidaEm: readCell(row, columnIndex, "concluida_em"),
    modo: readCell(row, columnIndex, "modo"),
    filtroEixo: readCell(row, columnIndex, "filtro_eixo"),
    filtroDificuldade: readCell(row, columnIndex, "filtro_dificuldade"),
    limiteMinutos: readCell(row, columnIndex, "limite_minutos"),
    tempoRestanteS: readCell(row, columnIndex, "tempo_restante_s"),
  };
}

function sameCommonFields(a: AttemptCommonFields, b: AttemptCommonFields): boolean {
  return (
    a.formatoVersao === b.formatoVersao &&
    a.tentativaId === b.tentativaId &&
    a.tentativaPaiId === b.tentativaPaiId &&
    a.criadaEm === b.criadaEm &&
    a.concluidaEm === b.concluidaEm &&
    a.modo === b.modo &&
    a.filtroEixo === b.filtroEixo &&
    a.filtroDificuldade === b.filtroDificuldade &&
    a.limiteMinutos === b.limiteMinutos &&
    a.tempoRestanteS === b.tempoRestanteS
  );
}

function parseMode(raw: string): SimuladoMode {
  if (raw === "EXAM" || raw === "INSTANT_FEEDBACK") return raw;
  throw new Error(`Modo de simulado inválido no CSV: "${raw}".`);
}

function parseAxisFilter(raw: string): "all" | AxisId {
  if (raw === "all") return "all";
  const result = axisIdSchema.safeParse(raw);
  if (!result.success) {
    throw new Error(`Filtro de eixo inválido no CSV: "${raw}".`);
  }
  return result.data;
}

function parseDifficultyFilter(raw: string): "all" | Difficulty {
  if (raw === "all") return "all";
  const result = difficultySchema.safeParse(raw);
  if (!result.success) {
    throw new Error(`Filtro de dificuldade inválido no CSV: "${raw}".`);
  }
  return result.data;
}

function parseTimeSpent(raw: string, questionId: string): number {
  const parsed = Number(raw);
  if (raw === "" || !Number.isInteger(parsed) || parsed < 0) {
    throw new Error(`Tempo gasto inválido para a questão ${questionId}.`);
  }
  return parsed;
}

export function exportAttemptToCsv(attempt: SimuladoAttempt): string {
  const common: readonly string[] = [
    "1",
    attempt.id,
    attempt.parentAttemptId ?? "",
    attempt.createdAt,
    attempt.completedAt ?? "",
    attempt.filters.mode,
    attempt.filters.axisId,
    attempt.filters.difficulty,
    attempt.filters.timeLimitMinutes !== undefined ? String(attempt.filters.timeLimitMinutes) : "",
    attempt.remainingSeconds !== undefined ? String(attempt.remainingSeconds) : "",
  ];

  const rows: string[][] = [[...CSV_COLUMNS]];

  attempt.questions.forEach((item, index) => {
    const question = item.question;
    const answer = attempt.answers[question.id];
    const evaluation = attempt.evaluations[question.id];
    const isFlagged = attempt.flaggedQuestionIds?.includes(question.id) ?? false;

    const opcoesOrdem =
      question.type === "MULTIPLE_CHOICE" && item.presentedOptions
        ? item.presentedOptions.map((opt) => opt.id).join("|")
        : "";

    let resposta = "";
    if (answer) {
      if (question.type === "MULTIPLE_CHOICE") {
        resposta = answer.selectedOptionId ?? "";
      } else if (question.type === "TRUE_FALSE") {
        resposta =
          answer.booleanAnswer === undefined ? "" : answer.booleanAnswer ? "verdadeiro" : "falso";
      } else {
        resposta = answer.textAnswer ?? "";
      }
    }

    rows.push([
      ...common,
      String(index + 1),
      question.id,
      question.type,
      opcoesOrdem,
      resposta,
      answer ? String(answer.timeSpentSeconds) : "",
      isFlagged ? "sim" : "nao",
      evaluation?.userAnswerDisplay ?? "",
      attempt.isCompleted ? (evaluation?.isCorrect ? "sim" : "nao") : "",
    ]);
  });

  return serializeCsvRows(rows);
}

export function importAttemptFromCsv(
  csv: string,
  bank: readonly Question[] = bundledQuestionBank,
): SimuladoAttempt {
  if (csv.length > MAX_CSV_LENGTH) {
    throw new Error(`O arquivo CSV excede o limite de ${MAX_CSV_LENGTH} caracteres.`);
  }

  const withoutBom = csv.charCodeAt(0) === 0xfeff ? csv.slice(1) : csv;
  if (withoutBom.trim().length === 0) {
    throw new Error("O arquivo CSV está vazio.");
  }

  const delimiter = detectDelimiter(withoutBom);
  const rawRows = parseCsvRows(withoutBom, delimiter).filter(
    (row) => !(row.length === 1 && row[0] === ""),
  );

  if (rawRows.length === 0) {
    throw new Error("O arquivo CSV está vazio.");
  }

  const rows = rawRows.map((row) => row.map(stripCsvProtection));

  const headerRow = rows[0];
  if (!headerRow) {
    throw new Error("O arquivo CSV está vazio.");
  }

  const columnIndex = new Map<string, number>();
  headerRow.forEach((name, idx) => {
    columnIndex.set(name, idx);
  });

  const missingColumns = CSV_COLUMNS.filter((name) => !columnIndex.has(name));
  if (missingColumns.length > 0) {
    throw new Error(`Coluna(s) obrigatória(s) ausente(s) no CSV: ${missingColumns.join(", ")}.`);
  }

  const dataRows = rows.slice(1);
  if (dataRows.length === 0) {
    throw new Error("O arquivo CSV não contém questões.");
  }

  const firstRow = dataRows[0];
  if (!firstRow) {
    throw new Error("O arquivo CSV não contém questões.");
  }
  const common = readCommonFields(firstRow, columnIndex);

  for (const row of dataRows) {
    if (!sameCommonFields(readCommonFields(row, columnIndex), common)) {
      throw new Error("O arquivo CSV mistura dados de mais de uma tentativa.");
    }
  }

  if (common.formatoVersao !== "1") {
    throw new Error(`Versão de formato de CSV desconhecida: "${common.formatoVersao}".`);
  }
  if (!ATTEMPT_ID_PATTERN.test(common.tentativaId)) {
    throw new Error("Identificador da tentativa inválido no CSV.");
  }
  if (common.tentativaPaiId !== "" && !ATTEMPT_ID_PATTERN.test(common.tentativaPaiId)) {
    throw new Error("Identificador da tentativa pai inválido no CSV.");
  }
  if (Number.isNaN(Date.parse(common.criadaEm))) {
    throw new Error("Data de criação inválida no CSV.");
  }
  if (common.concluidaEm !== "" && Number.isNaN(Date.parse(common.concluidaEm))) {
    throw new Error("Data de conclusão inválida no CSV.");
  }

  const mode = parseMode(common.modo);
  const axisFilter = parseAxisFilter(common.filtroEixo);
  const difficultyFilter = parseDifficultyFilter(common.filtroDificuldade);

  let timeLimitMinutes: number | undefined;
  if (common.limiteMinutos !== "") {
    const parsed = Number(common.limiteMinutos);
    if (!Number.isInteger(parsed) || parsed <= 0) {
      throw new Error("Limite de minutos inválido no CSV.");
    }
    timeLimitMinutes = parsed;
  }

  let remainingSeconds: number | undefined;
  if (common.tempoRestanteS !== "") {
    const parsed = Number(common.tempoRestanteS);
    if (!Number.isInteger(parsed) || parsed < 0) {
      throw new Error("Tempo restante inválido no CSV.");
    }
    remainingSeconds = parsed;
  }

  const bankById = new Map(bank.map((question) => [question.id, question] as const));

  type ParsedRow = {
    readonly ordem: number;
    readonly question: Question;
    readonly presentedOptions?: readonly PresentedOption[] | undefined;
    readonly answer?: AnswerSubmission | undefined;
    readonly isFlagged: boolean;
  };

  const parsedRows: ParsedRow[] = [];
  const seenOrders = new Set<number>();
  const seenQuestionIds = new Set<string>();

  for (const row of dataRows) {
    const ordemRaw = readCell(row, columnIndex, "ordem");
    const ordem = Number(ordemRaw);
    if (!Number.isInteger(ordem) || ordem < 1) {
      throw new Error(`Valor de "ordem" inválido no CSV: "${ordemRaw}".`);
    }
    if (seenOrders.has(ordem)) {
      throw new Error(`Valor de "ordem" duplicado no CSV: ${ordem}.`);
    }
    seenOrders.add(ordem);

    const questionId = readCell(row, columnIndex, "questao_id");
    if (seenQuestionIds.has(questionId)) {
      throw new Error(`Questão duplicada no CSV: ${questionId}.`);
    }
    seenQuestionIds.add(questionId);

    const question = bankById.get(questionId);
    if (!question) {
      throw new Error(`Questão inexistente no banco de questões: ${questionId}.`);
    }

    const tipo = readCell(row, columnIndex, "tipo");
    if (tipo !== question.type) {
      throw new Error(`Tipo divergente do banco de questões para a questão ${questionId}.`);
    }

    let presentedOptions: PresentedOption[] | undefined;
    if (question.type === "MULTIPLE_CHOICE") {
      const opcoesOrdemRaw = readCell(row, columnIndex, "opcoes_ordem");
      const orderedIds = opcoesOrdemRaw === "" ? [] : opcoesOrdemRaw.split("|");
      const bankOptionIds = question.options.map((opt) => opt.id);
      const isExactPermutation =
        orderedIds.length === bankOptionIds.length &&
        new Set(orderedIds).size === orderedIds.length &&
        bankOptionIds.every((id) => orderedIds.includes(id));
      if (!isExactPermutation) {
        throw new Error(
          `A coluna "opcoes_ordem" não é uma permutação válida das alternativas da questão ${questionId}.`,
        );
      }
      presentedOptions = orderedIds.map((id) => {
        const option = question.options.find((opt) => opt.id === id);
        if (!option) {
          throw new Error(
            `A coluna "opcoes_ordem" não é uma permutação válida das alternativas da questão ${questionId}.`,
          );
        }
        return { id: option.id, text: option.text };
      });
    }

    const respostaRaw = readCell(row, columnIndex, "resposta");
    const tempoGastoRaw = readCell(row, columnIndex, "tempo_gasto_s");
    const marcadaRaw = readCell(row, columnIndex, "marcada");

    let answer: AnswerSubmission | undefined;
    if (question.type === "MULTIPLE_CHOICE") {
      if (respostaRaw !== "") {
        const validIds = new Set((presentedOptions ?? []).map((opt) => opt.id));
        if (!validIds.has(respostaRaw)) {
          throw new Error(`Resposta inválida para a questão ${questionId}.`);
        }
        answer = {
          questionId,
          selectedOptionId: respostaRaw,
          timeSpentSeconds: parseTimeSpent(tempoGastoRaw, questionId),
        };
      }
    } else if (question.type === "TRUE_FALSE") {
      if (respostaRaw !== "") {
        if (respostaRaw !== "verdadeiro" && respostaRaw !== "falso") {
          throw new Error(`Resposta inválida para a questão ${questionId}.`);
        }
        answer = {
          questionId,
          booleanAnswer: respostaRaw === "verdadeiro",
          timeSpentSeconds: parseTimeSpent(tempoGastoRaw, questionId),
        };
      }
    } else {
      if (respostaRaw !== "") {
        answer = {
          questionId,
          textAnswer: respostaRaw,
          timeSpentSeconds: parseTimeSpent(tempoGastoRaw, questionId),
        };
      }
    }

    parsedRows.push({
      ordem,
      question,
      presentedOptions,
      answer,
      isFlagged: marcadaRaw === "sim",
    });
  }

  for (let expected = 1; expected <= dataRows.length; expected += 1) {
    if (!seenOrders.has(expected)) {
      throw new Error(`A coluna "ordem" não cobre a sequência 1..${dataRows.length} sem lacunas.`);
    }
  }

  parsedRows.sort((a, b) => a.ordem - b.ordem);

  const questions: PresentedQuestion[] = parsedRows.map((row) => ({
    question: row.question,
    presentedOptions: row.presentedOptions,
  }));

  const answers: Record<string, AnswerSubmission> = {};
  const flaggedQuestionIds: string[] = [];
  for (const row of parsedRows) {
    if (row.answer) {
      answers[row.question.id] = row.answer;
    }
    if (row.isFlagged) {
      flaggedQuestionIds.push(row.question.id);
    }
  }

  const evaluations: Record<string, EvaluationResult> = {};
  for (const row of parsedRows) {
    const answer = answers[row.question.id];
    if (answer) {
      evaluations[row.question.id] = evaluateAnswer(row.question, answer);
    }
  }

  const isCompleted = common.concluidaEm !== "";

  const filters: SimuladoFilters = {
    axisId: axisFilter,
    difficulty: difficultyFilter,
    questionCount: parsedRows.length,
    mode,
    timeLimitMinutes,
  };

  return {
    id: common.tentativaId,
    parentAttemptId: common.tentativaPaiId === "" ? undefined : common.tentativaPaiId,
    createdAt: common.criadaEm,
    completedAt: isCompleted ? common.concluidaEm : undefined,
    filters,
    questions,
    answers,
    evaluations,
    isCompleted,
    summary: isCompleted ? calculateSummary(questions, answers, evaluations) : undefined,
    flaggedQuestionIds,
    remainingSeconds,
  };
}
