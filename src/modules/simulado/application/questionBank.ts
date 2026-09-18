import devQuestions from "../../../../content/questions/desenvolvimento-aplicativos.json";
import hardwareQuestions from "../../../../content/questions/hardware-suporte.json";
import redesQuestions from "../../../../content/questions/redes-servidores.json";
import { type Question, questionSchema } from "../../content/domain/contentSchemas";

function loadAndValidateQuestions(): readonly Question[] {
  const allRaw = [...hardwareQuestions, ...redesQuestions, ...devQuestions];
  return allRaw.map((raw) => questionSchema.parse(raw));
}

export const bundledQuestionBank: readonly Question[] = loadAndValidateQuestions();

export function getQuestionById(id: string): Question | undefined {
  return bundledQuestionBank.find((q) => q.id === id);
}
