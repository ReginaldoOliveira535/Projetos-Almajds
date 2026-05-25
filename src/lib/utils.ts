// src/lib/utils.ts
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Funções de formatação (usadas no Checkout)
export function formatCPF(value: string): string {
  const cleaned = value.replace(/\D/g, "");
  if (cleaned.length <= 3) return cleaned;
  if (cleaned.length <= 6) return cleaned.replace(/(\d{3})(\d+)/, "$1.$2");
  if (cleaned.length <= 9) return cleaned.replace(/(\d{3})(\d{3})(\d+)/, "$1.$2.$3");
  return cleaned.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
}

export function formatCEP(value: string): string {
  const cleaned = value.replace(/\D/g, "");
  if (cleaned.length <= 5) return cleaned;
  return cleaned.replace(/(\d{5})(\d{1,3})/, "$1-$2");
}