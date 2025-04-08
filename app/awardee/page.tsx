"use client";

import { Clock } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAwardeeStreams } from "@/lib/hooks/useAwardeeStreams";
import { ScholarshipList } from "../components/ScholarshipList";
import { TransactionsList } from "../components/TransactionsList";

export default function AwardeePage() {
  const { scholarships, transactions, isLoading } = useAwardeeStreams();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col space-y-8">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Awardee Dashboard</h1>
          <div className="flex gap-2">
            <Link href="/awardee/applications">
              <Button variant="outline">My Applications</Button>
            </Link>
            <Link href="/awardee/browse">
              <Button variant="outline">Browse Scholarships</Button>
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                Active Scholarships
              </CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {isLoading ? "Loading..." : scholarships.length}
              </div>
            </CardContent>
          </Card>
        </div>

        <div>
          <h2 className="mb-4 text-xl font-semibold">Your Scholarships</h2>
          <ScholarshipList scholarships={scholarships} isLoading={isLoading} />
        </div>

        <TransactionsList transactions={transactions} isLoading={isLoading} />
      </div>
    </div>
  );
}
