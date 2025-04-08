import Link from "next/link";
import { useEffect, useState } from "react";
import { formatUnits } from "viem";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { formatDistanceToNow } from "date-fns";
import { calculateAmountPerMs } from "@/lib/utils/streamCalculations";

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
}

export function ScholarshipCard({
  name,
  donor,
  amountPerSec,
  totalReceived,
  startTimestamp,
  lastWithdrawTimestamp,
  unclaimedAmount,
}: Omit<ScholarshipProps, "status" | "id" | "payer">) {
  const monthlyAmount = amountPerSec * 60 * 60 * 24 * 30;
  const formattedMonthlyAmount = `${parseFloat(
    formatUnits(BigInt(Math.floor(monthlyAmount)), 18)
  ).toFixed(2)} USDC`;

  const formattedTotalReceived = `${parseFloat(
    formatUnits(BigInt(totalReceived), 18)
  ).toFixed(2)} USDC`;

  const startDate = new Date(parseInt(startTimestamp) * 1000);
  const lastWithdrawDate = lastWithdrawTimestamp
    ? new Date(parseInt(lastWithdrawTimestamp) * 1000)
    : startDate;

  const nextPaymentDate = new Date(lastWithdrawDate);
  nextPaymentDate.setDate(nextPaymentDate.getDate() + 30);

  const nextPayment = formatDistanceToNow(nextPaymentDate, { addSuffix: true });

  const [unclaimedTotal, setUnclaimedTotal] = useState(unclaimedAmount);

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

          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">
              Unclaimed Amount:
            </span>
            <span className="text-green-500 font-semibold">
              {`${parseFloat(
                formatUnits(BigInt(Math.floor(unclaimedTotal)), 18)
              ).toFixed(5)} USDC`}
            </span>
          </div>

          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">Next Payment:</span>
            <span>{nextPayment}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Link href="/awardee/withdraw" className="w-full">
          <Button className="w-full">Withdraw Funds</Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
