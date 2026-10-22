import type { Pal } from "@/lib/types";

export function filterPalsByNamePrefix(pals: Pal[], query: string) {
  const prefix = query.trim().toLowerCase();
  if (!prefix) return pals;
  return pals.filter((pal) => pal.name.toLowerCase().startsWith(prefix));
}
