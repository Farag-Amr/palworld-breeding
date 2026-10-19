import { paldexLabel } from "@/lib/format";
import type { Pal } from "@/lib/types";

export function PaldexList({ pals }: { pals: Pal[] }) {
  return (
    <section className="flex flex-col gap-3">
      <div>
        <h2 className="text-sm font-semibold text-sky-200">All pals</h2>
        <p className="mt-1 text-sm text-zinc-500">
          Paldex order. Pictures come later — this is just the names for now.
        </p>
      </div>
      <ul className="max-h-[28rem] overflow-y-auto rounded-xl border border-zinc-800 bg-zinc-900/60">
        {pals.map((pal) => (
          <li
            key={pal.id}
            className="flex items-center gap-3 border-b border-zinc-800 px-3 py-2 last:border-b-0"
          >
            <span
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-zinc-800 text-[10px] font-medium text-zinc-400"
              aria-hidden
            >
              {pal.paldexNo}
            </span>
            <span className="w-16 shrink-0 font-mono text-xs text-zinc-500">
              {paldexLabel(pal)}
            </span>
            <span className="text-sm text-zinc-100">{pal.name}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
