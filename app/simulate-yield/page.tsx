"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  useAccount,
  useReadContract,
  useWaitForTransactionReceipt,
  useWriteContract,
} from "wagmi";
import { yieldVaultAbi } from "../../abi/yieldVaultAbi";
import { formatUnits, parseUnits } from "viem";

const MOCK_YIELD_VAULT_ADDRESS = "0xFAC6C7325a7BbA0F986b56b33313Ed9D0Fb224D5";

export default function SimulateYield() {
  const account = useAccount();
  const [amount, setAmount] = useState("");
  const [isSimulating, setIsSimulating] = useState(false);

  // Read contract to get total underlying assets
  const { data: totalUnderlying, refetch: refetchTotalUnderlying } =
    useReadContract({
      address: MOCK_YIELD_VAULT_ADDRESS,
      abi: yieldVaultAbi,
      functionName: "totalUnderlying",
      query: {
        enabled: !!account.address,
      },
    });

  // Write contract to simulate yield
  const { writeContractAsync, data: hash, isPending } = useWriteContract();

  // Wait for transaction to complete
  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({
      hash,
    });

  // After transaction is confirmed, refetch total underlying
  useEffect(() => {
    if (isConfirmed) {
      refetchTotalUnderlying();
      setIsSimulating(false);
      toast.success("Yield simulation completed successfully!");
    }
  }, [isConfirmed, refetchTotalUnderlying]);

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAmount(e.target.value);
  };

  const handleSimulateYield = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!account.address) {
      toast.error("Please connect your wallet first");
      return;
    }

    try {
      setIsSimulating(true);

      await writeContractAsync({
        address: MOCK_YIELD_VAULT_ADDRESS,
        abi: yieldVaultAbi,
        functionName: "simulateYield",
        args: [parseUnits(amount, 6)],
      });
    } catch (error) {
      console.error("Error simulating yield:", error);
      toast.error("Failed to simulate yield");
      setIsSimulating(false);
    }
  };

  const formattedTotalUnderlying = totalUnderlying
    ? formatUnits(totalUnderlying, 6)
    : "0.00";

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Simulate Yield</h1>
      </div>

      <Card className="mx-auto max-w-md">
        <CardContent className="pt-6">
          <form onSubmit={handleSimulateYield}>
            <div className="mb-6">
              <div className="flex justify-between mb-1">
                <Label htmlFor="totalAsset">Total Asset</Label>
                <span className="text-lg font-semibold">
                  {formattedTotalUnderlying}
                </span>
              </div>
            </div>

            <div className="mb-6">
              <Label htmlFor="amount" className="mb-2 block">
                Amount
              </Label>
              <Input
                id="amount"
                type="number"
                min="0"
                step="0.01"
                placeholder="Enter amount"
                value={amount}
                onChange={handleAmountChange}
                className="w-full"
                required
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-black text-white py-3 rounded-md"
              disabled={
                isSimulating ||
                isPending ||
                isConfirming ||
                !account.isConnected
              }
            >
              {isPending || isConfirming
                ? "Processing..."
                : isSimulating
                ? "Simulating..."
                : "Submit"}
            </Button>

            {!account.isConnected && (
              <p className="text-sm text-muted-foreground text-center mt-2">
                Connect your wallet to simulate yield
              </p>
            )}
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
