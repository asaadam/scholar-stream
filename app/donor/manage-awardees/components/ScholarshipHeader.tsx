import { Wallet } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Scholarship } from "@/lib/store";
import Link from "next/link";

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
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                onClick={onDepositClick}
                className="flex items-center gap-2"
              >
                <Wallet className="h-4 w-4" />
                Deposit Funds
              </Button>
              <Link href={`/donor/applicants`}>
                <Button variant="outline" size="sm">
                  Review Applicants
                </Button>
              </Link>
            </div>
          </div>
        </CardHeader>
      </Card>
    </>
  );
}
