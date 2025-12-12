import { suiClient } from "../suiClient";

/**
 * Gets the dynamic object fields attached to a hero object by the object's id.
 * For the scope of this exercise, we ignore pagination, and just fetch the first page.
 * Filters the objects and returns the object ids of the swords.
 */
export const getHeroSwordIds = async (id: string): Promise<string[]> => {
  // Get the dynamic object field for "sword" - the field name used in the Move contract
  const dof = await suiClient.getDynamicFieldObject({
    parentId: id,
    name: {
      type: "0x1::string::String",
      value: "sword",
    },
  });

  if (dof.data?.objectId) {
    return [dof.data.objectId];
  }

  return [];
};
