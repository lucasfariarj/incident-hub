"use client";
import * as SelectPrimitive from "@radix-ui/react-select";
import type { ComponentProps } from "react";
import { Check, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import styles from "./ui.module.css";

export const Select = SelectPrimitive.Root;
export const SelectValue = SelectPrimitive.Value;
export function SelectTrigger({ className, children, ...props }: ComponentProps<typeof SelectPrimitive.Trigger>) { return <SelectPrimitive.Trigger className={cn(styles.trigger, className)} {...props}>{children}<SelectPrimitive.Icon asChild><ChevronDown size={16} /></SelectPrimitive.Icon></SelectPrimitive.Trigger>; }
export function SelectContent({ className, children, ...props }: ComponentProps<typeof SelectPrimitive.Content>) { return <SelectPrimitive.Portal><SelectPrimitive.Content className={cn(styles.content, className)} position="popper" {...props}><SelectPrimitive.Viewport>{children}</SelectPrimitive.Viewport></SelectPrimitive.Content></SelectPrimitive.Portal>; }
export function SelectItem({ className, children, ...props }: ComponentProps<typeof SelectPrimitive.Item>) { return <SelectPrimitive.Item className={cn(styles.item, className)} {...props}><SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText><SelectPrimitive.ItemIndicator className={styles.check}><Check size={15} /></SelectPrimitive.ItemIndicator></SelectPrimitive.Item>; }
