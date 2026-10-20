import { PalIcon } from "@/components/PalIcon";
import { paldexLabel } from "@/lib/format";
import type { Pal, PalGender } from "@/lib/types";

type PalSlotProps = {
  label: string;
  pal: Pal | null;
  emptyHint: string;
  interactive?: boolean;
  active?: boolean;
  showPlusWhenEmpty?: boolean;
  gender?: PalGender;
  onSelect?: () => void;
  onClear?: () => void;
  onGenderChange?: (gender: PalGender) => void;
};

export function PalSlot({
  label,
  pal,
  emptyHint,
  interactive = false,
  active = false,
  showPlusWhenEmpty = false,
  gender,
  onSelect,
  onClear,
  onGenderChange,
}: PalSlotProps) {
  const className = [
    "relative rounded-xl border bg-zinc-900/60 text-left",
    active ? "border-sky-500" : "border-zinc-800",
  ].join(" ");

  const content = (
    <>
      <p className="text-xs font-medium uppercase tracking-wide text-sky-200/80">
        {label}
      </p>
      {pal ? (
        <div className="mt-3 flex items-center gap-3">
          <PalIcon pal={pal} size={56} />
          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-zinc-100">{pal.name}</p>
            <p className="font-mono text-xs text-zinc-500">{paldexLabel(pal)}</p>
          </div>
        </div>
      ) : (
        <div className="mt-3 flex min-h-[56px] items-center gap-3">
          <span
            className="flex h-14 w-14 shrink-0 items-center justify-center rounded-lg border border-dashed border-zinc-700 bg-zinc-800/60 text-2xl font-light text-zinc-500"
            aria-hidden
          >
            {showPlusWhenEmpty ? "+" : "—"}
          </span>
          {emptyHint ? <p className="text-sm text-zinc-500">{emptyHint}</p> : null}
        </div>
      )}
    </>
  );

  if (!interactive) {
    return <div className={`${className} p-4`}>{content}</div>;
  }

  return (
    <div className={className}>
      <button
        type="button"
        className="w-full rounded-xl p-4 pb-10 text-left hover:bg-zinc-800/40"
        onClick={onSelect}
      >
        {content}
      </button>
      {pal && onClear ? (
        <button
          type="button"
          className="absolute top-2 right-2 rounded px-1.5 py-0.5 text-xs text-zinc-500 hover:bg-zinc-800 hover:text-zinc-200"
          onClick={onClear}
        >
          Clear
        </button>
      ) : null}
      {onGenderChange && gender ? (
        <div className="absolute bottom-2 left-4 flex gap-1">
          <GenderButton
            label="M"
            selected={gender === "male"}
            onClick={() => onGenderChange("male")}
          />
          <GenderButton
            label="F"
            selected={gender === "female"}
            onClick={() => onGenderChange("female")}
          />
        </div>
      ) : null}
    </div>
  );
}

function GenderButton({
  label,
  selected,
  onClick,
}: {
  label: string;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      className={[
        "rounded px-1.5 py-0.5 text-[10px] font-medium",
        selected
          ? "bg-sky-900/80 text-sky-200"
          : "text-zinc-500 hover:bg-zinc-800 hover:text-zinc-200",
      ].join(" ")}
      aria-pressed={selected}
      onClick={onClick}
    >
      {label}
    </button>
  );
}
