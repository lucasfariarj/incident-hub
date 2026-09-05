import type { Metadata } from "next";
import "./globals.css";
export const metadata: Metadata = { title: "Incident Hub", description: "Central de incidentes operacionais" };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) { return <html lang="pt-BR"><body>{children}</body></html>; }
