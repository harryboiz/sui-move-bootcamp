import { ConnectButton, useCurrentAccount } from "@mysten/dapp-kit";
import { Box, Container, Flex, Heading, Tabs } from "@radix-ui/themes";
import { HeroesList } from "./components/HeroesList";
import { CreateHeroForm } from "./components/CreateHeroForm";
import { OwnedObjects } from "./OwnedObjects";

function App() {
  const account = useCurrentAccount();

  return (
    <>
      <Flex
        position="sticky"
        px="4"
        py="2"
        justify="between"
        style={{
          borderBottom: "1px solid var(--gray-a2)",
        }}
      >
        <Box>
          <Heading>Hero dApp</Heading>
        </Box>

        <Box>
          <ConnectButton />
        </Box>
      </Flex>
      <Container>
        <Container
          mt="5"
          pt="2"
          px="4"
          style={{ background: "var(--gray-a2)", minHeight: 500 }}
        >
          <Tabs.Root defaultValue="heroes-list">
            <Tabs.List>
              <Tabs.Trigger value="heroes-list">🦸 Heroes List</Tabs.Trigger>
              <Tabs.Trigger value="create-hero">⚔️ Create Hero</Tabs.Trigger>
              <Tabs.Trigger value="my-heroes">🎖️ My Heroes</Tabs.Trigger>
            </Tabs.List>

            <Box pt="4">
              <Tabs.Content value="heroes-list">
                <HeroesList />
              </Tabs.Content>

              <Tabs.Content value="create-hero">
                <CreateHeroForm />
              </Tabs.Content>

              <Tabs.Content value="my-heroes">
                {account ? (
                  <OwnedObjects />
                ) : (
                  <Box p="4">
                    Connect your wallet to see your heroes
                  </Box>
                )}
              </Tabs.Content>
            </Box>
          </Tabs.Root>
        </Container>
      </Container>
    </>
  );
}

export default App;
