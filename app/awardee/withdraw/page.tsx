"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function WithdrawFunds() {
  const [isWithdrawing, setIsWithdrawing] = useState(false)

  // Mock scholarship data
  const scholarships = [
    {
      id: 1,
      name: "Computer Science Excellence",
      availableBalance: "750 USDC",
    },
  ]

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsWithdrawing(true)

    // Mock withdrawal delay
    setTimeout(() => {
      setIsWithdrawing(false)
      window.location.href = "/awardee"
    }, 2000)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mx-auto max-w-md">
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
            <CardTitle>Withdraw Funds</CardTitle>
            <CardDescription>Withdraw your scholarship funds to your wallet.</CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="scholarship">Scholarship</Label>
                <Select defaultValue="1" required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select scholarship" />
                  </SelectTrigger>
                  <SelectContent>
                    {scholarships.map((scholarship) => (
                      <SelectItem key={scholarship.id} value={scholarship.id.toString()}>
                        {scholarship.name} - {scholarship.availableBalance}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="amount">Amount to Withdraw</Label>
                <div className="flex">
                  <Input id="amount" type="number" min="1" placeholder="750" required />
                  <Select defaultValue="usdc">
                    <SelectTrigger className="w-[120px]">
                      <SelectValue placeholder="Token" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="usdc">USDC</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <p className="text-xs text-muted-foreground">Available balance: 750 USDC</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="wallet">Destination Wallet</Label>
                <Input id="wallet" defaultValue="0x1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t" disabled />
                <p className="text-xs text-muted-foreground">This is your connected wallet address.</p>
              </div>
            </CardContent>
            <CardFooter>
              <Button type="submit" className="w-full" disabled={isWithdrawing}>
                {isWithdrawing ? "Processing Withdrawal..." : "Withdraw Funds"}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  )
}

