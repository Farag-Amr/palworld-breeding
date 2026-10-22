"use client";

import { PalIcon } from "@/components/PalIcon";
import { PalSearch } from "@/components/PalSearch";
import { paldexLabel } from "@/lib/format";
import { filterPalsByNamePrefix } from "@/lib/pal-search";
import type { Pal } from "@/lib/types";
import { useState } from "react";

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
  const [query, setQuery] = useState("");
  const visiblePals = filterPalsByNamePrefix(pals, query);

  return (
    <section className="flex flex-col gap-3">
      <div>
        <h2 className="text-sm font-semibold text-sky-200">All pals</h2>
        <p className="mt-1 text-sm text-zinc-500">
          Paldex order. Click a Pal to set the highlighted parent.
        </p>
      </div>
      <PalSearch value={query} onChange={setQuery} />
      <ul className="max-h-[28rem] overflow-y-auto rounded-xl border border-zinc-800 bg-zinc-900/60">
        {visiblePals.length === 0 ? (
          <li className="px-3 py-4 text-sm text-zinc-500">No pals match.</li>
        ) : null}
        {visiblePals.map((pal) => {
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
                disabled={!pal.breedable}
                onClick={() => onPick(pal)}
                className={[
                  "flex w-full items-center gap-3 px-3 py-2 text-left",
                  pal.breedable
                    ? "hover:bg-zinc-800/70"
                    : "cursor-not-allowed opacity-60",
                  selected ? "bg-sky-950/40" : "",
                ].join(" ")}
              >
                <PalIcon pal={pal} />
                <span className="w-16 shrink-0 font-mono text-xs text-zinc-500">
                  {paldexLabel(pal)}
                </span>
                <span className="text-sm text-zinc-100">{pal.name}</span>
                {!pal.breedable ? (
                  <span className="ml-auto text-xs text-zinc-500">
                    This pal is not breedable.
                  </span>
                ) : badge ? (
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
