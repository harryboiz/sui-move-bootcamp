import {
  useCurrentAccount,
  useSignAndExecuteTransaction,
  useSuiClient,
} from "@mysten/dapp-kit";
import { Transaction } from "@mysten/sui/transactions";
import { Button } from "@radix-ui/themes";
import { useQueryClient } from "@tanstack/react-query";

const HERO_PACKAGE_ID =
  "0xc413c2e2c1ac0630f532941be972109eae5d6734e540f20109d75a59a1efea1e";

export function MintNFTButton() {
  const account = useCurrentAccount();
  const suiClient = useSuiClient();
  const queryClient = useQueryClient();
  const { mutate: signAndExecuteTransaction, isPending } =
    useSignAndExecuteTransaction();

  const handleMintNFT = () => {
    if (!account) return;

    const tx = new Transaction();

    // mint_hero returns a Hero object, we need to transfer it to the sender
    const hero = tx.moveCall({
      target: `${HERO_PACKAGE_ID}::hero::mint_hero`,
    });

    tx.transferObjects([hero], account.address);

    signAndExecuteTransaction(
      { transaction: tx },
      {
        onSuccess: async (result) => {
          console.log("NFT minted successfully!", result);

          // Wait for the transaction to be available over the API
          await suiClient.waitForTransaction({
            digest: result.digest,
          });

          // Invalidate all queries that start with "getOwnedObjects" to refresh the list
          queryClient.invalidateQueries({
            predicate: (query) => {
              const queryKey = query.queryKey;
              return Array.isArray(queryKey) && queryKey.includes("getOwnedObjects");
            },
          });
        },
        onError: (error) => {
          console.error("Failed to mint NFT:", error);
        },
      }
    );
  };

  return (
    <Button onClick={handleMintNFT} disabled={isPending}>
      {isPending ? "Minting..." : "Mint Hero NFT"}
    </Button>
  );
}
