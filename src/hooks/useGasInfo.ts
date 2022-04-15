import { useMemo } from "react";
import { mergeSingleEntity, useSubscription } from "defi-sdk";

export interface GasPriceInfo {
  rapid: number | null;
  fast: number;
  standard: number;
  slow: number;
  source: string;
  datetime: string;
}

export function useGasPriceInfo() {
  return useSubscription<GasPriceInfo, "gas", "price">({
    namespace: "gas",
    mergeStrategy: mergeSingleEntity,
    body: useMemo(
      () => ({
        scope: ["price"],
        payload: {},
      }),
      [],
    ),
  });
}
