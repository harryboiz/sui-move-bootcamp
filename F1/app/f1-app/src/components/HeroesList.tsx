import { useSuiClientQuery } from "@mysten/dapp-kit";
import { Box, Flex, Heading, Text, Link, Spinner } from "@radix-ui/themes";
import { HEROES_REGISTRY_ID, EXPLORER_URL } from "../constants";
import { HeroCard } from "./HeroCard";

interface HeroRegistryFields {
  ids: string[];
  counter: string;
}

interface HeroFields {
  id: { id: string };
  name: string;
  stamina: string;
  weapon?: {
    fields?: {
      id: { id: string };
      name: string;
      attack: string;
    };
  };
}

export function HeroesList() {
  // Fetch the HeroRegistry object
  const {
    data: registryData,
    isPending: registryPending,
    error: registryError,
  } = useSuiClientQuery(
    "getObject",
    {
      id: HEROES_REGISTRY_ID,
      options: {
        showContent: true,
      },
    },
    {
      enabled: !!HEROES_REGISTRY_ID,
    }
  );

  // Extract hero IDs from registry
  const heroIds: string[] =
    registryData?.data?.content?.dataType === "moveObject"
      ? ((registryData.data.content.fields as unknown as HeroRegistryFields)?.ids ?? [])
      : [];

  // Reverse to show latest heroes first
  const reversedHeroIds = [...heroIds].reverse();

  // Fetch all hero objects
  const {
    data: heroesData,
    isPending: heroesPending,
    error: heroesError,
  } = useSuiClientQuery(
    "multiGetObjects",
    {
      ids: reversedHeroIds,
      options: {
        showContent: true,
      },
    },
    {
      enabled: reversedHeroIds.length > 0,
    }
  );

  if (!HEROES_REGISTRY_ID) {
    return (
      <Box p="4">
        <Text color="red">
          Please set VITE_HEROES_REGISTRY_ID in your .env file
        </Text>
      </Box>
    );
  }

  if (registryError || heroesError) {
    return (
      <Box p="4">
        <Text color="red">
          Error: {registryError?.message || heroesError?.message}
        </Text>
      </Box>
    );
  }

  if (registryPending) {
    return (
      <Flex align="center" gap="2" p="4">
        <Spinner />
        <Text>Loading registry...</Text>
      </Flex>
    );
  }

  const counter =
    registryData?.data?.content?.dataType === "moveObject"
      ? (registryData.data.content.fields as unknown as HeroRegistryFields)?.counter
      : "0";

  return (
    <Box p="4">
      <Heading size="5" mb="3">
        🦸 Heroes Registry
      </Heading>
      <Text size="2" color="gray" mb="4">
        Total Heroes Minted: {counter}
      </Text>

      {heroesPending && reversedHeroIds.length > 0 && (
        <Flex align="center" gap="2" mb="3">
          <Spinner />
          <Text>Loading heroes...</Text>
        </Flex>
      )}

      {reversedHeroIds.length === 0 ? (
        <Text>No heroes have been created yet.</Text>
      ) : heroesData ? (
        <Flex direction="column" gap="2">
          {heroesData.map((hero) => {
            if (hero.data?.content?.dataType !== "moveObject") return null;
            const fields = hero.data.content.fields as unknown as HeroFields;
            return <HeroCard key={fields.id.id} fields={fields} />;
          })}
        </Flex>
      ) : (
        // Fallback: just show IDs as links
        <Flex direction="column" gap="2">
          {reversedHeroIds.map((id) => (
            <Box key={id}>
              <Link
                href={`${EXPLORER_URL}/object/${id}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                Hero: {id.slice(0, 8)}...{id.slice(-6)}
              </Link>
            </Box>
          ))}
        </Flex>
      )}
    </Box>
  );
}
