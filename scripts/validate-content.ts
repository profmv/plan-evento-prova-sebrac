import { readdir, readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import type { z } from "zod";
import {
  type Activity,
  activitySchema,
  type CourseTaxonomy,
  courseTaxonomySchema,
  type Question,
  questionSchema,
} from "../src/modules/content/domain/contentSchemas";

const projectRoot = resolve(fileURLToPath(new URL("..", import.meta.url)));
const requireCompleteBank = process.argv.includes("--require-complete-bank");

type ValidationError = {
  readonly file: string;
  readonly message: string;
};

async function readJson(path: string): Promise<unknown> {
  const text = await readFile(path, "utf8");
  return JSON.parse(text) as unknown;
}

async function listJsonFiles(directory: string): Promise<readonly string[]> {
  const entries = await readdir(directory, { withFileTypes: true });
  const nested = await Promise.all(
    entries.map(async (entry) => {
      const path = resolve(directory, entry.name);
      if (entry.isDirectory()) {
        return listJsonFiles(path);
      }
      return entry.isFile() && entry.name.endsWith(".json") ? [path] : [];
    }),
  );
  return nested.flat().sort();
}

async function parseCollection<T>(
  directory: string,
  schema: z.ZodType<T>,
  errors: ValidationError[],
): Promise<readonly T[]> {
  const files = await listJsonFiles(directory);
  const items: T[] = [];

  for (const file of files) {
    try {
      const value = await readJson(file);
      const values = Array.isArray(value) ? value : [value];
      for (const [index, candidate] of values.entries()) {
        const result = schema.safeParse(candidate);
        if (result.success) {
          items.push(result.data);
          continue;
        }
        for (const issue of result.error.issues) {
          errors.push({
            file,
            message: `[${index}] ${issue.path.join(".") || "item"}: ${issue.message}`,
          });
        }
      }
    } catch (error) {
      errors.push({
        file,
        message: error instanceof Error ? error.message : "Falha desconhecida ao ler JSON.",
      });
    }
  }

  return items;
}

function validateUniqueVersions(
  items: readonly (Question | Activity)[],
  category: string,
  errors: ValidationError[],
) {
  const seen = new Set<string>();
  for (const item of items) {
    const key = `${item.id}@${item.version}`;
    if (seen.has(key)) {
      errors.push({ file: category, message: `Identificador e versão duplicados: ${key}.` });
    }
    seen.add(key);
  }
}

function validateCurricularLinks(
  items: readonly (Question | Activity)[],
  taxonomy: CourseTaxonomy,
  category: string,
  errors: ValidationError[],
) {
  const units = new Map(taxonomy.units.map((unit) => [unit.id, unit] as const));
  for (const item of items) {
    for (const unitId of item.unitIds) {
      const unit = units.get(unitId);
      if (!unit) {
        errors.push({ file: category, message: `${item.id}: UC inexistente ${unitId}.` });
      } else if (unit.axisId !== item.axisId) {
        errors.push({
          file: category,
          message: `${item.id}: ${unitId} não pertence ao eixo ${item.axisId}.`,
        });
      }
    }
  }
}

function countApprovedQuestions(questions: readonly Question[]) {
  return questions.reduce<Record<Question["axisId"], number>>(
    (counts, question) => {
      if (question.status === "APPROVED") {
        counts[question.axisId] += 1;
      }
      return counts;
    },
    { support: 0, networks: 0, development: 0 },
  );
}

async function main() {
  const errors: ValidationError[] = [];
  const taxonomyPath = resolve(projectRoot, "content/taxonomy/course.json");
  const taxonomyResult = courseTaxonomySchema.safeParse(await readJson(taxonomyPath));

  if (!taxonomyResult.success) {
    for (const issue of taxonomyResult.error.issues) {
      errors.push({
        file: taxonomyPath,
        message: `${issue.path.join(".") || "taxonomy"}: ${issue.message}`,
      });
    }
    console.error(`[FAIL] Taxonomia inválida: ${errors.length} problema(s).`);
    for (const error of errors) {
      console.error(`- ${error.file}: ${error.message}`);
    }
    process.exitCode = 1;
    return;
  }

  const taxonomy = taxonomyResult.data;

  const questions = await parseCollection(
    resolve(projectRoot, "content/questions"),
    questionSchema,
    errors,
  );
  const activities = await parseCollection(
    resolve(projectRoot, "content/activities"),
    activitySchema,
    errors,
  );

  validateUniqueVersions(questions, "content/questions", errors);
  validateUniqueVersions(activities, "content/activities", errors);

  validateCurricularLinks(questions, taxonomy, "content/questions", errors);
  validateCurricularLinks(activities, taxonomy, "content/activities", errors);

  const approvedByAxis = countApprovedQuestions(questions);
  if (requireCompleteBank) {
    for (const [axisId, count] of Object.entries(approvedByAxis)) {
      if (count < 100) {
        errors.push({
          file: "content/questions",
          message: `O eixo ${axisId} possui ${count} questões aprovadas; o mínimo é 100.`,
        });
      }
    }
  }

  if (errors.length > 0) {
    console.error(`[FAIL] Conteúdo inválido: ${errors.length} problema(s).`);
    for (const error of errors) {
      console.error(`- ${error.file}: ${error.message}`);
    }
    process.exitCode = 1;
    return;
  }

  console.log(
    `[OK] Taxonomia: ${taxonomy.units.length} UCs, ${taxonomy.totalWorkloadHours} horas, ${taxonomy.axes.length} eixos.`,
  );
  console.log(`[OK] Atividades válidas: ${activities.length}.`);
  console.log(
    `[OK] Questões válidas: ${questions.length}; aprovadas por eixo: suporte=${approvedByAxis.support}, redes=${approvedByAxis.networks}, desenvolvimento=${approvedByAxis.development}.`,
  );
  if (!requireCompleteBank && questions.length < 300) {
    console.log("[PENDING] O banco completo de 300 questões ainda não foi exigido neste marco.");
  }
}

await main();
