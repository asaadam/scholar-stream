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

// Scholarship data type
interface ScholarshipProps {
  id: number;
  name: string;
  donor: string;
  monthlyAmount: string;
  nextPayment: string;
  totalReceived: string;
  unclaimedAmount: string; // Static value from API
  status: string;
  amountPerSec: number;
  baseUnclaimedAmount: number;
}

// Helper function to calculate seconds elapsed
const calculateSecondsElapsed = (startTimeMs: number) => 
  Math.floor((Date.now() - startTimeMs) / 1000);

export function ScholarshipCard({
  name,
  donor,
  monthlyAmount,
  nextPayment,
  totalReceived,
  unclaimedAmount,
  amountPerSec,
  baseUnclaimedAmount,
}: Omit<ScholarshipProps, "status" | "id">) {
  // Track the display value for unclaimed amount
  const [displayUnclaimed, setDisplayUnclaimed] = useState(unclaimedAmount);

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
        const currentAmount = baseUnclaimedAmount + additionalSinceMount;

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
  }, [amountPerSec, baseUnclaimedAmount]);

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
            <span>{monthlyAmount}</span>
          </div>

          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">
              Total Received:
            </span>
            <span>{totalReceived}</span>
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
