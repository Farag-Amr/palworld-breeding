"use client";

import { PalIcon } from "@/components/PalIcon";
import { paldexLabel } from "@/lib/format";
import type { Pal } from "@/lib/types";

export function PaldexList({
  pals,
  parent1Id,
  parent2Id,
  onPick,
}: {
  pals: Pal[];
  parent1Id: string | null;
  parent2Id: string | null;
  onPick: (pal: Pal) => void;
}) {
  return (
    <section className="flex flex-col gap-3">
      <div>
        <h2 className="text-sm font-semibold text-sky-200">All pals</h2>
        <p className="mt-1 text-sm text-zinc-500">
          Paldex order. Click a Pal to set the highlighted parent.
        </p>
      </div>
      <ul className="max-h-[28rem] overflow-y-auto rounded-xl border border-zinc-800 bg-zinc-900/60">
        {pals.map((pal) => {
          const isParent1 = pal.id === parent1Id;
          const isParent2 = pal.id === parent2Id;
          const selected = isParent1 || isParent2;
          const badge =
            isParent1 && isParent2
              ? "P1+P2"
              : isParent1
                ? "P1"
                : isParent2
                  ? "P2"
                  : null;

          return (
            <li key={pal.id} className="border-b border-zinc-800 last:border-b-0">
              <button
                type="button"
                onClick={() => onPick(pal)}
                className={[
                  "flex w-full items-center gap-3 px-3 py-2 text-left hover:bg-zinc-800/70",
                  selected ? "bg-sky-950/40" : "",
                ].join(" ")}
              >
                <PalIcon pal={pal} />
                <span className="w-16 shrink-0 font-mono text-xs text-zinc-500">
                  {paldexLabel(pal)}
                </span>
                <span className="text-sm text-zinc-100">{pal.name}</span>
                {badge ? (
                  <span className="ml-auto text-[10px] font-medium tracking-wide text-sky-300">
                    {badge}
                  </span>
                ) : null}
              </button>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
