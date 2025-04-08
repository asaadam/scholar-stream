import { useQuery } from "@tanstack/react-query";
import { useAccount } from "wagmi";
import { calculateStreamAmount } from "@/lib/utils/streamCalculations";
import { formatUnits } from "viem";
import { formatDistanceToNow } from "date-fns";

interface Stream {
  payer: string;
  status: "Active" | "Paused";
  amountPerSec: string;
  amountReceived: string;
  startTimestamp: string;
  lastWithdrawTimestamp: string;
}

interface StreamsResponse {
  data: {
    streams: {
      items: Stream[];
    };
  };
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
  startTimestamp: string;
  lastWithdrawTimestamp: string;
  amountReceived: string;
}

export interface Transaction {
  date: string;
  scholarship: string;
  amount: string;
  status: string;
}

const AWARDEE_STREAMS_QUERY = `
  query GetAwardeeStreams($awardee: String!) {
    streams(where:{
      awardee: $awardee
    }){
      items{
        payer
        status
        amountPerSec
        amountReceived
        startTimestamp
        lastWithdrawTimestamp
      }
    }
  }
`;

export function useAwardeeStreams() {
  const { address } = useAccount();

  const query = useQuery<StreamsResponse>({
    queryKey: ["awardeeStreams", address],
    queryFn: async () => {
      const response = await fetch(process.env.NEXT_PUBLIC_SUBGRAPH_URL || "", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query: AWARDEE_STREAMS_QUERY,
          variables: {
            awardee: address,
          },
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch awardee streams");
      }

      return response.json();
    },
    enabled: !!address,
  });

  // Calculate the unclaimed amount for each stream
  const streams = query.data?.data?.streams?.items.map((stream) => {
    const totalAmount = calculateStreamAmount({
      startTimestamp: stream.startTimestamp,
      amountPerSec: stream.amountPerSec,
      amountReceived: stream.amountReceived,
    });

    const unclaimedAmount = totalAmount - parseFloat(stream.amountReceived);

    return {
      ...stream,
      totalAmount,
      unclaimedAmount,
    };
  }) || [];

  // Format streams into scholarships for UI display
  const scholarships: FormattedScholarship[] = streams.map((stream, index) => {
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
      unclaimedAmount: formattedUnclaimed,
      status: stream.status,
      amountPerSec: amountPerSecond,
      baseUnclaimedAmount: stream.unclaimedAmount,
      startTimestamp: stream.startTimestamp,
      lastWithdrawTimestamp: stream.lastWithdrawTimestamp,
      amountReceived: stream.amountReceived,
    };
  });

  // Format transactions data
  const transactions: Transaction[] = streams.map((stream) => {
    const startDate = new Date(parseInt(stream.startTimestamp) * 1000);
    return {
      date: startDate.toLocaleDateString(),
      scholarship: `Scholarship from ${stream.payer.slice(0, 6)}...`,
      amount: `${parseFloat(formatUnits(BigInt(stream.amountReceived), 18)).toFixed(2)} USDC`,
      status: "Received"
    };
  });

  return {
    ...query,
    streams,
    scholarships,
    transactions,
    isLoading: query.isLoading
  };
} 