import Link from "next/link"
import { ArrowUpRight, Clock, Plus, Users, History } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

export default function DonorPage() {
  // Mock data for active scholarships
  const activeScholarships = [
    {
      id: 1,
      name: "Computer Science Excellence",
      totalAmount: "10,000 USDC",
      duration: "12 months",
      awardees: 5,
      remaining: "7,500 USDC",
    },
    {
      id: 2,
      name: "Engineering Futures",
      totalAmount: "15,000 USDC",
      duration: "24 months",
      awardees: 3,
      remaining: "12,000 USDC",
    },
  ]

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col space-y-8">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Donor Dashboard</h1>
          <Link href="/donor/create">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Create Scholarship
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Active Scholarships</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{activeScholarships.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Awardees</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">8</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Funded</CardTitle>
              <ArrowUpRight className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">25,000 USDC</div>
            </CardContent>
          </Card>
        </div>

        <div>
          <h2 className="mb-4 text-xl font-semibold">Active Scholarship Streams</h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {activeScholarships.map((scholarship) => (
              <Card key={scholarship.id}>
                <CardHeader>
                  <CardTitle>{scholarship.name}</CardTitle>
                  <CardDescription>
                    {scholarship.totalAmount} over {scholarship.duration}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Awardees:</span>
                      <span>{scholarship.awardees}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Remaining:</span>
                      <span>{scholarship.remaining}</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Link href={`/donor/manage-awardees?id=${scholarship.id}`}>
                    <Button variant="outline" size="sm">
                      Manage Awardees
                    </Button>
                  </Link>
                  <Link href={`/donor/manage-candidates?id=${scholarship.id}`}>
                    <Button variant="outline" size="sm">
                      Candidates
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>

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
            <div className="grid grid-cols-5 gap-4 p-4">
              <div className="text-sm">Mar 7, 2025</div>
              <div className="text-sm">Computer Science Excellence</div>
              <div className="text-sm">0x1a2b...3c4d</div>
              <div className="text-sm">250 USDC</div>
              <div className="text-sm text-green-500">Completed</div>
            </div>
            <div className="grid grid-cols-5 gap-4 p-4">
              <div className="text-sm">Mar 5, 2025</div>
              <div className="text-sm">Engineering Futures</div>
              <div className="text-sm">0x5e6f...7g8h</div>
              <div className="text-sm">500 USDC</div>
              <div className="text-sm text-green-500">Completed</div>
            </div>
            <div className="grid grid-cols-5 gap-4 p-4">
              <div className="text-sm">Mar 1, 2025</div>
              <div className="text-sm">Computer Science Excellence</div>
              <div className="text-sm">0x9i0j...1k2l</div>
              <div className="text-sm">250 USDC</div>
              <div className="text-sm text-green-500">Completed</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

