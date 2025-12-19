import { useState } from "react";
import {
  useCurrentAccount,
  useSignAndExecuteTransaction,
  useSuiClient,
} from "@mysten/dapp-kit";
import { Transaction } from "@mysten/sui/transactions";
import { useQueryClient } from "@tanstack/react-query";
import {
  Box,
  Button,
  Flex,
  Heading,
  Text,
  TextField,
  Spinner,
} from "@radix-ui/themes";
import { PACKAGE_ID, HEROES_REGISTRY_ID } from "../constants";

export function CreateHeroForm() {
  const account = useCurrentAccount();
  const suiClient = useSuiClient();
  const queryClient = useQueryClient();
  const { mutate: signAndExecute, isPending } = useSignAndExecuteTransaction();

  // Form state
  const [heroName, setHeroName] = useState("Hero");
  const [heroStamina, setHeroStamina] = useState("100");
  const [weaponName, setWeaponName] = useState("Sword");
  const [weaponAttack, setWeaponAttack] = useState("50");

  // Status state
  const [status, setStatus] = useState<{
    type: "success" | "error" | null;
    message: string;
  }>({ type: null, message: "" });

  const handleMintHero = () => {
    if (!account) {
      setStatus({ type: "error", message: "Please connect your wallet first" });
      return;
    }

    if (!PACKAGE_ID || !HEROES_REGISTRY_ID) {
      setStatus({
        type: "error",
        message: "Please set VITE_PACKAGE_ID and VITE_HEROES_REGISTRY_ID in your .env file",
      });
      return;
    }

    setStatus({ type: null, message: "" });

    const tx = new Transaction();

    // Mint a new Hero
    const [hero] = tx.moveCall({
      target: `${PACKAGE_ID}::hero::new_hero`,
      arguments: [
        tx.pure.string(heroName),
        tx.pure.u64(parseInt(heroStamina)),
        tx.object(HEROES_REGISTRY_ID),
      ],
    });

    // Mint a new Weapon
    const [weapon] = tx.moveCall({
      target: `${PACKAGE_ID}::hero::new_weapon`,
      arguments: [
        tx.pure.string(weaponName),
        tx.pure.u64(parseInt(weaponAttack)),
      ],
    });

    // Equip the Weapon to the Hero
    tx.moveCall({
      target: `${PACKAGE_ID}::hero::equip_weapon`,
      arguments: [hero, weapon],
    });

    // Transfer the Hero to the sender's address
    tx.transferObjects([hero], account.address);

    signAndExecute(
      {
        transaction: tx,
      },
      {
        onSuccess: async (result) => {
          // Wait for the transaction to be indexed
          await suiClient.waitForTransaction({
            digest: result.digest,
            timeout: 60_000,
          });

          // Invalidate queries to refresh the lists
          queryClient.invalidateQueries({ queryKey: ["getObject"] });
          queryClient.invalidateQueries({ queryKey: ["multiGetObjects"] });
          queryClient.invalidateQueries({ queryKey: ["getOwnedObjects"] });

          setStatus({
            type: "success",
            message: `Hero created successfully! TX: ${result.digest}`,
          });
        },
        onError: (error) => {
          setStatus({
            type: "error",
            message: `Failed to create hero: ${error.message}`,
          });
        },
      }
    );
  };

  if (!account) {
    return (
      <Box p="4">
        <Text color="gray">Connect your wallet to create a Hero</Text>
      </Box>
    );
  }

  return (
    <Box p="4">
      <Heading size="5" mb="3">
        ⚔️ Create Hero with Weapon
      </Heading>

      <Flex direction="column" gap="3" style={{ maxWidth: "400px" }}>
        {/* Hero inputs */}
        <Box>
          <Text size="2" weight="bold" mb="1">
            Hero Name
          </Text>
          <TextField.Root
            value={heroName}
            onChange={(e) => setHeroName(e.target.value)}
            placeholder="Enter hero name"
          />
        </Box>

        <Box>
          <Text size="2" weight="bold" mb="1">
            Hero Stamina
          </Text>
          <TextField.Root
            type="number"
            value={heroStamina}
            onChange={(e) => setHeroStamina(e.target.value)}
            placeholder="Enter stamina"
          />
        </Box>

        {/* Weapon inputs */}
        <Box>
          <Text size="2" weight="bold" mb="1">
            Weapon Name
          </Text>
          <TextField.Root
            value={weaponName}
            onChange={(e) => setWeaponName(e.target.value)}
            placeholder="Enter weapon name"
          />
        </Box>

        <Box>
          <Text size="2" weight="bold" mb="1">
            Weapon Attack
          </Text>
          <TextField.Root
            type="number"
            value={weaponAttack}
            onChange={(e) => setWeaponAttack(e.target.value)}
            placeholder="Enter attack value"
          />
        </Box>

        <Button onClick={handleMintHero} disabled={isPending} size="3">
          {isPending ? (
            <Flex align="center" gap="2">
              <Spinner />
              Creating Hero...
            </Flex>
          ) : (
            "🦸 Mint Hero with Weapon"
          )}
        </Button>

        {status.type && (
          <Text
            color={status.type === "success" ? "green" : "red"}
            size="2"
            style={{ wordBreak: "break-all" }}
          >
            {status.message}
          </Text>
        )}
      </Flex>
    </Box>
  );
}
