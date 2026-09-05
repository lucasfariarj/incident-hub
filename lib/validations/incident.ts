import { z } from "zod";
export const severityValues = ["LOW", "MEDIUM", "HIGH", "CRITICAL"] as const;
export const statusValues = ["OPEN", "INVESTIGATING", "RESOLVED", "CLOSED"] as const;
export const createIncidentSchema = z.object({
  title: z.string().trim().min(3, "O título deve ter ao menos 3 caracteres.").max(120),
  description: z.string().trim().min(10, "A descrição deve ter ao menos 10 caracteres.").max(4000),
  severity: z.enum(severityValues), status: z.enum(statusValues).default("OPEN"),
  assignee: z.string().trim().min(2, "Informe a pessoa responsável.").max(100)
});
export const updateIncidentSchema = createIncidentSchema.partial();
export const updateMessageSchema = z.object({ content: z.string().trim().min(2, "A atualização não pode estar vazia.").max(2000), author: z.string().trim().min(2, "Informe quem fez a atualização.").max(100) });
