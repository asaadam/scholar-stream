import { Clock, History } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function AwardeePage() {
  // Mock data for scholarships
  const scholarships = [
    {
      id: 1,
      name: "Computer Science Excellence",
      donor: "Tech Foundation",
      monthlyAmount: "250 USDC",
      nextPayment: "Apr 7, 2025",
      totalReceived: "750 USDC",
    },
  ];

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
              <div className="text-2xl font-bold">{scholarships.length}</div>
            </CardContent>
          </Card>

          {/* <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                Total Redeemed
              </CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">750 USDC</div>
            </CardContent>
          </Card> */}
        </div>

        <div>
          <h2 className="mb-4 text-xl font-semibold">Your Scholarships</h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {scholarships.map((scholarship) => (
              <Card key={scholarship.id}>
                <CardHeader>
                  <CardTitle>{scholarship.name}</CardTitle>
                  <CardDescription>
                    Provided by {scholarship.donor}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">
                        Monthly Amount:
                      </span>
                      <span>{scholarship.monthlyAmount}</span>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">
                        Total Received:
                      </span>
                      <span>{scholarship.totalReceived}</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Link href="/awardee/withdraw" className="w-full">
                    <Button className="w-full">Withdraw Funds</Button>
                  </Link>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Recent Transactions</h2>
          <Link href="/awardee/transactions">
            <Button variant="ghost" size="sm">
              View All
              <History className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>

        <div className="rounded-lg border">
          <div className="grid grid-cols-4 gap-4 p-4 font-medium">
            <div>Date</div>
            <div>Scholarship</div>
            <div>Amount</div>
            <div>Status</div>
          </div>
          <div className="divide-y">
            <div className="grid grid-cols-4 gap-4 p-4">
              <div className="text-sm">Mar 7, 2025</div>
              <div className="text-sm">Computer Science Excellence</div>
              <div className="text-sm">250 USDC</div>
              <div className="text-sm text-green-500">Received</div>
            </div>
            <div className="grid grid-cols-4 gap-4 p-4">
              <div className="text-sm">Feb 7, 2025</div>
              <div className="text-sm">Computer Science Excellence</div>
              <div className="text-sm">250 USDC</div>
              <div className="text-sm text-green-500">Received</div>
            </div>
            <div className="grid grid-cols-4 gap-4 p-4">
              <div className="text-sm">Jan 7, 2025</div>
              <div className="text-sm">Computer Science Excellence</div>
              <div className="text-sm">250 USDC</div>
              <div className="text-sm text-green-500">Received</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
