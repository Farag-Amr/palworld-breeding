export type PalId = string;

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
};

export type UniqueCombo = {
  parent1Id: PalId;
  parent2Id: PalId;
  childId: PalId;
  parent1Gender: "male" | "female" | null;
  parent2Gender: "male" | "female" | null;
};

export type DataMeta = {
  palCount: number;
  uniqueComboCount: number;
  gameVersion: string;
  palcalcVersion: string;
  source: string;
};
