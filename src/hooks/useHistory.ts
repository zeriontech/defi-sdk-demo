import { mergeList, Transaction, useSubscription } from "defi-sdk";
import { useCallback, useMemo } from "react";

export function useHistory(address?: string) {
  return useSubscription<Transaction[], "address", "transactions">({
    namespace: "address",
    mergeStrategy: mergeList,
    getId: useCallback((item: Transaction) => item.hash, []),
    body: useMemo(() => {
      return {
        scope: ["transactions"],
        payload: {
          address,
          currency: "USD",
        },
      };
    }, [address]),
  });
}
