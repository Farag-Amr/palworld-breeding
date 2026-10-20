import type { Pal } from "@/lib/types";

export function palIconSrc(pal: Pal) {
  return `/pals/${pal.id}.webp`;
}
