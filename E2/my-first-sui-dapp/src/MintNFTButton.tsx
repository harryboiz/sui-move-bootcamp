import { useSignAndExecuteTransaction } from "@mysten/dapp-kit";
import { Transaction } from "@mysten/sui/transactions";
import { Button } from "@radix-ui/themes";

const HERO_PACKAGE_ID =
  "0xc413c2e2c1ac0630f532941be972109eae5d6734e540f20109d75a59a1efea1e";

export function MintNFTButton() {
  const { mutate: signAndExecuteTransaction, isPending } =
    useSignAndExecuteTransaction();

  const handleMintNFT = () => {
    const tx = new Transaction();

    tx.moveCall({
      target: `${HERO_PACKAGE_ID}::hero::mint_hero`,
    });

    signAndExecuteTransaction(
      { transaction: tx },
      {
        onSuccess: (result) => {
          console.log("NFT minted successfully!", result);
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
