import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it } from "vitest";
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
    expect(screen.getByLabelText(/eixo curricular/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /iniciar simulado/i })).toBeInTheDocument();
  });

  it("starts the simulado and shows question banner and options", async () => {
    const user = userEvent.setup();
    render(<SimuladoContainer />);

    const startBtn = screen.getByRole("button", { name: /iniciar simulado/i });
    await user.click(startBtn);

    // Question runner should be visible
    expect(screen.getByLabelText(/banner contextual/i)).toBeInTheDocument();
    expect(screen.getByRole("progressbar")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /confirmar resposta/i })).toBeInTheDocument();
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
});
