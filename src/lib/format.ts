import type { Pal } from "@/lib/types";

export function paldexLabel(pal: Pal) {
  const number = String(pal.paldexNo).padStart(3, "0");
  return pal.isVariant ? `#${number}.1` : `#${number}`;
}
