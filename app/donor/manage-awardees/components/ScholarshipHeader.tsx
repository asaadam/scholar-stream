import { ArrowLeft, Wallet } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Scholarship } from "@/lib/store";

interface ScholarshipHeaderProps {
  scholarship: Scholarship;
  tokenSymbol: string;
  onDepositClick: () => void;
}

export function ScholarshipHeader({
  scholarship,
  tokenSymbol,
  onDepositClick,
}: ScholarshipHeaderProps) {
  return (
    <>
      <div className="mb-6 flex items-center">
        <Link href="/donor">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Manage Awardees</CardTitle>
              <CardDescription>
                {scholarship.name} - {scholarship.amount} {tokenSymbol} over{" "}
                {scholarship.duration} months
              </CardDescription>
            </div>
            <Button
              variant="outline"
              onClick={onDepositClick}
              className="flex items-center gap-2"
            >
              <Wallet className="h-4 w-4" />
              Deposit Funds
            </Button>
          </div>
        </CardHeader>
      </Card>
    </>
  );
} 