import metaJson from "@/data/meta.json";
import palsJson from "@/data/pals.json";
import uniqueCombosJson from "@/data/unique-combos.json";
import type { DataMeta, Pal, UniqueCombo } from "@/lib/types";

export const pals = palsJson as Pal[];
export const uniqueCombos = uniqueCombosJson as UniqueCombo[];
export const dataMeta = metaJson as DataMeta;

export const palsById = new Map(pals.map((pal) => [pal.id, pal]));
