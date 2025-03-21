import Link from "next/link"
import { ArrowLeft } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export default function AwardeeTransactions() {
  // Mock data for transactions
  const transactions = [
    {
      id: 1,
      date: "Mar 7, 2025",
      scholarship: "Computer Science Excellence",
      amount: "250 USDC",
      type: "Received",
      status: "Completed",
      txHash: "0xabcd...1234",
    },
    {
      id: 2,
      date: "Feb 7, 2025",
      scholarship: "Computer Science Excellence",
      amount: "250 USDC",
      type: "Received",
      status: "Completed",
      txHash: "0xefgh...5678",
    },
    {
      id: 3,
      date: "Jan 7, 2025",
      scholarship: "Computer Science Excellence",
      amount: "250 USDC",
      type: "Received",
      status: "Completed",
      txHash: "0xijkl...9012",
    },
    {
      id: 4,
      date: "Jan 10, 2025",
      scholarship: "Computer Science Excellence",
      amount: "500 USDC",
      type: "Withdrawal",
      status: "Completed",
      txHash: "0xmnop...3456",
    },
  ]

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6 flex items-center">
        <Link href="/awardee">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Transaction History</CardTitle>
          <CardDescription>View all your scholarship transactions</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Scholarship</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Transaction Hash</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transactions.map((tx) => (
                <TableRow key={tx.id}>
                  <TableCell>{tx.date}</TableCell>
                  <TableCell>{tx.scholarship}</TableCell>
                  <TableCell>{tx.amount}</TableCell>
                  <TableCell>
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        tx.type === "Received" ? "bg-blue-100 text-blue-800" : "bg-purple-100 text-purple-800"
                      }`}
                    >
                      {tx.type}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        tx.status === "Completed"
                          ? "bg-green-100 text-green-800"
                          : tx.status === "Pending"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-red-100 text-red-800"
                      }`}
                    >
                      {tx.status}
                    </span>
                  </TableCell>
                  <TableCell>
                    <a
                      href={`https://etherscan.io/tx/${tx.txHash}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-mono text-xs text-blue-600 hover:underline"
                    >
                      {tx.txHash}
                    </a>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}

