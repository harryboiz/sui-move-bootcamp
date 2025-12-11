import { SuiObjectResponse } from "@mysten/sui/client";

export interface Hero {
  id: string;
  health: string;
  stamina: string;
}

interface HeroContent {
  fields: {
    id: { id: string };
    health: string;
    stamina: string;
  };
}

/**
 * Parses the content of a hero object in a SuiObjectResponse.
 * Maps it to a Hero object.
 */
export const parseHeroContent = (objectResponse: SuiObjectResponse): Hero => {
  // Implement the function to parse the hero content
  const content = objectResponse.data?.content;
  if (!content) {
    throw new Error("Object content is missing");
  }

  if (content.dataType !== "moveObject") {
    throw new Error("Object is not a Move object");
  }

  const parsedContent = content as unknown as HeroContent;
  return {
    id: parsedContent.fields.id.id,
    health: parsedContent.fields.health,
    stamina: parsedContent.fields.stamina,
  };
};
