import fs from "node:fs";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const vendor = path.join(root, "vendor");
const outDir = path.join(root, "src", "data");

const db = JSON.parse(fs.readFileSync(path.join(vendor, "palcalc-db.json"), "utf8"));
const refPals = JSON.parse(fs.readFileSync(path.join(vendor, "pals-ref.json"), "utf8"));
const special = JSON.parse(fs.readFileSync(path.join(vendor, "special.json"), "utf8"));

function palId(pal) {
  return `${pal.Id.PalDexNo}.${pal.Id.IsVariant ? 1 : 0}`;
}

const pals = db.Pals.map((pal) => ({
  id: palId(pal),
  name: pal.Name,
  paldexNo: pal.Id.PalDexNo,
  isVariant: pal.Id.IsVariant,
  internalName: pal.InternalName,
  internalIndex: pal.InternalIndex,
  breedingPower: pal.BreedingPower,
  breedingPowerPriority: pal.BreedingPowerPriority ?? 0,
}));

// PalCalc v28 omits Paldex #204. Game files still have breeding rank 10;
// it is excluded from the generic child pool (unobtainable / no combo breeding).
pals.push({
  id: "204.0",
  name: "Astralym",
  paldexNo: 204,
  isVariant: false,
  internalName: "WorldTreeDragon",
  internalIndex: 309,
  breedingPower: 10,
  breedingPowerPriority: 1000,
});

pals.sort(
  (a, b) => a.paldexNo - b.paldexNo || Number(a.isVariant) - Number(b.isVariant),
);

const palsByName = new Map();
for (const pal of pals) {
  if (!palsByName.has(pal.name) || !pal.isVariant) {
    palsByName.set(pal.name, pal);
  }
}

function genderFromFlag(flag, slot) {
  if (!flag) return null;
  if (flag === "p1_female" && slot === "parent1") return "female";
  if (flag === "p1_male" && slot === "parent1") return "male";
  if (flag === "p2_female" && slot === "parent2") return "female";
  if (flag === "p2_male" && slot === "parent2") return "male";
  return null;
}

const uniqueCombos = [];
const missing = [];

for (const row of special) {
  const parent1Name = refPals[row.p1]?.name;
  const parent2Name = refPals[row.p2]?.name;
  const childName = refPals[row.child]?.name;
  const parent1 = parent1Name ? palsByName.get(parent1Name) : null;
  const parent2 = parent2Name ? palsByName.get(parent2Name) : null;
  const child = childName ? palsByName.get(childName) : null;

  if (!parent1 || !parent2 || !child) {
    missing.push({ parent1Name, parent2Name, childName });
    continue;
  }

  uniqueCombos.push({
    parent1Id: parent1.id,
    parent2Id: parent2.id,
    childId: child.id,
    parent1Gender: genderFromFlag(row.genders, "parent1"),
    parent2Gender: genderFromFlag(row.genders, "parent2"),
  });
}

if (missing.length > 0) {
  throw new Error(`Could not map ${missing.length} unique combos: ${JSON.stringify(missing.slice(0, 5))}`);
}

const uniqueChildIds = new Set(uniqueCombos.map((combo) => combo.childId));
// Same-species-only children: they keep a breeding rank but cannot win
// the generic "nearest Pal" search. Unique-recipe children are already out.
const selfOnlyChildIds = new Set([
  "12.1", // Gumoss (Flower)
  "137.1", // Blazamut Ryu
  "144.0", // Mimog
  "145.0", // Xenovader
  "146.0", // Xenogard
  "185.0", // Grizzbolt
  "186.0", // Lyleen
  "187.0", // Orserk
  "188.0", // Faleris
  "189.0", // Shadowbeak
  "190.0", // Selyne
  "191.0", // Bastigor
  "192.0", // Shaolong
  "193.0", // Silvance
  "194.0", // Dandilord
  "195.1", // Bellanoir Libero
  "196.0", // Xenolord
  "197.0", // Hartalis
  "198.0", // Paladius
  "199.0", // Necromus
  "200.0", // Frostallion
  "201.0", // Neptilius
  "202.0", // Jetragon
  "203.0", // Panthalus
  "204.0", // Astralym
  "10002.0", // Green Slime
  "10009.0", // Cave Bat
]);
const unbreedableIds = new Set(["204.0"]);
for (const pal of pals) {
  pal.inGenericPool =
    !uniqueChildIds.has(pal.id) && !selfOnlyChildIds.has(pal.id);
  pal.breedable = !unbreedableIds.has(pal.id);
}

const meta = {
  palCount: pals.length,
  uniqueComboCount: uniqueCombos.length,
  gameVersion: "1.0",
  palcalcVersion: db.Version,
  source:
    "PalCalc db.json (MIT) + unique combo table from palworldcalc.com/data/special.json + Astralym (#204) from Palworld 1.0 Paldex",
};

fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(path.join(outDir, "pals.json"), `${JSON.stringify(pals, null, 2)}\n`);
fs.writeFileSync(path.join(outDir, "unique-combos.json"), `${JSON.stringify(uniqueCombos, null, 2)}\n`);
fs.writeFileSync(path.join(outDir, "meta.json"), `${JSON.stringify(meta, null, 2)}\n`);

console.log(
  `Wrote ${pals.length} pals and ${uniqueCombos.length} unique combos (PalCalc ${db.Version}).`,
);
