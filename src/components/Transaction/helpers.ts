import { Transaction, TransactionChange } from "defi-sdk";
import { convert } from "../../utils";

export function getOutcomeData(transaction: Transaction) {
  const changes = transaction.changes as unknown as TransactionChange[];
  
  const numberOfIncomeAssets = changes?.reduce(
    (acc, item) => acc + (item.direction === "in" ? 1 : 0),
    0,
  );
  const numberOfOutcomeAssets = changes?.reduce(
    (acc, item) => acc + (item.direction === "out" ? 1 : 0),
    0,
  );

  let summary = "";

  if (numberOfIncomeAssets > 1) {
    summary = `+${numberOfIncomeAssets} ASSETS`;
  } else if (numberOfIncomeAssets === 1) {
    const incomeAsset = changes?.find(asset => asset.direction === "in");
    if (incomeAsset) {
      const normalizedQuantity = convert(
        incomeAsset.value,
        0 - incomeAsset.asset.decimals,
      ).toFixed(2);
      summary = `+${normalizedQuantity} ${incomeAsset.asset.symbol}`;
    }
  } else if (numberOfOutcomeAssets === 1) {
    const outcomeAsset = changes.find(asset => asset.direction === "out");
    if (outcomeAsset) {
      const normalizedQuantity = convert(
        outcomeAsset.value,
        0 - outcomeAsset.asset.decimals,
      ).toFixed(2);
      summary = `-${normalizedQuantity} ${outcomeAsset.asset.symbol}`;
    }
  } else if (numberOfOutcomeAssets > 1) {
    summary = `-${numberOfOutcomeAssets} ASSETS`;
  }

  return summary;
}
