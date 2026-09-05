import Link from "next/link";
import { DashboardSummary } from "@/components/dashboard-summary";
import { IncidentCard } from "@/components/incident-card";
import { getDashboardStats, listIncidents } from "@/services/incident.service";
import styles from "./dashboard.module.css";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const [stats, incidents] = await Promise.all([getDashboardStats(), listIncidents()]);
  return <main className="shell"><header><Link className="brand" href="/dashboard"><div className="brand-mark">!</div><div><b>Incident Hub</b><small>Central operacional</small></div></Link><div className={styles.headerActions}><Link className={styles.navLink} href="/incidents">Todos os incidentes</Link><Link className="button" href="/incidents/new">＋ Novo incidente</Link></div></header><section className="hero"><p>VISÃO GERAL</p><h1>Dashboard operacional</h1><span>Acompanhe rapidamente o estado atual dos reportes.</span></section><DashboardSummary stats={stats} /><section className={styles.recentHead}><div><h2>Reportes recentes</h2><p>Últimos incidentes registrados ou atualizados.</p></div><Link className={styles.navLink} href="/incidents">Ver todos →</Link></section><section className="feed">{incidents.slice(0, 5).map((incident) => <IncidentCard key={incident.id} incident={incident} />)}{incidents.length === 0 && <div className="empty"><div>✓</div><h2>Nenhum incidente por aqui</h2><p>Quando algo precisar de atenção, registre o primeiro incidente.</p><Link className="button" href="/incidents/new">Registrar incidente</Link></div>}</section></main>;
}
