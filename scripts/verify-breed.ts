import {
  areOppositeGenders,
  getChild,
  oppositeGender,
} from "../src/lib/breed";
import { pals, palsById, uniqueCombos } from "../src/lib/pals";
import type { Pal, PalGender, UniqueCombo } from "../src/lib/types";

const failures: string[] = [];

function fail(message: string) {
  failures.push(message);
}

function pal(id: string) {
  const found = palsById.get(id);
  if (!found) throw new Error(`Missing pal ${id}`);
  return found;
}

function gendersFor(combo: UniqueCombo): [PalGender, PalGender] {
  const gender1 = combo.parent1Gender ?? "male";
  const gender2 = combo.parent2Gender ?? oppositeGender(gender1);
  if (gender1 === gender2) {
    throw new Error(
      `Unique combo ${combo.parent1Id} × ${combo.parent2Id} cannot use opposite genders`,
    );
  }
  return [gender1, gender2];
}

function genericChild(parent1: Pal, parent2: Pal) {
  const targetPower = Math.floor(
    (parent1.breedingPower + parent2.breedingPower + 1) / 2,
  );
  const pool = pals.filter((candidate) => candidate.inGenericPool);
  let best = pool[0];
  for (const candidate of pool) {
    const candidateGap = Math.abs(candidate.breedingPower - targetPower);
    const bestGap = Math.abs(best.breedingPower - targetPower);
    if (candidateGap < bestGap) best = candidate;
    else if (candidateGap === bestGap) {
      if (candidate.breedingPowerPriority > best.breedingPowerPriority) {
        best = candidate;
      } else if (
        candidate.breedingPowerPriority === best.breedingPowerPriority &&
        !candidate.isVariant &&
        best.isVariant
      ) {
        best = candidate;
      }
    }
  }
  return best;
}

function expectChild(
  label: string,
  parent1: Pal,
  parent2: Pal,
  gender1: PalGender,
  gender2: PalGender,
  expectedId: string | null,
) {
  const child = getChild(parent1, parent2, gender1, gender2);
  const actualId = child?.id ?? null;
  if (actualId !== expectedId) {
    fail(
      `${label}: expected ${expectedId}, got ${actualId} (${parent1.name} ${gender1} × ${parent2.name} ${gender2})`,
    );
  }
}

if (uniqueCombos.length !== 136) {
  fail(`Expected 136 unique combos, found ${uniqueCombos.length}`);
}

let uniqueHits = 0;
let uniqueBeatsGeneric = 0;

for (const combo of uniqueCombos) {
  const parent1 = pal(combo.parent1Id);
  const parent2 = pal(combo.parent2Id);
  const expected = pal(combo.childId);
  const [gender1, gender2] = gendersFor(combo);

  expectChild(
    `unique ${parent1.name} × ${parent2.name}`,
    parent1,
    parent2,
    gender1,
    gender2,
    expected.id,
  );
  expectChild(
    `unique swapped ${parent2.name} × ${parent1.name}`,
    parent2,
    parent1,
    gender2,
    gender1,
    expected.id,
  );
  uniqueHits += 1;

  const averaged = genericChild(parent1, parent2);
  if (averaged.id !== expected.id) uniqueBeatsGeneric += 1;
}

expectChild("same species", pal("1.0"), pal("1.0"), "male", "female", "1.0");
expectChild("Lamball × Cattiva", pal("1.0"), pal("2.0"), "male", "female", "22.0");
expectChild("Fuack × Flambelle", pal("5.0"), pal("25.0"), "male", "female", "5.1");
expectChild(
  "Wixen female × Katress male",
  pal("78.0"),
  pal("79.0"),
  "female",
  "male",
  "78.1",
);
expectChild(
  "Katress female × Wixen male",
  pal("79.0"),
  pal("78.0"),
  "female",
  "male",
  "79.1",
);
expectChild(
  "same gender",
  pal("1.0"),
  pal("2.0"),
  "male",
  "male",
  null,
);

if (!areOppositeGenders("male", "female") || areOppositeGenders("male", "male")) {
  fail("areOppositeGenders is wrong");
}

if (failures.length > 0) {
  console.error(`Failed ${failures.length} check(s):`);
  for (const failure of failures.slice(0, 40)) console.error(`- ${failure}`);
  process.exit(1);
}

console.log(
  `Passed: ${uniqueHits} unique recipes (forward + swapped), ${uniqueBeatsGeneric} of those differ from the breeding-power average, plus same-species, generic, gender-lock, and same-gender checks.`,
);
