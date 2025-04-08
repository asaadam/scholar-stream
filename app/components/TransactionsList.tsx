import Link from "next/link";
import { History } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Transaction } from "./TransactionData";

interface TransactionsListProps {
  transactions: Transaction[];
  isLoading: boolean;
}

export function TransactionsList({ transactions, isLoading }: TransactionsListProps) {
  return (
    <>
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Recent Transactions</h2>
        <Link href="/awardee/transactions">
          <Button variant="ghost" size="sm">
            View All
            <History className="ml-2 h-4 w-4" />
          </Button>
        </Link>
      </div>

      <div className="rounded-lg border">
        <div className="grid grid-cols-4 gap-4 p-4 font-medium">
          <div>Date</div>
          <div>Scholarship</div>
          <div>Amount</div>
          <div>Status</div>
        </div>
        {isLoading ? (
          <div className="text-center py-8">Loading transactions...</div>
        ) : transactions.length === 0 ? (
          <div className="text-center py-8">No transactions found.</div>
        ) : (
          <div className="divide-y">
            {transactions.map((tx, index) => (
              <div key={index} className="grid grid-cols-4 gap-4 p-4">
                <div className="text-sm">{tx.date}</div>
                <div className="text-sm">{tx.scholarship}</div>
                <div className="text-sm">{tx.amount}</div>
                <div className="text-sm text-green-500">{tx.status}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
} 