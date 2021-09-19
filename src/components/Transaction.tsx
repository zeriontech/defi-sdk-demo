import React from "react";
import { Transaction as HistoryTransaction, TransactionChange } from "defi-sdk";
import styles from "./Transaction.module.css";
import { capitalize, shortDateFormatter } from "../utils";
import BigNumber from "bignumber.js";

interface TransactionProps {
  transaction: HistoryTransaction;
}

export function getOutcomeData(transaction: HistoryTransaction) {
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
    const incomeAsset = changes?.find(
      asset => asset.direction === "in",
    );
    if (incomeAsset) {
      const quantityBN = new BigNumber(incomeAsset.value);
      const normalizedQuantity = Number(
        quantityBN.shiftedBy(0 - incomeAsset.asset.decimals).toFixed(2),
      );
      summary = `+${normalizedQuantity} ${incomeAsset.asset.symbol}`;
    }
  } else if (numberOfOutcomeAssets === 1) {
    const outcomeAsset = changes.find(
      asset => asset.direction === "out",
    );
    if (outcomeAsset) {
      const quantityBN = new BigNumber(outcomeAsset.value);
      const normalizedQuantity = Number(
        quantityBN.shiftedBy(0 - outcomeAsset.asset.decimals).toFixed(2),
      );
      summary = `-${normalizedQuantity} ${outcomeAsset.asset.symbol}`;
    }
  } else if (numberOfOutcomeAssets > 1) {
    summary = `-${numberOfOutcomeAssets} ASSETS`;
  }

  return summary;
}

export const Transaction = ({ transaction }: TransactionProps) => {
  return (
    <div className={styles.transaction}>
      <div>
        <div className={styles.type}>{capitalize(transaction.type)}</div>
        <div className={styles.date}>
          {shortDateFormatter.format(Number(transaction.mined_at) * 1000)}
        </div>
      </div>
      <div className={styles.value}>{getOutcomeData(transaction)}</div>
    </div>
  );
};
