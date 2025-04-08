import { useEffect, useState } from "react";
import { formatUnits } from "viem";
import { formatDistanceToNow } from "date-fns";

interface StreamData {
  payer: string;
  status: string;
  amountPerSec: string;
  amountReceived: string;
  startTimestamp: string;
  lastWithdrawTimestamp: string;
  totalAmount: number;
  unclaimedAmount: number;
}

export interface FormattedScholarship {
  id: number;
  name: string;
  donor: string;
  payer: string;
  monthlyAmount: string;
  nextPayment: string;
  totalReceived: string;
  unclaimedAmount: string;
  status: string;
  amountPerSec: number;
  baseUnclaimedAmount: number;
}

export function useScholarshipData(streams: StreamData[] | null) {
  const [scholarships, setScholarships] = useState<FormattedScholarship[]>([]);
  
  useEffect(() => {
    if (!streams || streams.length === 0) {
      setScholarships([]);
      return;
    }
    
    // Format scholarships - this should only happen when streams data changes from the API
    const formatted = streams.map((stream: StreamData, index: number) => {
      // Calculate monthly amount (30 days)
      const amountPerSecond = parseFloat(stream.amountPerSec);
      const monthlyAmount = amountPerSecond * 60 * 60 * 24 * 30;
      
      // Format amounts with 18 decimals for USDC
      const formattedMonthlyAmount = `${parseFloat(formatUnits(BigInt(Math.floor(monthlyAmount)), 18)).toFixed(2)} USDC`;
      const formattedTotalReceived = `${parseFloat(formatUnits(BigInt(stream.amountReceived), 18)).toFixed(2)} USDC`;
      const formattedUnclaimed = `${parseFloat(formatUnits(BigInt(Math.floor(stream.unclaimedAmount)), 18)).toFixed(4)} USDC`;
      
      // Get next payment date (withdraw happens every 30 days from start)
      const startDate = new Date(parseInt(stream.startTimestamp) * 1000);
      const lastWithdrawDate = stream.lastWithdrawTimestamp ? 
        new Date(parseInt(stream.lastWithdrawTimestamp) * 1000) : startDate;
      
      // Next payment is 30 days from last withdraw
      const nextPaymentDate = new Date(lastWithdrawDate);
      nextPaymentDate.setDate(nextPaymentDate.getDate() + 30);
      
      // Format next payment as relative time
      const nextPayment = formatDistanceToNow(nextPaymentDate, { addSuffix: true });
      
      return {
        id: index + 1,
        name: `Scholarship #${index + 1}`,
        donor: stream.payer.slice(0, 6) + "..." + stream.payer.slice(-4),
        payer: stream.payer,
        monthlyAmount: formattedMonthlyAmount,
        nextPayment,
        totalReceived: formattedTotalReceived,
        unclaimedAmount: formattedUnclaimed, // This is the static value from the API
        status: stream.status,
        amountPerSec: amountPerSecond,
        baseUnclaimedAmount: stream.unclaimedAmount, // Raw value for real-time calculation in the card
      };
    });
    
    // Set the scholarships only once when the API data changes
    setScholarships(formatted);
  }, [streams]); // Only update when streams data changes from the API
  
  return { scholarships };
} 