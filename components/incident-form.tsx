"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { createIncidentSchema } from "@/lib/validations/incident";

const severities = [["LOW", "Baixa"], ["MEDIUM", "Média"], ["HIGH", "Alta"], ["CRITICAL", "Crítica"]];

export function IncidentForm() {
  const router = useRouter(); const [error, setError] = useState(""); const [saving, setSaving] = useState(false);
  async function submit(form: FormData) { setError(""); const parsed = createIncidentSchema.safeParse(Object.fromEntries(form)); if (!parsed.success) return setError(parsed.error.issues[0].message); setSaving(true); const response = await fetch("/api/incidents", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(parsed.data) }); const data = await response.json(); setSaving(false); if (!response.ok) return setError(data.error ?? "Não foi possível registrar o incidente."); router.push(`/incidents/${data.id}`); router.refresh(); }
  return <form action={submit} className="form"><label>Título<Input name="title" required minLength={3} placeholder="Ex.: API de pagamentos indisponível" /></label><label>Descrição<Textarea name="description" required minLength={10} rows={5} placeholder="O que aconteceu, qual o impacto e quando começou?" /></label><div className="two-cols"><label>Severidade<Select name="severity" defaultValue="MEDIUM"><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{severities.map(([value, label]) => <SelectItem key={value} value={value}>{label}</SelectItem>)}</SelectContent></Select></label><label>Responsável<Input name="assignee" required minLength={2} placeholder="Nome da pessoa responsável" /></label></div><input type="hidden" name="status" value="OPEN" />{error && <p className="error" role="alert">{error}</p>}<div className="actions"><Button type="button" variant="outline" onClick={() => router.back()}>Cancelar</Button><Button disabled={saving}>{saving ? "Registrando…" : "Registrar incidente"}</Button></div></form>;
}
