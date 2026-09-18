import { expect, test } from "@playwright/test";

test("starts a formative simulation from the public portal", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Simulado", exact: true }).click();
  await expect(
    page.getByRole("heading", { name: "Simulado Formativo de Conhecimentos Gerais" }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Iniciar Simulado" }).click();
  await expect(page.getByText(/questão 1 de/i)).toBeVisible();
});
