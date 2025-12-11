import { BalanceChange } from "@mysten/sui/client";

interface Args {
  balanceChanges: BalanceChange[];
  senderAddress: string;
  recipientAddress: string;
}

interface Response {
  recipientSUIBalanceChange: number;
  senderSUIBalanceChange: number;
}

/**
 * Parses the balance changes as they are returned by the SDK.
 * Filters out and formats the ones that correspond to SUI tokens and to the defined sender and recipient addresses.
 */
export const parseBalanceChanges = ({
  balanceChanges,
  senderAddress,
  recipientAddress,
}: Args): Response => {
  // TODO: Implement the function

  let recipientSUIBalanceChange = 0;
  let senderSUIBalanceChange = 0;
  
  for (const change of balanceChanges) {
    if (change.coinType !== "0x2::sui::SUI") {
      continue
    }
    
    if (change.owner === "Immutable" || !("AddressOwner" in change.owner)) {
      continue;
    }

    if (change.owner.AddressOwner === recipientAddress) {
      recipientSUIBalanceChange += Number(change.amount);
    }
    
    if (change.owner.AddressOwner === senderAddress) {
      senderSUIBalanceChange += Number(change.amount);
    }
    
  }

  return {
    recipientSUIBalanceChange,
    senderSUIBalanceChange,
  }
};
