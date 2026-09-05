import { Badge } from "@/components/ui/badge";
const labels: Record<string, string> = { LOW: "Baixa", MEDIUM: "Média", HIGH: "Alta", CRITICAL: "Crítica", OPEN: "Aberto", INVESTIGATING: "Em análise", RESOLVED: "Resolvido", CLOSED: "Fechado" };
export function IncidentBadge({ value }: { value: string }) { const critical = value === "CRITICAL"; return <Badge variant={critical ? "destructive" : "secondary"} className={`badge ${["LOW", "MEDIUM", "HIGH", "CRITICAL"].includes(value) ? "severity" : "status"} ${value.toLowerCase()}`}>{labels[value] ?? value}</Badge>; }
