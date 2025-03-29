import { Trash2, UserCheck } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Awardee } from "@/lib/store";

interface AwardeesTableProps {
  awardees: Awardee[];
  tokenSymbol: string;
  onToggleStatus: (awardee: Awardee) => void;
  onRemove: (awardee: Awardee) => void;
  formatAmountDisplay: (awardee: Awardee) => string;
}

export function AwardeesTable({
  awardees,
  onToggleStatus,
  onRemove,
  formatAmountDisplay,
}: AwardeesTableProps) {
  if (awardees.length === 0) {
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
        {awardees.map((awardee) => (
          <TableRow key={awardee.id}>
            <TableCell>{awardee.name}</TableCell>
            <TableCell className="font-mono text-xs">
              {awardee.wallet.slice(0, 6)}...{awardee.wallet.slice(-4)}
            </TableCell>
            <TableCell>{formatAmountDisplay(awardee)}</TableCell>
            <TableCell>
              <span
                className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                  awardee.status === "Active"
                    ? "bg-green-100 text-green-800"
                    : "bg-yellow-100 text-yellow-800"
                }`}
              >
                {awardee.status}
              </span>
            </TableCell>
            <TableCell>
              <div className="flex space-x-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onToggleStatus(awardee)}
                >
                  <UserCheck className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onRemove(awardee)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
} 