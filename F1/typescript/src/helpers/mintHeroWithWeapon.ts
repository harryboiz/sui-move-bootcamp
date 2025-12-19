import { SuiTransactionBlockResponse } from "@mysten/sui/client";
import { Transaction } from "@mysten/sui/transactions";
import { ENV } from "../env";
import { getAddress } from "./getAddress";
import { suiClient } from "../suiClient";
import { getSigner } from "./getSigner";

/**
 * Builds, signs, and executes a transaction for:
 * * minting a Hero NFT
 * * minting a Weapon NFT
 * * attaching the Weapon to the Hero
 * * transferring the Hero to the signer's address
 */
export const mintHeroWithWeapon =
  async (): Promise<SuiTransactionBlockResponse> => {
    const tx = new Transaction();
    const signer = getSigner({ secretKey: ENV.USER_SECRET_KEY });
    const address = getAddress({ secretKey: ENV.USER_SECRET_KEY });

    // Mint a new Hero
    const [hero] = tx.moveCall({
      target: `${ENV.PACKAGE_ID}::hero::new_hero`,
      arguments: [
        tx.pure.string("Hero"),
        tx.pure.u64(100),
        tx.object(ENV.HEROES_REGISTRY_ID),
      ],
    });

    // Mint a new Weapon
    const [weapon] = tx.moveCall({
      target: `${ENV.PACKAGE_ID}::hero::new_weapon`,
      arguments: [
        tx.pure.string("Sword"),
        tx.pure.u64(50),
      ],
    });

    // Equip the Weapon to the Hero
    tx.moveCall({
      target: `${ENV.PACKAGE_ID}::hero::equip_weapon`,
      arguments: [hero, weapon],
    });

    // Transfer the Hero to the signer's address
    tx.transferObjects([hero], address);

    // Sign and execute the transaction
    const response = await suiClient.signAndExecuteTransaction({
      transaction: tx,
      signer,
      options: {
        showEffects: true,
        showObjectChanges: true,
      },
    });

    return response;
  };
