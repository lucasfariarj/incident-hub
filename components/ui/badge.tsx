import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";
import styles from "./ui.module.css";
export function Badge({ className, variant = "secondary", ...props }: HTMLAttributes<HTMLSpanElement> & { variant?: "secondary" | "destructive" | "outline" }) { return <span className={cn(styles.badge, variant === "secondary" && styles.secondary, variant === "destructive" && styles.destructive, variant === "outline" && styles.outlineBadge, className)} {...props} />; }
