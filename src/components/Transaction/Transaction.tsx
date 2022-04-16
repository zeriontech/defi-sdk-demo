import React from "react";
import { Transaction as TTransaction } from "defi-sdk";
import styles from "./Transaction.module.css";
import { capitalize, shortDateFormatter } from "../../utils";
import { getOutcomeData } from "./helpers";

interface TransactionProps {
  transaction: TTransaction;
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
