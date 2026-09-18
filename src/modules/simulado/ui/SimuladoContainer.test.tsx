import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it } from "vitest";
import { bundledQuestionBank } from "../application/questionBank";
import { browserAttemptStorage } from "./browserStorage";
import { SimuladoContainer } from "./SimuladoContainer";

describe("SimuladoContainer", () => {
  beforeEach(() => {
    browserAttemptStorage.clear();
  });

  it("renders the setup screen initially", () => {
    render(<SimuladoContainer />);

    expect(
      screen.getByRole("heading", { name: /simulado formativo de conhecimentos gerais/i }),
    ).toBeInTheDocument();
    expect(screen.getByLabelText(/duração do exame/i)).toHaveValue("180");
    expect(screen.queryByLabelText(/eixo curricular/i)).not.toBeInTheDocument();
    expect(screen.queryByLabelText(/nível de dificuldade/i)).not.toBeInTheDocument();
    expect(screen.queryByLabelText(/quantidade de questões/i)).not.toBeInTheDocument();
    expect(screen.queryByLabelText(/dinâmica de feedback/i)).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: /iniciar prova completa/i })).toBeInTheDocument();
  });

  it("starts the simulado and shows question banner and options", async () => {
    const user = userEvent.setup();
    render(<SimuladoContainer />);

    const startBtn = screen.getByRole("button", { name: /iniciar prova completa/i });
    await user.click(startBtn);

    // Question runner should be visible
    expect(screen.getByLabelText(/banner contextual/i)).toBeInTheDocument();
    expect(screen.getByRole("progressbar")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /confirmar resposta/i })).toBeInTheDocument();
    const saved = browserAttemptStorage.load();
    expect(saved?.filters.mode).toBe("EXAM");
    expect(saved?.filters.questionCount).toBe(bundledQuestionBank.length);
    expect(saved?.questions).toHaveLength(bundledQuestionBank.length);
  });

  it("recovers an in-progress attempt directly from storage on page reload", () => {
    browserAttemptStorage.save({
      id: "saved-test-attempt",
      createdAt: new Date().toISOString(),
      filters: {
        axisId: "all",
        difficulty: "all",
        questionCount: 5,
        mode: "INSTANT_FEEDBACK",
      },
      questions: [
        {
          question: {
            id: "q-recovered-1",
            version: 1,
            status: "APPROVED",
            axisId: "support",
            unitIds: ["UC01"],
            difficulty: "FOUNDATION",
            type: "TRUE_FALSE",
            prompt: "Pergunta recuperada de teste.",
            correctAnswer: true,
            explanation: "Explicacao tecnica da questao recuperada.",
            source: { kind: "COURSE_PLAN", reference: "UC01" },
            tags: ["hardware"],
          },
        },
      ],
      answers: {},
      evaluations: {},
      isCompleted: false,
    });

    render(<SimuladoContainer />);

    expect(screen.getByText("Pergunta recuperada de teste.")).toBeInTheDocument();
  });

  it("supports marking questions for review and navigating via question palette", async () => {
    const user = userEvent.setup();
    render(<SimuladoContainer />);

    const startBtn = screen.getByRole("button", { name: /iniciar prova completa/i });
    await user.click(startBtn);

    // Toggle flag on current question
    const flagBtn = screen.getByRole("button", { name: /marcar para revisão/i });
    await user.click(flagBtn);
    expect(screen.getByRole("button", { name: /marcada para revisão/i })).toBeInTheDocument();

    // Verify flag was persisted to storage
    const saved = browserAttemptStorage.load();
    expect(saved?.flaggedQuestionIds).toHaveLength(1);

    // Open palette drawer
    const paletteToggle = screen.getByRole("button", { name: /paleta/i });
    await user.click(paletteToggle);

    expect(screen.getByText(/mapa de questões da prova/i)).toBeInTheDocument();
    const questionItems = screen.getAllByRole("button", { name: /questão \d+/i });
    expect(questionItems.length).toBeGreaterThanOrEqual(5);

    // Jump to question 2
    const secondQuestion = questionItems[1];
    expect(secondQuestion).toBeDefined();
    if (secondQuestion) {
      await user.click(secondQuestion);
    }
    expect(screen.getByRole("progressbar", { name: /questão 2 de 65/i })).toBeInTheDocument();
  });

  it("renders countdown timer and handles time limit configuration", async () => {
    const user = userEvent.setup();
    render(<SimuladoContainer />);

    const timeLimitSelect = screen.getByLabelText(/duração do exame/i);
    await user.selectOptions(timeLimitSelect, "180");

    const startBtn = screen.getByRole("button", { name: /iniciar prova completa/i });
    await user.click(startBtn);

    expect(screen.getByText(/tempo restante:/i)).toBeInTheDocument();
    // 180 min formatted as 03:00:00 or 02:59:59
    expect(screen.getByText(/0[23]:[0-5]\d:[0-5]\d/)).toBeInTheDocument();
  });
});
