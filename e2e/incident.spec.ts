import { expect, test } from "@playwright/test";
test("registra um incidente e exibe seu histórico", async ({ page }) => {
  await page.goto("/incidents/new");
  await page.getByLabel("Título").fill("Integração indisponível");
  await page.getByLabel("Descrição").fill("A integração com o parceiro deixou de responder.");
  await page.getByLabel("Responsável").fill("Equipe de operações");
  await page.getByRole("button", { name: "Registrar incidente" }).click();
  await expect(page.getByRole("heading", { name: "Integração indisponível" })).toBeVisible();
  await expect(page.getByText("Incidente registrado.")).toBeVisible();
});
