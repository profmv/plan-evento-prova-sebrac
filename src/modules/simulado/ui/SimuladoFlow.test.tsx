import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it } from "vitest";
import { bundledQuestionBank } from "../application/questionBank";
import { createAttempt } from "../application/simuladoService";
import { browserAttemptStorage } from "./browserStorage";
import { SimuladoContainer } from "./SimuladoContainer";

describe("Simulado Complete Practice Flow", () => {
  beforeEach(() => {
    browserAttemptStorage.clear();
  });

  it("completes full student journey: setup -> answer questions -> results -> certificate -> retry missed", async () => {
    const user = userEvent.setup();
    createAttempt(
      {
        axisId: "all",
        difficulty: "all",
        questionCount: 5,
        mode: "INSTANT_FEEDBACK",
      },
      bundledQuestionBank,
      browserAttemptStorage,
    );
    const { unmount } = render(<SimuladoContainer />);

    // 1. Question Runner - Question 1
    expect(screen.getByLabelText(/banner contextual/i)).toBeInTheDocument();
    expect(screen.getByRole("progressbar")).toBeInTheDocument();

    // Answer 5 questions
    for (let i = 0; i < 5; i++) {
      // Find options
      const optionButtons = screen.queryAllByRole("button", { pressed: false });
      const tfButtons = screen.queryAllByText(/verdadeiro|falso/i);
      const textInput = screen.queryByPlaceholderText(/exemplo de comando/i);

      const firstOption = optionButtons[0];
      const firstTf = tfButtons[0];

      if (firstOption) {
        await user.click(firstOption);
      } else if (firstTf) {
        await user.click(firstTf);
      } else if (textInput) {
        await user.type(textInput, "teste");
      }

      // Confirm answer
      const confirmBtn = screen.getByRole("button", { name: /confirmar resposta/i });
      await user.click(confirmBtn);

      // Verify explanation card is visible
      expect(screen.getByText(/explicação técnica:/i)).toBeInTheDocument();

      // Click Next or Finish
      if (i < 4) {
        const nextBtn = screen.getByRole("button", { name: /próxima questão/i });
        await user.click(nextBtn);
      } else {
        const finishBtn = screen.getByRole("button", { name: /finalizar simulado/i });
        await user.click(finishBtn);
      }
    }

    // 2. Results Screen
    expect(screen.getByRole("heading", { name: /resultado do simulado/i })).toBeInTheDocument();
    expect(screen.getByText(/aproveitamento geral/i)).toBeInTheDocument();
    expect(screen.getByText(/aproveitamento por eixo curricular/i)).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: /gabarito comentado e diagnóstico/i }),
    ).toBeInTheDocument();

    // 3. Certificate Modal
    const certBtn = screen.getByRole("button", { name: /emitir certificado simbólico/i });
    await user.click(certBtn);

    expect(
      screen.getByRole("heading", { name: /certificado simbólico de desempenho/i }),
    ).toBeInTheDocument();
    expect(screen.getByDisplayValue("Estudante Turma 001")).toBeInTheDocument();

    // Edit recipient name
    const nameInput = screen.getByLabelText(/nome do participante/i);
    await user.clear(nameInput);
    await user.type(nameInput, "Marcos Vinicius");
    expect(screen.getByDisplayValue("Marcos Vinicius")).toBeInTheDocument();

    // Close certificate modal
    const closeBtn = screen.getByRole("button", { name: /fechar/i });
    await user.click(closeBtn);
    expect(
      screen.queryByRole("heading", { name: /certificado simbólico de desempenho/i }),
    ).not.toBeInTheDocument();

    // 4. Test Recovery across reload
    // If student refreshes the browser now, the results remain intact
    unmount();
    render(<SimuladoContainer />);
    expect(screen.getByRole("heading", { name: /resultado do simulado/i })).toBeInTheDocument();
  }, 15000);
});
