# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: incident.spec.ts >> registra um incidente e exibe seu histórico
- Location: e2e\incident.spec.ts:2:5

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: getByText('Incidente registrado.')
Expected: visible
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" getByText('Incidente registrado.') with timeout 5000ms
  - waiting for getByText('Incidente registrado.')

```

```yaml
- alert
- main:
  - link "← Todos os incidentes":
    - /url: /incidents
  - heading "Integração indisponível" [level=1]
  - paragraph: A integração com o parceiro deixou de responder.
  - text: Aberto Média
  - heading "Acompanhamento" [level=2]
  - text: Status
  - combobox "Status": Aberto
  - text: Severidade
  - combobox "Severidade": Média
  - text: Responsável
  - textbox "Responsável": Equipe de operações
  - heading "Atualizações 1" [level=2]
  - textbox "Seu nome"
  - textbox "Registre uma atualização do tratamento…"
  - button "Enviar atualização"
  - article:
    - text: S
    - strong: Sistema
    - time: 5 de set. de 2026, 14:20
    - paragraph: Status alterado para Aberto.
```

# Test source

```ts
  1  | import { expect, test } from "@playwright/test";
  2  | test("registra um incidente e exibe seu histórico", async ({ page }) => {
  3  |   await page.goto("/incidents/new");
  4  |   await page.getByLabel("Título").fill("Integração indisponível");
  5  |   await page.getByLabel("Descrição").fill("A integração com o parceiro deixou de responder.");
  6  |   await page.getByLabel("Responsável").fill("Equipe de operações");
  7  |   await page.getByRole("button", { name: "Registrar incidente" }).click();
  8  |   await expect(page.getByRole("heading", { name: "Integração indisponível" })).toBeVisible();
> 9  |   await expect(page.getByText("Incidente registrado.")).toBeVisible();
     |                                                         ^ Error: expect(locator).toBeVisible() failed
  10 | });
  11 | 
```