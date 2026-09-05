import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import styles from "./incident-filters.module.css";

const statuses = [["OPEN", "Aberto"], ["INVESTIGATING", "Em análise"], ["RESOLVED", "Resolvido"], ["CLOSED", "Fechado"]];
const severities = [["LOW", "Baixa"], ["MEDIUM", "Média"], ["HIGH", "Alta"], ["CRITICAL", "Crítica"]];

export function IncidentFilters({ status, severity }: { status?: string; severity?: string }) {
  return <form className={styles.filters} method="GET"><div className={styles.filterLabel}><span>⌘</span><strong>Filtrar reportes</strong></div><label>Status<Select name="status" defaultValue={status ?? "all"}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="all">Todos os status</SelectItem>{statuses.map(([value, label]) => <SelectItem key={value} value={value}>{label}</SelectItem>)}</SelectContent></Select></label><label>Severidade<Select name="severity" defaultValue={severity ?? "all"}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="all">Todas as severidades</SelectItem>{severities.map(([value, label]) => <SelectItem key={value} value={value}>{label}</SelectItem>)}</SelectContent></Select></label><Button type="submit">Aplicar</Button>{(status || severity) && <Link className={styles.clear} href="/incidents">Limpar filtros</Link>}</form>;
}
