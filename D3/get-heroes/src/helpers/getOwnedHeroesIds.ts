import { SuiObjectResponse } from "@mysten/sui/client";
import { ENV } from "../env";
import { suiClient } from "../suiClient";

/**
 * Gets all of the Hero NFTs owned by the given address.
 * Returns an array of their Object Ids.
 */
export const getOwnedHeroesIds = async (owner: string) => {
  // TODO: Implement this function

  let allObjects: SuiObjectResponse[] = [];
  let cursor: string | undefined | null = undefined;

  while (true) {
    const response = await suiClient.getOwnedObjects({
      owner,
      filter: {
        StructType: `${ENV.PACKAGE_ID}::hero::Hero`,
      },
      options: {
        showType: true,
      },
      cursor,
    });

    allObjects = allObjects.concat(response.data);

    if (response.hasNextPage) {
      cursor = response.nextCursor;
    } else {
      break;
    }
  }

  return allObjects.map((obj) => obj.data?.objectId);
};
