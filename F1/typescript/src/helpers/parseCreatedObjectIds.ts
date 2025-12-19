import { SuiObjectChange, SuiObjectChangeCreated } from "@mysten/sui/client";
import { ENV } from "../env";

interface Args {
  objectChanges: SuiObjectChange[];
}

interface Response {
  heroesIds: string[];
}

/**
 * Parses the provided SuiObjectChange[].
 * Extracts the IDs of the created Heroes and Weapons NFTs, filtering by objectType.
 */
export const parseCreatedObjectsIds = ({ objectChanges }: Args): Response => {
  const createdObjects = objectChanges.filter(
    (change): change is SuiObjectChangeCreated => change.type === "created"
  );

  const heroesIds = createdObjects
    .filter((change) => change.objectType === `${ENV.PACKAGE_ID}::hero::Hero`)
    .map((change) => change.objectId);

  return {
    heroesIds,
  };
};
