import Link from "next/link";
import { useEffect, useState, useRef } from "react";
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

// Scholarship data type
interface ScholarshipProps {
  id: number;
  name: string;
  donor: string; // Keep formatted donor name
  payer: string;
  amountPerSec: number;
  totalReceived: string; // Raw amount received as string
  startTimestamp: string;
  lastWithdrawTimestamp: string; 
  unclaimedAmount: number; // Raw unclaimed amount
  status: string;
}

// Helper function to calculate seconds elapsed
const calculateSecondsElapsed = (startTimeMs: number) => 
  Math.floor((Date.now() - startTimeMs) / 1000);

export function ScholarshipCard({
  name,
  donor,
  amountPerSec,
  totalReceived,
  startTimestamp, 
  lastWithdrawTimestamp,
  unclaimedAmount,
}: Omit<ScholarshipProps, "status" | "id" | "payer">) {
  // Format monthly amount (30 days)
  const monthlyAmount = amountPerSec * 60 * 60 * 24 * 30;
  const formattedMonthlyAmount = `${parseFloat(formatUnits(BigInt(Math.floor(monthlyAmount)), 18)).toFixed(2)} USDC`;
  
  // Format total received
  const formattedTotalReceived = `${parseFloat(formatUnits(BigInt(totalReceived), 18)).toFixed(2)} USDC`;
  
  // Calculate next payment date
  const startDate = new Date(parseInt(startTimestamp) * 1000);
  const lastWithdrawDate = lastWithdrawTimestamp ? 
    new Date(parseInt(lastWithdrawTimestamp) * 1000) : startDate;
  
  // Next payment is 30 days from last withdraw
  const nextPaymentDate = new Date(lastWithdrawDate);
  nextPaymentDate.setDate(nextPaymentDate.getDate() + 30);
  
  // Format next payment as relative time
  const nextPayment = formatDistanceToNow(nextPaymentDate, { addSuffix: true });
  
  // Track the display value for unclaimed amount
  const [displayUnclaimed, setDisplayUnclaimed] = useState(
    `${parseFloat(formatUnits(BigInt(Math.floor(unclaimedAmount)), 18)).toFixed(4)} USDC`
  );

  // Use a ref to track the mounting time to avoid recomputing elapsed time on re-renders
  const mountTimeRef = useRef(Date.now());

  // Only update the display, not the underlying data
  useEffect(() => {
    // Use a small delay before starting real-time updates to avoid immediate flicker
    const startDelay = setTimeout(() => {
      // Start interval for real-time updates
      const interval = setInterval(() => {
        // Calculate time since component mount in seconds instead of milliseconds
        const elapsedSeconds = calculateSecondsElapsed(mountTimeRef.current);
        // Use amount per second directly
        const additionalSinceMount = amountPerSec * elapsedSeconds;
        const currentAmount = unclaimedAmount + additionalSinceMount;

        // Format for display
        const formatted = `${parseFloat(
          formatUnits(BigInt(Math.floor(currentAmount)), 18)
        ).toFixed(4)} USDC`;
        setDisplayUnclaimed(formatted);
      }, 1000); // Update display every second for better performance

      return () => {
        clearInterval(interval);
      };
    }, 500); // Small delay before starting real-time updates

    return () => {
      clearTimeout(startDelay);
    };
  }, [amountPerSec, unclaimedAmount]);

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
              {displayUnclaimed}
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
