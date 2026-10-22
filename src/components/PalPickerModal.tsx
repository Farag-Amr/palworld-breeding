"use client";

import { PalIcon } from "@/components/PalIcon";
import { paldexLabel } from "@/lib/format";
import type { Pal } from "@/lib/types";
import { useEffect } from "react";

export function PalPickerModal({
  pals,
  selectedId,
  onPick,
  onClose,
}: {
  pals: Pal[];
  selectedId: string | null;
  onPick: (pal: Pal) => void;
  onClose: () => void;
}) {
  useEffect(() => {
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }

    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <button
        type="button"
        className="absolute inset-0 bg-black/70"
        aria-label="Close pal picker"
        onClick={onClose}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="pal-picker-title"
        className="relative z-10 flex max-h-[80vh] w-full max-w-3xl flex-col rounded-2xl border border-zinc-700 bg-zinc-900 shadow-2xl"
      >
        <div className="flex items-center justify-between border-b border-zinc-800 px-4 py-3">
          <h3 id="pal-picker-title" className="text-sm font-semibold text-sky-200">
            Pick a Pal
          </h3>
          <button
            type="button"
            className="rounded px-2 py-1 text-xs text-zinc-400 hover:bg-zinc-800 hover:text-zinc-100"
            onClick={onClose}
          >
            Close
          </button>
        </div>
        <div className="overflow-y-auto p-4">
          <ul className="grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-5">
            {pals.map((pal) => {
              const selected = pal.id === selectedId;
              return (
                <li key={pal.id}>
                  <button
                    type="button"
                    onClick={() => onPick(pal)}
                    className={[
                      "flex h-full w-full flex-col items-center gap-1 rounded-xl border px-2 py-2 text-center hover:border-sky-600 hover:bg-zinc-800/80",
                      selected
                        ? "border-sky-500 bg-sky-950/40"
                        : "border-zinc-800 bg-zinc-950/50",
                    ].join(" ")}
                  >
                    <span className="font-mono text-[10px] text-zinc-500">
                      {paldexLabel(pal)}
                    </span>
                    <PalIcon pal={pal} size={48} />
                    <span className="w-full truncate text-xs text-zinc-100">
                      {pal.name}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </div>
  );
}
