import Link from "next/link";
import { IncidentCard } from "@/components/incident-card";
import { IncidentFilters } from "@/components/incident-filters";
import { severityValues, statusValues } from "@/lib/validations/incident";
import { listIncidents } from "@/services/incident.service";
import type { IncidentStatus } from "@prisma/client";

export const dynamic = "force-dynamic";

export default async function IncidentsPage({ searchParams }: { searchParams: Promise<{ status?: string; severity?: string }> }) {
  const query = await searchParams;
  const status = statusValues.includes(query.status as typeof statusValues[number]) ? query.status as IncidentStatus : undefined;
  const severity = severityValues.includes(query.severity as typeof severityValues[number]) ? query.severity as typeof severityValues[number] : undefined;
  const incidents = await listIncidents({ status, severity });
  const open = incidents.filter((incident) => !["RESOLVED", "CLOSED"].includes(incident.status)).length;
  const filtered = Boolean(status || severity);

  return <main className="shell"><header><Link className="brand" href="/dashboard"><div className="brand-mark">!</div><div><b>Incident Hub</b><small>Central operacional</small></div></Link><Link className="button" href="/incidents/new">＋ Novo incidente</Link></header><section className="hero"><p>VISÃO GERAL</p><h1>Incidentes</h1><span>{open} {open === 1 ? "incidente aberto" : "incidentes abertos"} · {incidents.length} {filtered ? "encontrados" : "no total"}</span></section><IncidentFilters status={status} severity={severity} /><section className="feed">{incidents.length ? incidents.map((incident) => <IncidentCard key={incident.id} incident={incident} />) : <div className="empty"><div>✓</div><h2>Nenhum incidente encontrado</h2><p>{filtered ? "Tente remover ou alterar os filtros selecionados." : "Quando algo precisar de atenção, registre o primeiro incidente."}</p><Link className="button" href={filtered ? "/incidents" : "/incidents/new"}>{filtered ? "Limpar filtros" : "Registrar incidente"}</Link></div>}</section></main>;
}
