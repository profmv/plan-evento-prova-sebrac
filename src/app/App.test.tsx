import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { App } from "./App";

describe("App", () => {
  it("presents the team-first portal entry point", () => {
    render(<App />);

    expect(
      screen.getByRole("heading", { name: /revisão que transforma conhecimento em ação/i }),
    ).toBeInTheDocument();
    expect(screen.getByText("18")).toBeInTheDocument();
    expect(screen.getByText(/participantes previstos/i)).toBeInTheDocument();
  });

  it("opens the participant session view without requesting a permanent account", async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole("button", { name: /entrar na sessão/i }));

    expect(
      screen.getByRole("heading", { name: /entre na sessão da sua equipe/i }),
    ).toBeInTheDocument();
    expect(screen.getByLabelText(/código da sessão/i)).toBeInTheDocument();
    expect(screen.getByText(/nenhuma conta permanente/i)).toBeInTheDocument();
  });

  it("keeps unresolved production controls explicit", async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole("button", { name: /área do professor/i }));

    expect(screen.getByText(/nenhuma credencial padrão foi embutida/i)).toBeInTheDocument();
    expect(screen.getByText(/decisão pendente/i)).toBeInTheDocument();
  });
});
