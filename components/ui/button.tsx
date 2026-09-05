import type { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";
import styles from "./ui.module.css";
type Props = ButtonHTMLAttributes<HTMLButtonElement> & { variant?: "default" | "outline" | "ghost" };
export function Button({ className, variant = "default", ...props }: Props) { return <button className={cn(styles.button, variant === "outline" && styles.outline, variant === "ghost" && styles.ghost, className)} {...props} />; }
