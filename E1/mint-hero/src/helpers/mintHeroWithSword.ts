import { SuiClient, SuiTransactionBlockResponse } from "@mysten/sui/client";
import { Transaction } from "@mysten/sui/transactions";
import { getAddress } from "./getAddress";
import { ENV } from "../env";
import { getSigner } from "./getSigner";

/**
 * Builds, signs, and executes a transaction for:
 * * minting a Hero NFT: use the `package_id::hero::mint_hero` function
 * * minting a Sword NFT: use the `package_id::blacksmith::new_sword` function
 * * attaching the Sword to the Hero: use the `package_id::hero::equip_sword` function
 * * transferring the Hero to the signer
 */
export const mintHeroWithSword =
  async (): Promise<SuiTransactionBlockResponse> => {
    // TODO: Implement this function
    const suiClient = new SuiClient({
      url: ENV.SUI_NETWORK,
    });

    const signer = getSigner({ secretKey: ENV.USER_SECRET_KEY });

    const tx = new Transaction();
    let package_id = "0x2eb076d9f07929c0db89564dbd2ea8fd08bb2cf8807dc4567c2f464e9cf8823e";

    let hero = tx.moveCall({
      target: `${package_id}::hero::mint_hero`,     
      arguments: []
    });

    let sword = tx.moveCall({
      target: `${package_id}::blacksmith::new_sword`,   
      arguments: [
        tx.pure.u64(10)
      ]     
    });

    tx.moveCall({
      target: `${package_id}::hero::equip_sword`,      
      arguments: [
        hero,
        sword
      ]
    });

    tx.transferObjects([hero], tx.pure.address(signer.toSuiAddress()));


    return await suiClient.signAndExecuteTransaction({
      transaction: tx,
      signer: signer,
      options: {
        showEffects: true,
        showEvents: true,
        showObjectChanges: true,
      },
    });
  };
  
