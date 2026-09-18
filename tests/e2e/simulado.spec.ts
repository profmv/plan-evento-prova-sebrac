import { expect, test } from "@playwright/test";

test("starts the formative simulation directly from the published page", async ({ page }) => {
  await page.goto("/");
  await expect(
    page.getByRole("heading", { name: "Simulado Formativo de Conhecimentos Gerais" }),
  ).toBeVisible();
  await expect(page.getByLabel("Duração do Exame")).toHaveValue("180");
  await expect(page.getByLabel("Eixo Curricular")).toHaveCount(0);
  await expect(page.getByLabel("Quantidade de Questões")).toHaveCount(0);
  await page.getByRole("button", { name: "Iniciar prova completa" }).click();
  await expect(page.getByText(/questão 1 de/i)).toBeVisible();
  await expect(page.getByText(/questão 1 de 65/i)).toBeVisible();
});
