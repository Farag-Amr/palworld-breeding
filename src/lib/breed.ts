import { pals, palsById, uniqueCombos } from "@/lib/pals";
import type { Pal, PalGender, ParentPair, UniqueCombo } from "@/lib/types";

const genericPool = pals.filter((pal) => pal.inGenericPool);

export function oppositeGender(gender: PalGender): PalGender {
  return gender === "male" ? "female" : "male";
}

export function areOppositeGenders(gender1: PalGender, gender2: PalGender) {
  return gender1 !== gender2;
}

function genderMatches(actual: PalGender, required: PalGender | null) {
  return required == null || actual === required;
}

function findUniqueCombo(
  parent1: Pal,
  parent2: Pal,
  gender1: PalGender,
  gender2: PalGender,
): UniqueCombo | null {
  for (const combo of uniqueCombos) {
    const forward =
      parent1.id === combo.parent1Id &&
      parent2.id === combo.parent2Id &&
      genderMatches(gender1, combo.parent1Gender) &&
      genderMatches(gender2, combo.parent2Gender);
    const reverse =
      parent1.id === combo.parent2Id &&
      parent2.id === combo.parent1Id &&
      genderMatches(gender1, combo.parent2Gender) &&
      genderMatches(gender2, combo.parent1Gender);
    if (forward || reverse) return combo;
  }
  return null;
}

function closerGeneric(candidate: Pal, current: Pal, targetPower: number) {
  const candidateGap = Math.abs(candidate.breedingPower - targetPower);
  const currentGap = Math.abs(current.breedingPower - targetPower);
  if (candidateGap !== currentGap) return candidateGap < currentGap;
  if (candidate.breedingPowerPriority !== current.breedingPowerPriority) {
    return candidate.breedingPowerPriority > current.breedingPowerPriority;
  }
  if (candidate.isVariant !== current.isVariant) return !candidate.isVariant;
  return false;
}

function genericChild(parent1: Pal, parent2: Pal) {
  const targetPower = Math.floor(
    (parent1.breedingPower + parent2.breedingPower + 1) / 2,
  );
  let best = genericPool[0];
  for (const pal of genericPool) {
    if (closerGeneric(pal, best, targetPower)) best = pal;
  }
  return best;
}

export function getChild(
  parent1: Pal,
  parent2: Pal,
  gender1: PalGender,
  gender2: PalGender,
): Pal | null {
  if (!areOppositeGenders(gender1, gender2)) return null;

  if (parent1.id === parent2.id) return parent1;

  const unique = findUniqueCombo(parent1, parent2, gender1, gender2);
  if (unique) {
    const child = palsById.get(unique.childId);
    if (!child) {
      throw new Error(`Unique combo child ${unique.childId} is missing`);
    }
    return child;
  }

  return genericChild(parent1, parent2);
}

let parentPairsByChildId: Map<string, ParentPair[]> | null = null;

function addPair(
  pairsByChildId: Map<string, ParentPair[]>,
  childId: string,
  pair: ParentPair,
) {
  const pairs = pairsByChildId.get(childId);
  if (pairs) pairs.push(pair);
  else pairsByChildId.set(childId, [pair]);
}

function buildParentPairsByChildId() {
  const pairsByChildId = new Map<string, ParentPair[]>();

  for (let i = 0; i < pals.length; i++) {
    for (let j = i; j < pals.length; j++) {
      const parent1 = pals[i];
      const parent2 = pals[j];
      const maleFemale = getChild(parent1, parent2, "male", "female");
      const femaleMale = getChild(parent1, parent2, "female", "male");

      if (maleFemale && femaleMale && maleFemale.id === femaleMale.id) {
        addPair(pairsByChildId, maleFemale.id, {
          parent1,
          parent2,
          parent1Gender: null,
          parent2Gender: null,
        });
        continue;
      }

      if (maleFemale) {
        addPair(pairsByChildId, maleFemale.id, {
          parent1,
          parent2,
          parent1Gender: "male",
          parent2Gender: "female",
        });
      }

      if (femaleMale) {
        addPair(pairsByChildId, femaleMale.id, {
          parent1,
          parent2,
          parent1Gender: "female",
          parent2Gender: "male",
        });
      }
    }
  }

  return pairsByChildId;
}

export function getParentPairs(child: Pal): ParentPair[] {
  if (!parentPairsByChildId) {
    parentPairsByChildId = buildParentPairsByChildId();
  }
  return parentPairsByChildId.get(child.id) ?? [];
}
