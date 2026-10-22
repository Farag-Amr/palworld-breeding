import {
  areOppositeGenders,
  getChild,
  getParentPairs,
  oppositeGender,
} from "../src/lib/breed";
import { pals, palsById, uniqueCombos } from "../src/lib/pals";
import type { Pal, PalGender, ParentPair, UniqueCombo } from "../src/lib/types";

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

function pairHasParents(pair: ParentPair, parent1: Pal, parent2: Pal) {
  return (
    (pair.parent1.id === parent1.id && pair.parent2.id === parent2.id) ||
    (pair.parent1.id === parent2.id && pair.parent2.id === parent1.id)
  );
}

function pairHasGenders(
  pair: ParentPair,
  parent1: Pal,
  parent2: Pal,
  gender1: PalGender,
  gender2: PalGender,
) {
  if (pair.parent1.id === parent1.id && pair.parent2.id === parent2.id) {
    return pair.parent1Gender === gender1 && pair.parent2Gender === gender2;
  }
  if (pair.parent1.id === parent2.id && pair.parent2.id === parent1.id) {
    return pair.parent1Gender === gender2 && pair.parent2Gender === gender1;
  }
  return false;
}

let reversePairCount = 0;

for (const child of pals) {
  const pairs = getParentPairs(child);
  reversePairCount += pairs.length;

  const sameSpecies = pairs.find(
    (pair) => pair.parent1.id === child.id && pair.parent2.id === child.id,
  );
  if (!sameSpecies) {
    fail(`${child.name}: missing same-species parent pair`);
  } else if (sameSpecies.parent1Gender || sameSpecies.parent2Gender) {
    fail(`${child.name}: same-species pair should not lock gender`);
  }

  for (const pair of pairs) {
    if (pair.parent1Gender == null && pair.parent2Gender == null) {
      expectChild(
        `reverse ${child.name}`,
        pair.parent1,
        pair.parent2,
        "male",
        "female",
        child.id,
      );
      expectChild(
        `reverse swapped genders ${child.name}`,
        pair.parent1,
        pair.parent2,
        "female",
        "male",
        child.id,
      );
    } else if (pair.parent1Gender && pair.parent2Gender) {
      expectChild(
        `reverse gender-locked ${child.name}`,
        pair.parent1,
        pair.parent2,
        pair.parent1Gender,
        pair.parent2Gender,
        child.id,
      );
    } else {
      fail(
        `${child.name}: pair ${pair.parent1.name} × ${pair.parent2.name} has incomplete genders`,
      );
    }
  }
}

for (const combo of uniqueCombos) {
  const parent1 = pal(combo.parent1Id);
  const parent2 = pal(combo.parent2Id);
  const child = pal(combo.childId);
  const pairs = getParentPairs(child);
  if (!pairs.some((pair) => pairHasParents(pair, parent1, parent2))) {
    fail(
      `${child.name}: unique recipe ${parent1.name} × ${parent2.name} missing from reverse lookup`,
    );
  }
}

const daedreamPairs = getParentPairs(pal("22.0"));
if (!daedreamPairs.some((pair) => pairHasParents(pair, pal("1.0"), pal("2.0")))) {
  fail("Daedream: Lamball × Cattiva missing from reverse lookup");
}

const fuackIgnisPairs = getParentPairs(pal("5.1"));
if (
  !fuackIgnisPairs.some((pair) => pairHasParents(pair, pal("5.0"), pal("25.0")))
) {
  fail("Fuack Ignis: Fuack × Flambelle missing from reverse lookup");
}

const wixenNoctPairs = getParentPairs(pal("78.1"));
if (
  !wixenNoctPairs.some((pair) =>
    pairHasGenders(pair, pal("78.0"), pal("79.0"), "female", "male"),
  )
) {
  fail("Wixen Noct: missing Wixen female × Katress male");
}
if (
  wixenNoctPairs.some((pair) =>
    pairHasGenders(pair, pal("78.0"), pal("79.0"), "male", "female"),
  )
) {
  fail("Wixen Noct: should not list Wixen male × Katress female");
}

const katressIgnisPairs = getParentPairs(pal("79.1"));
if (
  !katressIgnisPairs.some((pair) =>
    pairHasGenders(pair, pal("79.0"), pal("78.0"), "female", "male"),
  )
) {
  fail("Katress Ignis: missing Katress female × Wixen male");
}

if (failures.length > 0) {
  console.error(`Failed ${failures.length} check(s):`);
  for (const failure of failures.slice(0, 40)) console.error(`- ${failure}`);
  process.exit(1);
}

console.log(
  `Passed: ${uniqueHits} unique recipes (forward + swapped), ${uniqueBeatsGeneric} of those differ from the breeding-power average, ${reversePairCount} reverse parent pairs, plus same-species, generic, gender-lock, and same-gender checks.`,
);
