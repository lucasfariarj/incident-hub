import { notFound } from "next/navigation";
import { IncidentDetails } from "@/components/incident-details";
import { getIncident } from "@/services/incident.service";
export const dynamic = "force-dynamic";
export default async function IncidentPage({ params }: { params: Promise<{id:string}> }) { const incident=await getIncident((await params).id); if(!incident) notFound(); return <main className="shell narrow"><IncidentDetails incident={incident}/></main>; }
