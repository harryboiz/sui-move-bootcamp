import { SuiParsedData } from "@mysten/sui/client";
import { suiClient } from "../suiClient";

/**
 * Gets the object id of a Weapon that is attached to a Hero object by the hero's object id.
 * We need to get the Hero object, and find the value of the corresponding nested field.
 */
export const getWeaponIdOfHero = async (
  heroId: string
): Promise<string | undefined> => {
  const heroObject = await suiClient.getObject({
    id: heroId,
    options: {
      showContent: true,
    },
  });

  const content = heroObject.data?.content as SuiParsedData | undefined;
  if (!content || content.dataType !== "moveObject") {
    return undefined;
  }

  const fields = content.fields as {
    weapon?: { fields?: { id: { id: string } } };
  };

  return fields.weapon?.fields?.id?.id;
};
