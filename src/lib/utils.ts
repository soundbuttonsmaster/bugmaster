import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function normalizeArray<T>(data: T[] | { results: T[] } | null | undefined): T[] {
  if (!data) return [];
  return Array.isArray(data) ? data : data.results || [];
}

/** Extract display domain from URL for badges (e.g. https://app.example.com/path → app.example.com) */
export function getDomainFromLink(link: string | null | undefined): string {
  if (!link || typeof link !== "string") return "";
  try {
    const url = new URL(link.startsWith("http") ? link : `https://${link}`);
    return url.hostname.replace(/^www\./, "");
  } catch {
    return link.length > 40 ? link.slice(0, 40) + "…" : link;
  }
}

/** Completion % color: 0–30 red, 31–99 orange, 100 green */
export function getCompletionColorClasses(completion: number): string {
  if (completion <= 30) return "bg-red-100 text-red-800 border-red-200";
  if (completion < 100) return "bg-amber-100 text-amber-800 border-amber-200";
  return "bg-green-100 text-green-800 border-green-200";
}
