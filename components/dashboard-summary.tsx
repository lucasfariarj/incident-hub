import styles from "./dashboard-summary.module.css";

export function DashboardSummary({ stats }: { stats: { open: number; criticalOpen: number; resolved: number } }) {
  return <section className={styles.grid} aria-label="Resumo de incidentes"><article className={`${styles.card} ${styles.open}`}><p className={styles.label}>Incidentes abertos</p><strong className={styles.value}>{stats.open}</strong><p className={styles.hint}>Aguardando resolução ou fechamento</p></article><article className={`${styles.card} ${styles.critical}`}><p className={styles.label}>Critical não resolvidos</p><strong className={styles.value}>{stats.criticalOpen}</strong><p className={styles.hint}>Demandam atenção imediata</p></article><article className={`${styles.card} ${styles.resolved}`}><p className={styles.label}>Incidentes resolvidos</p><strong className={styles.value}>{stats.resolved}</strong><p className={styles.hint}>Aguardando fechamento ou já concluídos</p></article></section>;
}
