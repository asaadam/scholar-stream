import { useEffect, useState } from "react";
import { formatUnits } from "viem";

interface StreamData {
  payer: string;
  status: string;
  amountPerSec: string;
  amountReceived: string;
  startTimestamp: string;
  lastWithdrawTimestamp: string;
  totalAmount: number;
  unclaimedAmount: number;
}

export interface Transaction {
  date: string;
  scholarship: string;
  amount: string;
  status: string;
}

export function useTransactionData(streams: StreamData[] | null) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  useEffect(() => {
    if (!streams || streams.length === 0) {
      setTransactions([]);
      return;
    }

    // Format transactions
    const txs: Transaction[] = [];
    for (const stream of streams) {
      // Add one transaction for each stream
      const startDate = new Date(parseInt(stream.startTimestamp) * 1000);
      txs.push({
        date: startDate.toLocaleDateString(),
        scholarship: `Scholarship from ${stream.payer.slice(0, 6)}...`,
        amount: `${parseFloat(
          formatUnits(BigInt(stream.amountReceived), 6)
        ).toFixed(2)} USDC`,
        status: "Received",
      });
    }

    setTransactions(txs);
  }, [streams]);

  return { transactions };
}
