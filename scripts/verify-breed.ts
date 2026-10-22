import {
  areOppositeGenders,
  getChild,
  getParentCombinations,
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

if (pals.length !== 300) {
  fail(`Expected 300 pals, found ${pals.length}`);
}

const astralym = pal("204.0");
if (astralym.name !== "Astralym" || astralym.inGenericPool || astralym.breedable) {
  fail(
    "Astralym (#204) should exist, stay out of the generic pool, and not be breedable",
  );
}
expectChild(
  "Astralym × Astralym",
  astralym,
  astralym,
  "male",
  "female",
  null,
);
expectChild(
  "Astralym × Lamball",
  astralym,
  pal("1.0"),
  "male",
  "female",
  null,
);
if (getParentPairs(astralym).length > 0) {
  fail("Astralym should have no reverse parent pairs");
}
if (getParentCombinations(astralym).length > 0) {
  fail("Astralym should have no parent combinations");
}

const selfOnlyIds = [
  "12.1",
  "137.1",
  "144.0",
  "145.0",
  "146.0",
  "185.0",
  "186.0",
  "187.0",
  "188.0",
  "189.0",
  "190.0",
  "191.0",
  "192.0",
  "193.0",
  "194.0",
  "195.1",
  "196.0",
  "197.0",
  "198.0",
  "199.0",
  "200.0",
  "201.0",
  "202.0",
  "203.0",
  "204.0",
  "10002.0",
  "10009.0",
];
for (const id of selfOnlyIds) {
  if (pal(id).inGenericPool) {
    fail(`${pal(id).name} (${id}) can only breed with itself and must stay out of the generic pool`);
  }
}
if (!pal("12.0").inGenericPool) {
  fail("Base Gumoss should stay in the generic pool");
}

expectChild(
  "Frostallion × Jetragon",
  pal("200.0"),
  pal("202.0"),
  "male",
  "female",
  "184.0",
);
expectChild(
  "same-species Frostallion",
  pal("200.0"),
  pal("200.0"),
  "male",
  "female",
  "200.0",
);

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
  if (!child.breedable) {
    if (pairs.length > 0) {
      fail(`${child.name}: unbreedable Pal should have no reverse parent pairs`);
    }
    continue;
  }
  if (!sameSpecies) {
    fail(`${child.name}: missing same-species parent pair`);
  } else if (sameSpecies.parent1Gender || sameSpecies.parent2Gender) {
    fail(`${child.name}: same-species pair should not lock gender`);
  }

  for (const pair of pairs) {
    if (!pair.parent1.breedable || !pair.parent2.breedable) {
      fail(
        `${child.name}: reverse pair includes unbreedable Pal (${pair.parent1.name} × ${pair.parent2.name})`,
      );
    }
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

let combinationCount = 0;
for (const parent of pals) {
  const combinations = getParentCombinations(parent);
  combinationCount += combinations.length;

  if (!parent.breedable) {
    if (combinations.length > 0) {
      fail(`${parent.name}: unbreedable Pal should have no parent combinations`);
    }
    continue;
  }

  const sameSpecies = combinations.find(
    (combo) =>
      combo.parent1.id === parent.id &&
      combo.parent2.id === parent.id &&
      combo.child.id === parent.id,
  );
  if (!sameSpecies) {
    fail(`${parent.name}: missing same-species combination`);
  }

  for (const combo of combinations) {
    if (combo.parent1.id !== parent.id) {
      fail(
        `${parent.name}: combination does not keep selected parent on the left (${combo.parent1.name} × ${combo.parent2.name})`,
      );
    }
    if (combo.parent1Gender == null && combo.parent2Gender == null) {
      expectChild(
        `combo ${parent.name}`,
        combo.parent1,
        combo.parent2,
        "male",
        "female",
        combo.child.id,
      );
      expectChild(
        `combo swapped genders ${parent.name}`,
        combo.parent1,
        combo.parent2,
        "female",
        "male",
        combo.child.id,
      );
    } else if (combo.parent1Gender && combo.parent2Gender) {
      expectChild(
        `combo gender-locked ${parent.name}`,
        combo.parent1,
        combo.parent2,
        combo.parent1Gender,
        combo.parent2Gender,
        combo.child.id,
      );
    } else {
      fail(
        `${parent.name}: combination ${combo.parent1.name} × ${combo.parent2.name} has incomplete genders`,
      );
    }
  }
}

const lamballCombos = getParentCombinations(pal("1.0"));
if (
  !lamballCombos.some(
    (combo) =>
      combo.parent2.id === "2.0" && combo.child.id === "22.0",
  )
) {
  fail("Lamball combinations: missing Cattiva → Daedream");
}

const fuackCombos = getParentCombinations(pal("5.0"));
if (
  !fuackCombos.some(
    (combo) =>
      combo.parent2.id === "25.0" && combo.child.id === "5.1",
  )
) {
  fail("Fuack combinations: missing Flambelle → Fuack Ignis");
}

const wixenCombos = getParentCombinations(pal("78.0"));
if (
  !wixenCombos.some(
    (combo) =>
      combo.parent2.id === "79.0" &&
      combo.parent1Gender === "female" &&
      combo.parent2Gender === "male" &&
      combo.child.id === "78.1",
  )
) {
  fail("Wixen combinations: missing Katress M → Wixen Noct");
}

if (failures.length > 0) {
  console.error(`Failed ${failures.length} check(s):`);
  for (const failure of failures.slice(0, 40)) console.error(`- ${failure}`);
  process.exit(1);
}

console.log(
  `Passed: ${uniqueHits} unique recipes (forward + swapped), ${uniqueBeatsGeneric} of those differ from the breeding-power average, ${reversePairCount} reverse parent pairs, ${combinationCount} parent combinations, plus same-species, generic, gender-lock, and same-gender checks.`,
);
