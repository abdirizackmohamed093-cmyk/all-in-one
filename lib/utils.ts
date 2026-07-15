import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

// Combines conditional class logic (clsx) with Tailwind-aware merging
// (twMerge) so conflicting classes like "px-2" and "px-4" resolve
// correctly instead of both being applied.
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}