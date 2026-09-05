"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { IncidentBadge } from "./incident-badge";

const statuses = [["OPEN", "Aberto"], ["INVESTIGATING", "Em análise"], ["RESOLVED", "Resolvido"], ["CLOSED", "Fechado"]];
const severities = [["LOW", "Baixa"], ["MEDIUM", "Média"], ["HIGH", "Alta"], ["CRITICAL", "Crítica"]];
type Incident = { id: string; title: string; description: string; severity: string; status: string; assignee: string; createdAt: string | Date; updates: { id: string; content: string; author: string; createdAt: string | Date }[] };

export function IncidentDetails({ incident }: { incident: Incident }) {
  const router = useRouter(); const [error, setError] = useState(""); const [busy, setBusy] = useState(false);
  async function patch(data: object) { setBusy(true); setError(""); const response = await fetch(`/api/incidents/${incident.id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) }); const body = await response.json(); setBusy(false); if (!response.ok) setError(body.error ?? "Não foi possível salvar."); else router.refresh(); }
  async function addUpdate(form: FormData) { await patch({ update: { content: form.get("content"), author: form.get("author") } }); }
  return <><section className="detail-head"><div><a href="/incidents" className="back">← Todos os incidentes</a><h1>{incident.title}</h1><p>{incident.description}</p></div><div className="badges"><IncidentBadge value={incident.status} /><IncidentBadge value={incident.severity} /></div></section><section className="panel fields"><h2>Acompanhamento</h2><div className="two-cols"><label>Status<Select disabled={busy} value={incident.status} onValueChange={(status) => patch({ status })}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{statuses.map(([value, label]) => <SelectItem key={value} value={value}>{label}</SelectItem>)}</SelectContent></Select></label><label>Severidade<Select disabled={busy} value={incident.severity} onValueChange={(severity) => patch({ severity })}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{severities.map(([value, label]) => <SelectItem key={value} value={value}>{label}</SelectItem>)}</SelectContent></Select></label><label>Responsável<Input disabled={busy} defaultValue={incident.assignee} onBlur={(event) => event.target.value !== incident.assignee && patch({ assignee: event.target.value })} /></label></div>{error && <p className="error">{error}</p>}</section><section className="panel timeline"><h2>Atualizações <span>{incident.updates.length}</span></h2><form action={addUpdate} className="message-form"><Input name="author" required minLength={2} placeholder="Seu nome" /><Textarea name="content" required minLength={2} placeholder="Registre uma atualização do tratamento…" rows={3} /><Button disabled={busy}>Enviar atualização</Button></form><div className="messages">{incident.updates.map((update) => <article key={update.id} className="message"><div className="avatar">{update.author.slice(0, 1).toUpperCase()}</div><div><strong>{update.author}</strong><time>{new Intl.DateTimeFormat("pt-BR", { dateStyle: "medium", timeStyle: "short" }).format(new Date(update.createdAt))}</time><p>{update.content}</p></div></article>)}</div></section></>;
}
