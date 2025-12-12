import { SuiObjectChange } from "@mysten/sui/client";

interface Args {
  objectChanges: SuiObjectChange[];
}

interface Response {
  swordsIds: string[];
  heroesIds: string[];
}

/**
 * Parses the provided SuiObjectChange[].
 * Extracts the IDs of the created Heroes and Swords NFTs, filtering by objectType.
 */
export const parseCreatedObjectsIds = ({ objectChanges }: Args): Response => {
  // TODO: Implement this function

  const swordsIds: string[] = [];
  const heroesIds: string[] = [];

  for (const objectChange of objectChanges) {
    if (objectChange.type === "created") {
      const objectType = objectChange.objectType;
      const objectId = objectChange.objectId;

      if (objectType === "0x2eb076d9f07929c0db89564dbd2ea8fd08bb2cf8807dc4567c2f464e9cf8823e::hero::Hero") {
        heroesIds.push(objectId);
      }

      if (objectType === "0x2eb076d9f07929c0db89564dbd2ea8fd08bb2cf8807dc4567c2f464e9cf8823e::blacksmith::Sword") {
        swordsIds.push(objectId);
      }
    }
  }

  return {
    swordsIds,
    heroesIds,
  };
};
