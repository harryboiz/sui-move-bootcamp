import { useCurrentAccount, useSuiClientQuery } from "@mysten/dapp-kit";
import { Flex, Heading, Text, Spinner, Box } from "@radix-ui/themes";
import { PACKAGE_ID } from "./constants";
import { HeroCard } from "./components/HeroCard";

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

export function OwnedObjects() {
  const account = useCurrentAccount();
  const { data, isPending, error } = useSuiClientQuery(
    "getOwnedObjects",
    {
      owner: account?.address as string,
      filter: {
        StructType: `${PACKAGE_ID}::hero::Hero`,
      },
      options: {
        showContent: true,
      },
    },
    {
      enabled: !!account && !!PACKAGE_ID,
    }
  );

  if (!account) {
    return null;
  }

  if (!PACKAGE_ID) {
    return (
      <Box p="4">
        <Text color="red">
          Please set VITE_PACKAGE_ID in your .env file
        </Text>
      </Box>
    );
  }

  if (error) {
    return <Flex>Error: {error.message}</Flex>;
  }

  if (isPending || !data) {
    return (
      <Flex align="center" gap="2" p="4">
        <Spinner />
        <Text>Loading your heroes...</Text>
      </Flex>
    );
  }

  return (
    <Flex direction="column" my="2" p="4">
      <Heading size="5" mb="3">
        🎖️ My Heroes
      </Heading>
      {data.data.length === 0 ? (
        <Text color="gray">You don't own any heroes yet. Create one above!</Text>
      ) : (
        <Flex direction="column" gap="2">
          {data.data.map((object) => {
            if (object.data?.content?.dataType !== "moveObject") return null;
            const fields = object.data.content.fields as unknown as HeroFields;
            return <HeroCard key={fields.id.id} fields={fields} />;
          })}
        </Flex>
      )}
    </Flex>
  );
}
