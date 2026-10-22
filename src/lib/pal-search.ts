import type { Pal } from "@/lib/types";

export function filterPalsByNamePrefix(pals: Pal[], query: string) {
  const prefix = query.trim().toLowerCase();
  if (!prefix) return pals;

  const nameStartsWith: Pal[] = [];
  const laterWordStartsWith: Pal[] = [];

  for (const pal of pals) {
    const words = pal.name.toLowerCase().split(/\s+/);
    if (words[0]?.startsWith(prefix)) {
      nameStartsWith.push(pal);
    } else if (words.some((word) => word.startsWith(prefix))) {
      laterWordStartsWith.push(pal);
    }
  }

  return [...nameStartsWith, ...laterWordStartsWith];
}
