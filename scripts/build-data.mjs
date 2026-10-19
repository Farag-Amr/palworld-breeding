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
})).sort((a, b) => a.paldexNo - b.paldexNo || Number(a.isVariant) - Number(b.isVariant));

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
for (const pal of pals) {
  pal.inGenericPool = !uniqueChildIds.has(pal.id);
}

const meta = {
  palCount: pals.length,
  uniqueComboCount: uniqueCombos.length,
  palcalcVersion: db.Version,
  source: "PalCalc db.json (MIT) + unique combo table from palworldcalc.com/data/special.json",
};

fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(path.join(outDir, "pals.json"), `${JSON.stringify(pals, null, 2)}\n`);
fs.writeFileSync(path.join(outDir, "unique-combos.json"), `${JSON.stringify(uniqueCombos, null, 2)}\n`);
fs.writeFileSync(path.join(outDir, "meta.json"), `${JSON.stringify(meta, null, 2)}\n`);

console.log(
  `Wrote ${pals.length} pals and ${uniqueCombos.length} unique combos (PalCalc ${db.Version}).`,
);
