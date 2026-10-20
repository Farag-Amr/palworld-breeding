import { palIconSrc } from "@/lib/pal-icon";
import type { Pal } from "@/lib/types";

export function PalIcon({ pal, size = 36 }: { pal: Pal; size?: number }) {
  return (
    <img
      src={palIconSrc(pal)}
      alt=""
      width={size}
      height={size}
      className="shrink-0 rounded-lg bg-zinc-800 object-contain"
      style={{ width: size, height: size }}
    />
  );
}
