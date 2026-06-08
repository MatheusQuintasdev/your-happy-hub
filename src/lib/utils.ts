import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatScore(score: number): { label: string; color: string } {
  if (score <= 40) return { label: "Crítico", color: "text-red-500" };
  if (score <= 60) return { label: "Precisa Melhorar", color: "text-orange-500" };
  if (score <= 80) return { label: "Bom", color: "text-blue-500" };
  return { label: "Excelente", color: "text-green-500" };
}
