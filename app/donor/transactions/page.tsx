import Link from "next/link"
import { ArrowLeft } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export default function TransactionHistory() {
  // Mock data for transactions
  const transactions = [
    {
      id: 1,
      date: "Mar 7, 2025",
      scholarship: "Computer Science Excellence",
      recipient: "Alex Johnson",
      recipientWallet: "0x1a2b...3c4d",
      amount: "250 USDC",
      status: "Completed",
      txHash: "0xabcd...1234",
    },
    {
      id: 2,
      date: "Mar 5, 2025",
      scholarship: "Engineering Futures",
      recipient: "Jamie Smith",
      recipientWallet: "0x5e6f...7g8h",
      amount: "500 USDC",
      status: "Completed",
      txHash: "0xefgh...5678",
    },
    {
      id: 3,
      date: "Mar 1, 2025",
      scholarship: "Computer Science Excellence",
      recipient: "Taylor Wilson",
      recipientWallet: "0x9i0j...1k2l",
      amount: "250 USDC",
      status: "Completed",
      txHash: "0xijkl...9012",
    },
    {
      id: 4,
      date: "Feb 28, 2025",
      scholarship: "Engineering Futures",
      recipient: "Casey Brown",
      recipientWallet: "0x3m4n...5o6p",
      amount: "500 USDC",
      status: "Completed",
      txHash: "0xmnop...3456",
    },
    {
      id: 5,
      date: "Feb 15, 2025",
      scholarship: "Computer Science Excellence",
      recipient: "Alex Johnson",
      recipientWallet: "0x1a2b...3c4d",
      amount: "250 USDC",
      status: "Completed",
      txHash: "0xqrst...7890",
    },
    {
      id: 6,
      date: "Feb 7, 2025",
      scholarship: "Computer Science Excellence",
      recipient: "Jamie Smith",
      recipientWallet: "0x5e6f...7g8h",
      amount: "250 USDC",
      status: "Completed",
      txHash: "0xuvwx...1234",
    },
    {
      id: 7,
      date: "Feb 5, 2025",
      scholarship: "Engineering Futures",
      recipient: "Taylor Wilson",
      recipientWallet: "0x9i0j...1k2l",
      amount: "500 USDC",
      status: "Completed",
      txHash: "0xyzab...5678",
    },
  ]

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6 flex items-center">
        <Link href="/donor">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Transaction History</CardTitle>
          <CardDescription>View all your scholarship payment transactions</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Scholarship</TableHead>
                <TableHead>Recipient</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Transaction Hash</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transactions.map((tx) => (
                <TableRow key={tx.id}>
                  <TableCell>{tx.date}</TableCell>
                  <TableCell>{tx.scholarship}</TableCell>
                  <TableCell>
                    {tx.recipient}
                    <div className="font-mono text-xs text-muted-foreground">{tx.recipientWallet}</div>
                  </TableCell>
                  <TableCell>{tx.amount}</TableCell>
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

