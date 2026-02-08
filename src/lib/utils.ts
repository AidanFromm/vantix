import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merge Tailwind CSS classes with proper precedence
 * This is the standard utility used by shadcn/ui and Aceternity UI
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
