import fs from "node:fs";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const pals = JSON.parse(fs.readFileSync(path.join(root, "src", "data", "pals.json"), "utf8"));
const sourceDir = path.join(root, "vendor", "palarium", "assets", "pals");
const outDir = path.join(root, "public", "pals");

/** PalCalc uses PlantSlime_Flower; palarium only ships T_PlantSlime_icon_normal.webp. */
const iconInternalName = {
  PlantSlime_Flower: "PlantSlime",
};

if (!fs.existsSync(sourceDir)) {
  throw new Error(
    `Missing ${sourceDir}. Clone palarium first:\n` +
      "git clone --depth 1 --filter=blob:none --sparse https://github.com/djg2111/palarium.git vendor/palarium\n" +
      "git -C vendor/palarium sparse-checkout set assets/pals",
  );
}

fs.mkdirSync(outDir, { recursive: true });

const missing = [];
for (const pal of pals) {
  const internal = iconInternalName[pal.internalName] ?? pal.internalName;
  const source = path.join(sourceDir, `T_${internal}_icon_normal.webp`);
  if (!fs.existsSync(source)) {
    missing.push({ id: pal.id, name: pal.name, file: path.basename(source) });
    continue;
  }
  fs.copyFileSync(source, path.join(outDir, `${pal.id}.webp`));
}

if (missing.length > 0) {
  throw new Error(`Missing ${missing.length} pal icons: ${JSON.stringify(missing.slice(0, 8))}`);
}

console.log(`Copied ${pals.length} pal icons to public/pals`);
