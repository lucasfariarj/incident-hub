import { describe, expect, it } from "vitest";
import { canChangeStatus, statusHistoryMessage } from "../services/incident.service";
import { createIncidentSchema, updateMessageSchema } from "../lib/validations/incident";

describe("regras de incidentes", () => {
  it("aceita os campos obrigatórios válidos", () => expect(createIncidentSchema.safeParse({ title: "Serviço indisponível", description: "O serviço principal não responde.", severity: "HIGH", assignee: "Ana" }).success).toBe(true));
  it("rejeita título e descrição insuficientes", () => expect(createIncidentSchema.safeParse({ title: "x", description: "curta", severity: "HIGH", assignee: "" }).success).toBe(false));
  it("permite encerrar um incidente aberto", () => expect(canChangeStatus("OPEN", "CLOSED")).toBe(true));
  it("não permite voltar de resolvido para em análise", () => expect(canChangeStatus("RESOLVED", "INVESTIGATING")).toBe(false));
  it("exige conteúdo para atualização", () => expect(updateMessageSchema.safeParse({ content: "", author: "Ana" }).success).toBe(false));
});

describe("histórico de status", () => {
  it("descreve o fechamento para a timeline", () => expect(statusHistoryMessage("CLOSED")).toBe("Status alterado para Fechado."));
});
