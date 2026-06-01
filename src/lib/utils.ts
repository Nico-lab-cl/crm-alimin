import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatReceiptUrl(url: string | null | undefined): string {
  if (!url) return '';
  if (url.startsWith('http') || url.startsWith('data:') || url.startsWith('/api') || url.length <= 100) {
    return url;
  }
  // If it's a base64 string, prefix it with appropriate type
  if (url.startsWith('JVBERi')) {
    return `data:application/pdf;base64,${url}`;
  } else if (url.startsWith('iVBORw')) {
    return `data:image/png;base64,${url}`;
  } else {
    // Default to jpeg
    return `data:image/jpeg;base64,${url}`;
  }
}

