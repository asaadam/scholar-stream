import payContractAbi from "@/abi/payContract.json";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { calculateAmountPerMs } from "@/lib/utils/streamCalculations";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { formatUnits } from "viem";
import {
  useAccount,
  useWaitForTransactionReceipt,
  useWriteContract,
} from "wagmi";

interface ScholarshipProps {
  id: number;
  name: string;
  donor: string;
  payer: string;
  amountPerSec: number;
  totalReceived: string;
  startTimestamp: string;
  lastWithdrawTimestamp: string;
  unclaimedAmount: number;
  status: string;
  payContractId: string;
}

// Extracted component for unclaimed amount tracking and display
function UnclaimedAmount({
  initialAmount,
  amountPerSec,
  resetTrigger,
}: {
  initialAmount: number;
  amountPerSec: number;
  resetTrigger?: number;
}) {
  const [unclaimedTotal, setUnclaimedTotal] = useState(initialAmount);

  useEffect(() => {
    setUnclaimedTotal(initialAmount);
  }, [initialAmount, resetTrigger]);

  useEffect(() => {
    if (amountPerSec <= 0) return;

    const interval = setInterval(() => {
      setUnclaimedTotal((prev) => {
        const amountPerMs = calculateAmountPerMs(amountPerSec.toString());
        return prev + amountPerMs;
      });
    }, 1);

    return () => clearInterval(interval);
  }, [amountPerSec]);

  return (
    <div className="flex justify-between">
      <span className="text-sm text-muted-foreground">Unclaimed Amount:</span>
      <span className="text-green-500 font-semibold">
        {`${parseFloat(
          formatUnits(BigInt(Math.floor(unclaimedTotal)), 6)
        ).toFixed(5)} USDC`}
      </span>
    </div>
  );
}

export function ScholarshipCard({
  name,
  donor,
  payer,
  amountPerSec,
  totalReceived,
  startTimestamp,
  lastWithdrawTimestamp,
  unclaimedAmount,
  payContractId,
}: Omit<ScholarshipProps, "status" | "id">) {
  const account = useAccount();
  const queryClient = useQueryClient();
  const [resetTrigger, setResetTrigger] = useState(0);
  const { writeContract, data: txHash, isPending } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash: txHash,
  });

  const monthlyAmount = amountPerSec * 60 * 60 * 24 * 30;
  const formattedMonthlyAmount = `${parseFloat(
    formatUnits(BigInt(Math.floor(monthlyAmount)), 6)
  ).toFixed(2)} USDC`;

  const formattedTotalReceived = `${parseFloat(
    formatUnits(BigInt(totalReceived), 6)
  ).toFixed(2)} USDC`;

  const startDate = new Date(parseInt(startTimestamp) * 1000);
  const lastWithdrawDate = lastWithdrawTimestamp
    ? new Date(parseInt(lastWithdrawTimestamp) * 1000)
    : startDate;

  const nextPaymentDate = new Date(lastWithdrawDate);
  nextPaymentDate.setDate(nextPaymentDate.getDate() + 30);

  useEffect(() => {
    if (isSuccess) {
      queryClient.invalidateQueries({
        queryKey: ["awardeeStreams", account.address],
      });
      setResetTrigger((prev) => prev + 1);
      toast.success("Funds withdrawn successfully!");
    }
  }, [isSuccess, queryClient, account.address]);

  const handleWithdraw = async () => {
    if (!account.address) {
      toast.error("Please connect your wallet first");
      return;
    }

    try {
      writeContract({
        address: payContractId as `0x${string}`,
        abi: payContractAbi,
        functionName: "withdraw",
        args: [payer, account.address, BigInt(amountPerSec)],
      });
    } catch (error) {
      console.error("Error withdrawing funds:", error);
      toast.error("Failed to withdraw funds");
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{name}</CardTitle>
        <CardDescription>Provided by {donor}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">
              Monthly Amount:
            </span>
            <span>{formattedMonthlyAmount}</span>
          </div>

          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">
              Total Received:
            </span>
            <span>{formattedTotalReceived}</span>
          </div>

          <UnclaimedAmount
            initialAmount={unclaimedAmount}
            amountPerSec={amountPerSec}
            resetTrigger={resetTrigger}
          />
        </div>
      </CardContent>
      <CardFooter>
        <Button
          className="w-full"
          onClick={handleWithdraw}
          disabled={isPending || isConfirming}
        >
          {isPending || isConfirming ? "Withdrawing..." : "Withdraw Funds"}
        </Button>
      </CardFooter>
    </Card>
  );
}
