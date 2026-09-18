import { expect, test } from "@playwright/test";

test("starts the formative simulation directly from the published page", async ({ page }) => {
  await page.goto("/");
  await expect(
    page.getByRole("heading", { name: "Simulado Formativo de Conhecimentos Gerais" }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Iniciar Simulado" }).click();
  await expect(page.getByText(/questão 1 de/i)).toBeVisible();
});
