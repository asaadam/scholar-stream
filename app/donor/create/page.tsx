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
import { Textarea } from "@/components/ui/textarea"

export default function CreateScholarship() {
  const [isCreating, setIsCreating] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsCreating(true)

    // Mock transaction delay
    setTimeout(() => {
      setIsCreating(false)
      window.location.href = "/donor"
    }, 2000)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mx-auto max-w-2xl">
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
            <CardTitle>Create Scholarship Stream</CardTitle>
            <CardDescription>
              Set up a new scholarship stream using stablecoins that will be distributed to awardees over time.
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name">Scholarship Name</Label>
                <Input id="name" placeholder="e.g., Computer Science Excellence Scholarship" required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Describe the purpose and criteria for this scholarship"
                  rows={4}
                />
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="amount">Total Amount</Label>
                  <div className="flex">
                    <Input
                      id="amount"
                      type="number"
                      min="1"
                      placeholder="10000"
                      required
                      onChange={(e) => {
                        const amount = Number.parseFloat(e.target.value)
                        const durationEl = document.getElementById("duration") as HTMLInputElement
                        const duration = Number.parseFloat(durationEl?.value || "0")

                        const rateEl = document.getElementById("rate-display")
                        if (rateEl && amount && duration) {
                          const rate = amount / duration
                          rateEl.textContent = rate.toFixed(2)
                        }
                      }}
                    />
                    <Select defaultValue="usdc">
                      <SelectTrigger className="w-[120px]">
                        <SelectValue placeholder="Token" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="usdc">USDC</SelectItem>
                        <SelectItem value="usdt">USDT</SelectItem>
                        <SelectItem value="dai">DAI</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="duration">Duration (months)</Label>
                  <Input
                    id="duration"
                    type="number"
                    min="1"
                    max="60"
                    placeholder="12"
                    required
                    onChange={(e) => {
                      const duration = Number.parseFloat(e.target.value)
                      const amountEl = document.getElementById("amount") as HTMLInputElement
                      const amount = Number.parseFloat(amountEl?.value || "0")

                      const rateEl = document.getElementById("rate-display")
                      if (rateEl && amount && duration) {
                        const rate = amount / duration
                        rateEl.textContent = rate.toFixed(2)
                      }
                    }}
                  />
                </div>
              </div>

              <div className="rounded-md bg-muted p-4">
                <div className="font-medium">Streaming Rate</div>
                <div className="mt-1 flex items-baseline">
                  <span id="rate-display" className="text-2xl font-bold">
                    0.00
                  </span>
                  <span className="ml-1 text-muted-foreground"> USDC per month</span>
                </div>
                <p className="mt-2 text-sm text-muted-foreground">
                  Funds will be streamed continuously to awardees, calculated per second based on this monthly rate.
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="max-awardees">Maximum Number of Awardees</Label>
                <Input id="max-awardees" type="number" min="1" placeholder="5" required />
                <p className="text-xs text-muted-foreground">
                  Each awardee will receive an equal stream from the total amount.
                </p>
              </div>
            </CardContent>
            <CardFooter>
              <Button type="submit" className="w-full" disabled={isCreating}>
                {isCreating ? "Creating Scholarship Stream..." : "Create Scholarship Stream"}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  )
}

