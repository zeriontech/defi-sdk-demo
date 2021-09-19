import { mergeList, Transaction, useSubscription } from "defi-sdk";
import { useCallback, useMemo } from "react";

export function useHistory(address?: string) {
  return useSubscription<Transaction[], "address", "transactions">({
    namespace: "address",
    mergeStrategy: mergeList,
    getId: useCallback((item: Transaction) => item.hash, []),
    body: useMemo(() => {
      const payload = {
        address,
        currency: "USD",
      };
      return {
        scope: ["transactions"],
        payload,
      };
    }, [address]),
  });
}
