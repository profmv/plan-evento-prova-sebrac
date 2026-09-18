import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { Question } from "../../content/domain/contentSchemas";
import { bundledQuestionBank } from "../application/questionBank";
import { exportAttemptToCsv } from "../application/simuladoCsv";
import { createAttempt, finishAttempt, recordAnswer } from "../application/simuladoService";
import type { AnswerSubmission } from "../domain/simuladoTypes";
import { browserAttemptStorage } from "./browserStorage";
import { SimuladoContainer } from "./SimuladoContainer";

function makeCsvFile(content: string, name = "progresso.csv"): File {
  return new File([content], name, { type: "text/csv" });
}

function buildCorrectSubmission(question: Question): AnswerSubmission {
  if (question.type === "MULTIPLE_CHOICE") {
    return {
      questionId: question.id,
      selectedOptionId: question.correctOptionId,
      timeSpentSeconds: 5,
    };
  }
  if (question.type === "TRUE_FALSE") {
    return { questionId: question.id, booleanAnswer: question.correctAnswer, timeSpentSeconds: 5 };
  }
  return {
    questionId: question.id,
    textAnswer: question.acceptedAnswers[0] ?? "",
    timeSpentSeconds: 5,
  };
}

function getFileInput(): HTMLInputElement {
  const input = document.querySelector('input[type="file"]');
  if (!(input instanceof HTMLInputElement)) {
    throw new Error("Input de importação de CSV não encontrado na tela inicial.");
  }
  return input;
}

describe("Simulado CSV export and import (UI)", () => {
  beforeEach(() => {
    browserAttemptStorage.clear();
    // jsdom does not implement the Blob URL APIs used by the download helper.
    URL.createObjectURL = vi.fn(() => "blob:mock-url");
    URL.revokeObjectURL = vi.fn();
  });

  it("shows the export button while the exam is running and downloads without leaking the blob URL", async () => {
    const user = userEvent.setup();
    render(<SimuladoContainer />);

    await user.click(screen.getByRole("button", { name: /iniciar prova completa/i }));

    const exportBtn = screen.getByRole("button", { name: /exportar progresso \(\.csv\)/i });
    await user.click(exportBtn);

    expect(URL.createObjectURL).toHaveBeenCalledTimes(1);
    expect(URL.revokeObjectURL).toHaveBeenCalledTimes(1);
  });

  it("shows the export button on the results screen", async () => {
    const attempt = createAttempt(
      { axisId: "all", difficulty: "all", questionCount: 2, mode: "INSTANT_FEEDBACK" },
      bundledQuestionBank,
      browserAttemptStorage,
    );
    finishAttempt(attempt, browserAttemptStorage);

    const user = userEvent.setup();
    render(<SimuladoContainer />);

    const exportBtn = screen.getByRole("button", { name: /exportar resultado \(\.csv\)/i });
    await user.click(exportBtn);

    expect(URL.createObjectURL).toHaveBeenCalledTimes(1);
    expect(URL.revokeObjectURL).toHaveBeenCalledTimes(1);
  });

  it("imports a valid CSV from the initial screen and resumes at the first unanswered question", async () => {
    let attempt = createAttempt(
      { axisId: "all", difficulty: "all", questionCount: 3, mode: "EXAM", timeLimitMinutes: 60 },
      bundledQuestionBank,
      browserAttemptStorage,
    );
    const firstQuestion = attempt.questions[0]?.question;
    if (!firstQuestion) throw new Error("Banco de questões de teste sem questões.");
    attempt = recordAnswer(attempt, buildCorrectSubmission(firstQuestion), browserAttemptStorage);

    const csv = exportAttemptToCsv(attempt);
    browserAttemptStorage.clear();

    render(<SimuladoContainer />);
    expect(
      screen.getByRole("heading", { name: /simulado formativo do curso técnico em ti/i }),
    ).toBeInTheDocument();

    fireEvent.change(getFileInput(), { target: { files: [makeCsvFile(csv)] } });

    await waitFor(() => {
      expect(screen.getByRole("progressbar", { name: /questão 2 de \d+/i })).toBeInTheDocument();
    });
  });

  it("shows an inline alert and stays on the initial screen for an invalid CSV file", async () => {
    render(<SimuladoContainer />);

    fireEvent.change(getFileInput(), {
      target: { files: [makeCsvFile("arquivo invalido sem cabecalho reconhecido")] },
    });

    await waitFor(() => {
      expect(screen.getByRole("alert")).toBeInTheDocument();
    });
    expect(
      screen.getByRole("heading", { name: /simulado formativo do curso técnico em ti/i }),
    ).toBeInTheDocument();
    expect(browserAttemptStorage.load()).toBeNull();
  });
});
