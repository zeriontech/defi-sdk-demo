import { Transaction as TTransaction } from "defi-sdk";
import React from "react";
import { Transaction } from "./components";
import { useHistory } from "./hooks/useHistory";

interface HistoryProps {
  address?: string;
}

export const History = ({ address }: HistoryProps) => {
  // add code to fetch address history
  const value = [] as TTransaction[];
  // end

  return value ? (
    <>
      {(value || [])?.map(transaction => (
        <Transaction key={transaction.hash} transaction={transaction} />
      ))}
    </>
  ) : (
    <div>Loading...</div>
  );
};
