import { Trash2, UserCheck } from "lucide-react";
import { useAccount } from "wagmi";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useStreams } from "@/lib/hooks/useStreams";
import { Awardee, Stream, useStreamsStore } from "@/lib/store";

interface AwardeesTableProps {
  tokenSymbol: string;
  onToggleStatus: (awardee: Awardee) => void;
  onRemove: (awardee: Awardee) => void;
  formatAmountDisplay: (awardee: Awardee) => string;
  tokenDecimals: number;
}

function StreamRow({
  stream,
  tokenSymbol,
  onToggleStatus,
  onRemove,
  formatAmountDisplay,
  tokenDecimals,
}: {
  stream: Stream;
  tokenSymbol: string;
  onToggleStatus: (awardee: Awardee) => void;
  onRemove: (awardee: Awardee) => void;
  formatAmountDisplay: (awardee: Awardee) => string;
  tokenDecimals: number;
}) {
  const [currentAmount, setCurrentAmount] = useState(
    parseFloat(stream.amountReceived || "0")
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentAmount((prev) => {
        const amountPerSec = parseFloat(stream.amountPerSec);
        const amountPerMs = amountPerSec / 1000;
        return prev + amountPerMs;
      });
    }, 1);

    return () => clearInterval(interval);
  }, [stream.status, stream.amountPerSec, stream.amountReceived]);

  return (
    <TableRow key={stream.awardee}>
      <TableCell>{stream.name}</TableCell>
      <TableCell className="font-mono text-xs">
        {stream.awardee.slice(0, 6)}...{stream.awardee.slice(-4)}
      </TableCell>
      <TableCell>
        <div>
          <div className="font-medium">
            {(currentAmount / Math.pow(10, tokenDecimals)).toFixed(5)}{" "}
            {tokenSymbol}
          </div>
          <div className="text-sm text-muted-foreground">
            {formatAmountDisplay({
              id: stream.awardee,
              name: stream.name || "",
              wallet: stream.awardee,
              scholarshipId: "",
              amountPerSec: stream.amountPerSec,
              createdAt: Date.now(),
              status: stream.status,
            })}
          </div>
        </div>
      </TableCell>
      <TableCell>
        <span
          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
            stream.status === "Active"
              ? "bg-green-100 text-green-800"
              : "bg-yellow-100 text-yellow-800"
          }`}
        >
          {stream.status}
        </span>
      </TableCell>
      <TableCell>
        <div className="flex space-x-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() =>
              onToggleStatus({
                id: stream.awardee,
                name: stream.name || "",
                wallet: stream.awardee,
                scholarshipId: "",
                amountPerSec: stream.amountPerSec,
                createdAt: Date.now(),
                status: stream.status,
              })
            }
          >
            <UserCheck className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() =>
              onRemove({
                id: stream.awardee,
                name: stream.name || "",
                wallet: stream.awardee,
                scholarshipId: "",
                amountPerSec: stream.amountPerSec,
                createdAt: Date.now(),
                status: stream.status,
              })
            }
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
}

export function AwardeesTable({
  tokenSymbol,
  onToggleStatus,
  onRemove,
  formatAmountDisplay,
  tokenDecimals,
}: AwardeesTableProps) {
  const { address } = useAccount();
  const { isLoading, error } = useStreams();

  const streams = useStreamsStore.getState().getStreams(address || "");

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading awardees</div>;
  if (!streams || streams.length === 0) {
    return (
      <div className="rounded-md border border-dashed p-8 text-center">
        <h3 className="text-md font-medium text-muted-foreground">
          No Awardees Yet
        </h3>
        <p className="mt-2 text-sm text-muted-foreground">
          Use the &quot;Add Awardee&quot; button to start adding scholarship
          recipients.
        </p>
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Wallet Address</TableHead>
          <TableHead>Amount</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {streams.map((stream: Stream) => (
          <StreamRow
            key={stream.awardee}
            stream={stream}
            tokenSymbol={tokenSymbol}
            onToggleStatus={onToggleStatus}
            onRemove={onRemove}
            formatAmountDisplay={formatAmountDisplay}
            tokenDecimals={tokenDecimals}
          />
        ))}
      </TableBody>
    </Table>
  );
}
