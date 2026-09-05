import type { IncidentStatus } from "@prisma/client";
import type { z } from "zod";
import { prisma } from "@/lib/prisma";
import type { createIncidentSchema, updateIncidentSchema, updateMessageSchema } from "@/lib/validations/incident";

type NewIncident = z.infer<typeof createIncidentSchema>;
type IncidentPatch = z.infer<typeof updateIncidentSchema>;
type NewUpdate = z.infer<typeof updateMessageSchema>;

const transitions: Record<IncidentStatus, IncidentStatus[]> = { OPEN: ["INVESTIGATING", "RESOLVED", "CLOSED"], INVESTIGATING: ["OPEN", "RESOLVED", "CLOSED"], RESOLVED: ["OPEN", "CLOSED"], CLOSED: ["OPEN"] };
const statusLabels: Record<IncidentStatus, string> = { OPEN: "Aberto", INVESTIGATING: "Em análise", RESOLVED: "Resolvido", CLOSED: "Fechado" };

export function canChangeStatus(from: IncidentStatus, to: IncidentStatus) { return from === to || transitions[from].includes(to); }
export function statusHistoryMessage(status: IncidentStatus) { return `Status alterado para ${statusLabels[status]}.`; }
export type IncidentFilters = { status?: IncidentStatus; severity?: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL" };

export async function getDashboardStats() {
  const unresolved = { notIn: ["RESOLVED", "CLOSED"] as IncidentStatus[] };
  const [open, criticalOpen, resolved] = await prisma.$transaction([
    prisma.incident.count({ where: { status: unresolved } }),
    prisma.incident.count({ where: { severity: "CRITICAL", status: unresolved } }),
    prisma.incident.count({ where: { status: "RESOLVED" } }),
  ]);
  return { open, criticalOpen, resolved };
}

export async function listIncidents(filters: IncidentFilters = {}) { return prisma.incident.findMany({ where: { ...(filters.status && { status: filters.status }), ...(filters.severity && { severity: filters.severity }) }, orderBy: [{ status: "asc" }, { createdAt: "desc" }], include: { _count: { select: { updates: true } } } }); }
export async function getIncident(id: string) { return prisma.incident.findUnique({ where: { id }, include: { updates: { orderBy: { createdAt: "desc" } } } }); }
export async function createIncident(data: NewIncident) { return prisma.incident.create({ data: { ...data, updates: { create: { content: statusHistoryMessage(data.status), author: "Sistema" } } }, include: { updates: true } }); }
export async function patchIncident(id: string, data: IncidentPatch) {
  const current = await prisma.incident.findUnique({ where: { id } });
  if (!current) return null;
  if (data.status && !canChangeStatus(current.status, data.status)) throw new Error("Transição de status não permitida.");
  return prisma.$transaction(async (tx) => {
    const incident = await tx.incident.update({ where: { id }, data, include: { updates: { orderBy: { createdAt: "desc" } } } });
    if (data.status && data.status !== current.status) await tx.incidentUpdate.create({ data: { incidentId: id, content: statusHistoryMessage(data.status), author: "Sistema" } });
    return incident;
  });
}
export async function addUpdate(id: string, data: NewUpdate) { const incident = await prisma.incident.findUnique({ where: { id } }); if (!incident) return null; return prisma.incidentUpdate.create({ data: { ...data, incidentId: id } }); }
export async function removeIncident(id: string) { return prisma.incident.delete({ where: { id } }); }
