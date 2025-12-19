import { SuiParsedData } from "@mysten/sui/client";
import { ENV } from "../env";
import { suiClient } from "../suiClient";

interface HeroesRegistry {
  ids: string[];
  counter: number;
}
/**
 * Gets the Heroes ids in the Hero Registry.
 * We need to get the Hero Registry object, and return the contents of the ids vector, along with the counter field.
 */
export const getHeroesRegistry = async (): Promise<HeroesRegistry> => {
  const registryObject = await suiClient.getObject({
    id: ENV.HEROES_REGISTRY_ID,
    options: {
      showContent: true,
    },
  });

  const content = registryObject.data?.content as SuiParsedData | undefined;
  if (!content || content.dataType !== "moveObject") {
    return {
      ids: [],
      counter: 0,
    };
  }

  const fields = content.fields as {
    ids: string[];
    counter: string;
  };

  return {
    ids: fields.ids,
    counter: Number(fields.counter),
  };
};
