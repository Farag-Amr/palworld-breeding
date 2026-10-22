import { PalIcon } from "@/components/PalIcon";
import { paldexLabel } from "@/lib/format";
import type { Pal, PalGender, ParentPair } from "@/lib/types";

function genderMark(gender: PalGender | null) {
  if (gender === "male") return "M";
  if (gender === "female") return "F";
  return null;
}

function PairPal({ pal, gender }: { pal: Pal; gender: PalGender | null }) {
  const mark = genderMark(gender);
  return (
    <span className="flex min-w-0 items-center gap-2">
      <PalIcon pal={pal} size={32} />
      <span className="min-w-0">
        <span className="block truncate text-sm text-zinc-100">
          {pal.name}
          {mark ? (
            <span className="ml-1 text-[10px] font-medium text-sky-300">
              {mark}
            </span>
          ) : null}
        </span>
        <span className="block font-mono text-[11px] text-zinc-500">
          {paldexLabel(pal)}
        </span>
      </span>
    </span>
  );
}

export function ParentPairList({ pairs }: { pairs: ParentPair[] }) {
  return (
    <div className="flex flex-col gap-2">
      <p className="text-sm text-zinc-500">
        {pairs.length === 1
          ? "1 parent combination"
          : `${pairs.length} parent combinations`}
      </p>
      <ul className="max-h-[28rem] overflow-y-auto rounded-xl border border-zinc-800 bg-zinc-900/60">
        {pairs.map((pair) => (
          <li
            key={`${pair.parent1.id}:${pair.parent1Gender ?? ""}:${pair.parent2.id}:${pair.parent2Gender ?? ""}`}
            className="flex items-center gap-3 border-b border-zinc-800 px-3 py-2 last:border-b-0"
          >
            <PairPal pal={pair.parent1} gender={pair.parent1Gender} />
            <span className="shrink-0 text-zinc-500" aria-hidden>
              ×
            </span>
            <PairPal pal={pair.parent2} gender={pair.parent2Gender} />
          </li>
        ))}
      </ul>
    </div>
  );
}
