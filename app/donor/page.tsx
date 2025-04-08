"use client";

import Link from "next/link";
import { ArrowUpRight, Clock, Plus, Users, History } from "lucide-react";
import { useAccount } from "wagmi";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useScholarshipStore, Scholarship } from "@/lib/store";
import { useEffect, useState } from "react";

export default function DonorPage() {
  const account = useAccount();
  const hasActiveScholarship = useScholarshipStore(
    (state) => state.hasActiveScholarship
  );

  const [activeScholarship, setActiveScholarship] =
    useState<Scholarship | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load scholarship data when account is available
  useEffect(() => {
    const hardcodedScholarship: Scholarship = {
      id: "scholarship-123",
      name: "Hardcoded Scholarship",
      description: "A hardcoded scholarship for demonstration purposes",
      amount: "10000",
      duration: "12",
      maxAwardees: "10",
      tokenAddress: "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174", // Example USDC on Polygon
      tokenSymbol: "USDC",
      payContractAddress: "0x1234567890123456789012345678901234567890", // Example address
      createdAt: new Date().getTime(),
      streamRate: "0.1", // Added missing required property
      isActive: true, // Added missing required property
      donorAddress: account.address, // Optional but useful
    };

    if (account.address) {
      setActiveScholarship(hardcodedScholarship);
      setIsLoaded(true);
    }
  }, [account.address]);

  // Mock data for transactions
  const recentTransactions = [
    {
      date: "Mar 7, 2025",
      scholarship: "Computer Science Excellence",
      recipient: "0x1a2b...3c4d",
      amount: "250 USDC",
      status: "Completed",
    },
    {
      date: "Mar 5, 2025",
      scholarship: "Engineering Futures",
      recipient: "0x5e6f...7g8h",
      amount: "500 USDC",
      status: "Completed",
    },
    {
      date: "Mar 1, 2025",
      scholarship: "Computer Science Excellence",
      recipient: "0x9i0j...1k2l",
      amount: "250 USDC",
      status: "Completed",
    },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col space-y-8">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Donor Dashboard</h1>

          {(!isLoaded || !hasActiveScholarship(account.address || "")) && (
            <Link href="/donor/create">
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Create Scholarship
              </Button>
            </Link>
          )}
        </div>

        {!account.address ? (
          <div className="rounded-md bg-yellow-50 p-4 border border-yellow-200">
            <h3 className="text-sm font-medium text-yellow-800">
              Connect your wallet
            </h3>
            <div className="mt-2 text-sm text-yellow-700">
              Please connect your wallet to manage your scholarship.
            </div>
          </div>
        ) : !isLoaded ? (
          <div>Loading scholarship data...</div>
        ) : !activeScholarship ? (
          <div className="rounded-md bg-blue-50 p-4 border border-blue-200">
            <h3 className="text-sm font-medium text-blue-800">
              No active scholarship
            </h3>
            <div className="mt-2 text-sm text-blue-700">
              You don&apos;t have an active scholarship. Create one to start
              funding students.
            </div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">
                    Active Scholarship
                  </CardTitle>
                  <Clock className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">1</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">
                    Total Awardees
                  </CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">0</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">
                    Total Funded
                  </CardTitle>
                  <ArrowUpRight className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {activeScholarship.amount} {activeScholarship.tokenSymbol}
                  </div>
                </CardContent>
              </Card>
            </div>

            <div>
              <h2 className="mb-4 text-xl font-semibold">
                Active Scholarship Stream
              </h2>
              <div className="grid grid-cols-1">
                <Card key={activeScholarship.id}>
                  <CardHeader>
                    <CardTitle>{activeScholarship.name}</CardTitle>
                    <CardDescription>
                      {activeScholarship.amount} {activeScholarship.tokenSymbol}{" "}
                      over {activeScholarship.duration} months
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">
                          Max Awardees:
                        </span>
                        <span>{activeScholarship.maxAwardees}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">
                          Current Awardees:
                        </span>
                        <span>0</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">
                          Stream Rate:
                        </span>
                        <span>
                          {activeScholarship.streamRate}{" "}
                          {activeScholarship.tokenSymbol}/month
                        </span>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Link
                      href={`/donor/manage-awardees?id=${activeScholarship.id}`}
                    >
                      <Button variant="outline" size="sm">
                        Manage Awardees
                      </Button>
                    </Link>
                    <Link
                      href={`/donor/applicants`}
                    >
                      <Button variant="outline" size="sm">
                        Review Applicants
                      </Button>
                    </Link>
                    <Link
                      href={`/donor/manage-candidates?id=${activeScholarship.id}`}
                    >
                      <Button variant="outline" size="sm">
                        Candidates
                      </Button>
                    </Link>
                  </CardFooter>
                </Card>
              </div>
            </div>
          </>
        )}

        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Recent Transactions</h2>
          <Link href="/donor/transactions">
            <Button variant="ghost" size="sm">
              View All
              <History className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>

        <div className="rounded-lg border">
          <div className="grid grid-cols-5 gap-4 p-4 font-medium">
            <div>Date</div>
            <div>Scholarship</div>
            <div>Recipient</div>
            <div>Amount</div>
            <div>Status</div>
          </div>
          <div className="divide-y">
            {recentTransactions.map((transaction, index) => (
              <div key={index} className="grid grid-cols-5 gap-4 p-4">
                <div className="text-sm">{transaction.date}</div>
                <div className="text-sm">{transaction.scholarship}</div>
                <div className="text-sm">{transaction.recipient}</div>
                <div className="text-sm">{transaction.amount}</div>
                <div className="text-sm text-green-500">
                  {transaction.status}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
