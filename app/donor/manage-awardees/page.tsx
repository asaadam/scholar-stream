"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, Plus, Trash2, UserCheck } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export default function ManageAwardees() {
  // Mock data for awardees
  const [awardees, setAwardees] = useState([
    {
      id: 1,
      name: "Alex Johnson",
      wallet: "0x1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t",
      amount: "250 USDC",
      status: "Active",
      nextPayment: "Apr 7, 2025",
    },
    {
      id: 2,
      name: "Jamie Smith",
      wallet: "0x9s8r7q6p5o4n3m2l1k0j9i8h7g6f5e4d3c2b1a",
      amount: "250 USDC",
      status: "Active",
      nextPayment: "Apr 7, 2025",
    },
    {
      id: 3,
      name: "Taylor Wilson",
      wallet: "0x2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t1a",
      amount: "250 USDC",
      status: "Paused",
      nextPayment: "N/A",
    },
  ])

  const [newAwardeeWallet, setNewAwardeeWallet] = useState("")
  const [newAwardeeName, setNewAwardeeName] = useState("")

  const addAwardee = () => {
    const newAwardee = {
      id: awardees.length + 1,
      name: newAwardeeName,
      wallet: newAwardeeWallet,
      amount: "250 USDC",
      status: "Active",
      nextPayment: "Apr 7, 2025",
    }

    setAwardees([...awardees, newAwardee])
    setNewAwardeeWallet("")
    setNewAwardeeName("")
  }

  const removeAwardee = (id: number) => {
    setAwardees(awardees.filter((awardee) => awardee.id !== id))
  }

  const toggleStatus = (id: number) => {
    setAwardees(
      awardees.map((awardee) => {
        if (awardee.id === id) {
          const newStatus = awardee.status === "Active" ? "Paused" : "Active"
          const nextPayment = newStatus === "Active" ? "Apr 7, 2025" : "N/A"
          return { ...awardee, status: newStatus, nextPayment }
        }
        return awardee
      }),
    )
  }

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
          <CardTitle>Manage Awardees</CardTitle>
          <CardDescription>Computer Science Excellence Scholarship - 10,000 USDC over 12 months</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-6 flex justify-between">
            <div>
              <p className="text-sm text-muted-foreground">5 maximum awardees, 3 currently active</p>
            </div>
            <Dialog>
              <DialogTrigger asChild>
                <Button size="sm">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Awardee
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Awardee</DialogTitle>
                  <DialogDescription>Add a new awardee to receive scholarship payments.</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Name</Label>
                    <Input
                      id="name"
                      value={newAwardeeName}
                      onChange={(e) => setNewAwardeeName(e.target.value)}
                      placeholder="Awardee name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="wallet">Wallet Address</Label>
                    <Input
                      id="wallet"
                      value={newAwardeeWallet}
                      onChange={(e) => setNewAwardeeWallet(e.target.value)}
                      placeholder="0x..."
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button onClick={addAwardee}>Add Awardee</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Wallet Address</TableHead>
                <TableHead>Monthly Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Next Payment</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {awardees.map((awardee) => (
                <TableRow key={awardee.id}>
                  <TableCell>{awardee.name}</TableCell>
                  <TableCell className="font-mono text-xs">
                    {awardee.wallet.slice(0, 6)}...{awardee.wallet.slice(-4)}
                  </TableCell>
                  <TableCell>{awardee.amount}</TableCell>
                  <TableCell>
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        awardee.status === "Active" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {awardee.status}
                    </span>
                  </TableCell>
                  <TableCell>{awardee.nextPayment}</TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button variant="ghost" size="icon" onClick={() => toggleStatus(awardee.id)}>
                        <UserCheck className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => removeAwardee(awardee.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
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

