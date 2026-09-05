import { NextResponse } from "next/server";
import { createIncidentSchema } from "@/lib/validations/incident";
import { createIncident, listIncidents } from "@/services/incident.service";
export async function GET() { return NextResponse.json(await listIncidents()); }
export async function POST(request: Request) { try { const parsed=createIncidentSchema.safeParse(await request.json()); if(!parsed.success) return NextResponse.json({ error: parsed.error.issues[0].message },{status:400}); return NextResponse.json(await createIncident(parsed.data),{status:201}); } catch { return NextResponse.json({error:"Não foi possível criar o incidente."},{status:500}); } }
