import { SuiTransactionBlockResponse } from "@mysten/sui/client";
import { Transaction } from "@mysten/sui/transactions";
import { suiClient } from "../suiClient";
import { getSigner } from "./getSigner";

interface Args {
  amount: number;
  senderSecretKey: string;
  recipientAddress: string;
}

/**
 * Transfers the specified amount of SUI from the sender secret key to the recipient address.
 * Returns the transaction response, as it is returned by the SDK.
 */
export const transferSUI = async ({
  amount,
  senderSecretKey,
  recipientAddress,
}: Args): Promise<SuiTransactionBlockResponse> => {
  const tx = new Transaction();

  const suiCoinIds: string[] = []; 
  let cursor: string | null | undefined = undefined;

  while (true) {
    const suiCoins = await suiClient.getCoins({
      owner: getSigner({ secretKey: senderSecretKey })
        .getPublicKey()
        .toSuiAddress(),
      coinType: "0x2::sui::SUI",
      cursor
    });

    for (const coin of suiCoins.data) {
      suiCoinIds.push(coin.coinObjectId);
    }
    if (suiCoins.hasNextPage) {
      cursor = suiCoins.nextCursor;
    } else {
      break;
    }
  }

  const mergeCoin = tx.mergeCoins(suiCoinIds[0], suiCoinIds.slice(1));
  const suiCoin = tx.splitCoins(mergeCoin, [amount.toString()]);

  // TODO: Add the commands to the transaction
  tx.transferObjects([suiCoin], recipientAddress);

  return suiClient.signAndExecuteTransaction({
    transaction: tx,
    signer: getSigner({ secretKey: senderSecretKey }),
    options: {
      showEffects: true,
      showBalanceChanges: true,
    },
  });
};
