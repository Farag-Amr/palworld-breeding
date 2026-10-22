export type PalId = string;
export type PalGender = "male" | "female";

export type Pal = {
  id: PalId;
  name: string;
  paldexNo: number;
  isVariant: boolean;
  internalName: string;
  internalIndex: number;
  breedingPower: number;
  breedingPowerPriority: number;
  inGenericPool: boolean;
  breedable: boolean;
};

export type UniqueCombo = {
  parent1Id: PalId;
  parent2Id: PalId;
  childId: PalId;
  parent1Gender: PalGender | null;
  parent2Gender: PalGender | null;
};

export type ParentPair = {
  parent1: Pal;
  parent2: Pal;
  parent1Gender: PalGender | null;
  parent2Gender: PalGender | null;
};

export type ParentCombination = ParentPair & {
  child: Pal;
};

export type DataMeta = {
  palCount: number;
  uniqueComboCount: number;
  gameVersion: string;
  palcalcVersion: string;
  source: string;
};
