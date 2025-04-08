"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { formatUnits } from "viem"
import { useWriteContract, useWaitForTransactionReceipt } from "wagmi"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useAwardeeStreams } from "@/lib/hooks/useAwardeeStreams"
import payContractAbi from "@/abi/payContract.json"

interface FormattedStream {
  id: string;
  payer: string;
  name: string;
  availableBalance: string;
  unclaimedAmount: number;
}

export default function WithdrawFunds() {
  const { streams, isLoading } = useAwardeeStreams();
  const [selectedScholarship, setSelectedScholarship] = useState<string>("");
  const [formattedStreams, setFormattedStreams] = useState<FormattedStream[]>([]);
  
  const { writeContract, data: hash } = useWriteContract();
  const { isLoading: isWithdrawing, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });
  
  useEffect(() => {
    if (streams && streams.length > 0) {
      const formatted = streams.map((stream, index) => {
        // Format unclaimed amount
        const unclaimedAmount = parseFloat(formatUnits(BigInt(Math.floor(stream.unclaimedAmount)), 18)).toFixed(4);
        
        return {
          id: index.toString(),
          payer: stream.payer,
          name: `Scholarship #${index + 1}`,
          availableBalance: `${unclaimedAmount} USDC`,
          unclaimedAmount: stream.unclaimedAmount,
        };
      });
      
      setFormattedStreams(formatted);
      if (formatted.length > 0 && !selectedScholarship) {
        setSelectedScholarship(formatted[0].id);
      }
    }
  }, [streams, selectedScholarship]);
  
  // Success effect
  useEffect(() => {
    if (isSuccess) {
      toast.success("Funds withdrawn successfully!");
      setTimeout(() => {
        window.location.href = "/awardee";
      }, 2000);
    }
  }, [isSuccess]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const selectedStream = formattedStreams.find(s => s.id === selectedScholarship);
    if (!selectedStream) return;
    
    try {
      writeContract({
        abi: payContractAbi,
        address: selectedStream.payer as `0x${string}`,
        functionName: "withdraw",
        args: [],
      });
    } catch (error) {
      console.error("Failed to withdraw:", error);
      toast.error("Failed to withdraw funds. Please try again.");
    }
  }
  
  const getCurrentStream = () => {
    return formattedStreams.find(s => s.id === selectedScholarship);
  };

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
          {isLoading ? (
            <CardContent className="text-center py-6">
              Loading scholarships...
            </CardContent>
          ) : formattedStreams.length === 0 ? (
            <CardContent className="text-center py-6">
              You don&apos;t have any active scholarships with withdrawable funds.
            </CardContent>
          ) : (
            <form onSubmit={handleSubmit}>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="scholarship">Scholarship</Label>
                  <Select 
                    value={selectedScholarship} 
                    onValueChange={setSelectedScholarship}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select scholarship" />
                    </SelectTrigger>
                    <SelectContent>
                      {formattedStreams.map((scholarship) => (
                        <SelectItem key={scholarship.id} value={scholarship.id}>
                          {scholarship.name} - {scholarship.availableBalance}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="amount">Withdrawal Amount</Label>
                  <Input 
                    id="amount" 
                    type="text" 
                    placeholder="All available funds will be withdrawn"
                    disabled
                  />
                  <p className="text-xs text-muted-foreground">
                    Available balance: {getCurrentStream()?.availableBalance || "0 USDC"}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Note: All available funds will be withdrawn in one transaction
                  </p>
                </div>
              </CardContent>
              <CardFooter>
                <Button 
                  type="submit" 
                  className="w-full" 
                  disabled={isWithdrawing || !selectedScholarship || formattedStreams.length === 0}
                >
                  {isWithdrawing ? "Processing Withdrawal..." : "Withdraw Funds"}
                </Button>
              </CardFooter>
            </form>
          )}
        </Card>
      </div>
    </div>
  )
}

