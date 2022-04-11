import React from "react";
import { Transaction } from "./components";
import { useHistory } from "./hooks/useHistory";
interface HistoryProps {
  address?: string;
}

export const History = ({ address }: HistoryProps) => {
  const transactions = useHistory(address);

  console.log(transactions);
  return transactions.value ? (
    <>
      {transactions.value.map(transaction => (
        <Transaction key={transaction.hash} transaction={transaction} />
      ))}
    </>
  ) : (
    <div>Loading...</div>
  );
};
