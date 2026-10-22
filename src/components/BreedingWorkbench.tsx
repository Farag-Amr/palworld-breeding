"use client";

import { PalPickerModal } from "@/components/PalPickerModal";
import { PalSlot } from "@/components/PalSlot";
import { PaldexList } from "@/components/PaldexList";
import { ParentPairList } from "@/components/ParentPairList";
import {
  areOppositeGenders,
  getChild,
  getParentCombinations,
  getParentPairs,
} from "@/lib/breed";
import type { Pal, PalGender } from "@/lib/types";
import { useMemo, useState } from "react";

export function BreedingWorkbench({ pals }: { pals: Pal[] }) {
  const [parent1, setParent1] = useState<Pal | null>(null);
  const [parent2, setParent2] = useState<Pal | null>(null);
  const [gender1, setGender1] = useState<PalGender>("male");
  const [gender2, setGender2] = useState<PalGender>("female");
  const [activeSlot, setActiveSlot] = useState<1 | 2>(1);
  const [desiredChild, setDesiredChild] = useState<Pal | null>(null);
  const [comboParent, setComboParent] = useState<Pal | null>(null);
  const [pickerFor, setPickerFor] = useState<"desiredChild" | "comboParent" | null>(
    null,
  );

  const oppositeGenders = areOppositeGenders(gender1, gender2);
  const child =
    parent1 && parent2 && oppositeGenders
      ? getChild(parent1, parent2, gender1, gender2)
      : null;
  const parentPairs = useMemo(
    () => (desiredChild ? getParentPairs(desiredChild) : []),
    [desiredChild],
  );
  const parentCombinations = useMemo(
    () => (comboParent ? getParentCombinations(comboParent) : []),
    [comboParent],
  );

  function pickPal(pal: Pal) {
    if (activeSlot === 1) {
      setParent1(pal);
      if (!parent2) setActiveSlot(2);
    } else {
      setParent2(pal);
    }
  }

  function clearSlot(slot: 1 | 2) {
    if (slot === 1) setParent1(null);
    else setParent2(null);
    setActiveSlot(slot);
  }

  return (
    <div className="flex flex-col gap-10">
      <section className="flex flex-col gap-3">
        <div>
          <h2 className="text-sm font-semibold text-sky-200">
            Two-parent calculator
          </h2>
          <p className="mt-1 text-sm text-zinc-500">
            Pick any two Pals from the list and see what they breed.
          </p>
        </div>
        <div className="grid grid-cols-2 items-stretch gap-3 sm:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_auto_minmax(0,1fr)]">
          <PalSlot
            label="Parent 1"
            pal={parent1}
            emptyHint="Click a Pal below"
            interactive
            active={activeSlot === 1}
            showPlusWhenEmpty
            onSelect={() => setActiveSlot(1)}
            onClear={() => clearSlot(1)}
            gender={gender1}
            onGenderChange={setGender1}
          />
          <PalSlot
            label="Parent 2"
            pal={parent2}
            emptyHint="Click a Pal below"
            interactive
            active={activeSlot === 2}
            showPlusWhenEmpty
            onSelect={() => setActiveSlot(2)}
            onClear={() => clearSlot(2)}
            gender={gender2}
            onGenderChange={setGender2}
          />
          <p
            className="flex items-center justify-center text-2xl font-light text-zinc-500 sm:px-1"
            aria-hidden
          >
            =
          </p>
          <PalSlot label="Child" pal={child} emptyHint="" />
        </div>
        {parent1 && parent2 && !oppositeGenders ? (
          <p className="text-sm text-red-400" role="alert">
            Parents cannot be the same gender.
          </p>
        ) : null}
      </section>

      <PaldexList
        pals={pals}
        parent1Id={parent1?.id ?? null}
        parent2Id={parent2?.id ?? null}
        onPick={pickPal}
      />

      <section className="flex flex-col gap-3">
        <div>
          <h2 className="text-sm font-semibold text-sky-200">Parent finder</h2>
          <p className="mt-1 text-sm text-zinc-500">
            Select desired pal and find all parent combinations that produce it.
          </p>
        </div>
        <div className="grid grid-cols-2 items-stretch gap-3 sm:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_auto_minmax(0,1fr)]">
          <PalSlot
            label="Desired child"
            pal={desiredChild}
            emptyHint=""
            interactive
            active={pickerFor === "desiredChild"}
            showPlusWhenEmpty
            onSelect={() => setPickerFor("desiredChild")}
            onClear={() => setDesiredChild(null)}
          />
        </div>
        {desiredChild ? <ParentPairList pairs={parentPairs} /> : null}
      </section>

      <section className="flex flex-col gap-3">
        <div>
          <h2 className="text-sm font-semibold text-sky-200">
            Parent combinations
          </h2>
          <p className="mt-1 text-sm text-zinc-500">
            Select a parent and find every breeding combination it is involved
            in.
          </p>
        </div>
        <div className="grid grid-cols-2 items-stretch gap-3 sm:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_auto_minmax(0,1fr)]">
          <PalSlot
            label="Parent"
            pal={comboParent}
            emptyHint=""
            interactive
            active={pickerFor === "comboParent"}
            showPlusWhenEmpty
            onSelect={() => setPickerFor("comboParent")}
            onClear={() => setComboParent(null)}
          />
        </div>
        {comboParent ? (
          <ParentPairList pairs={parentCombinations} showChild />
        ) : null}
      </section>

      {pickerFor ? (
        <PalPickerModal
          pals={pals}
          selectedId={
            pickerFor === "desiredChild"
              ? (desiredChild?.id ?? null)
              : (comboParent?.id ?? null)
          }
          onPick={(pal) => {
            if (pickerFor === "desiredChild") setDesiredChild(pal);
            else setComboParent(pal);
            setPickerFor(null);
          }}
          onClose={() => setPickerFor(null)}
        />
      ) : null}
    </div>
  );
}
