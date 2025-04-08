import Link from "next/link";
import { ArrowRight, GraduationCap, Users } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex flex-col items-center justify-center space-y-8 text-center">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
          Scholarship Stream
        </h1>
        <p className="max-w-[600px] text-lg text-muted-foreground">
          A decentralized platform for creating and managing scholarship streams
          using stablecoins.
        </p>

        <div className="grid w-full max-w-4xl grid-cols-1 gap-6 md:grid-cols-2 lg:gap-8">
          <Card className="flex flex-col">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Donor Portal
              </CardTitle>
              <CardDescription>
                Create and manage scholarship streams for students
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-1">
              <ul className="list-inside list-disc space-y-2 text-left">
                <li>Create scholarship streams with stablecoins</li>
                <li>Manage awardees and their payments</li>
                <li>Review and approve scholarship candidates</li>
                <li>Track all transaction history</li>
              </ul>
            </CardContent>
            <CardFooter>
              <Link href="/donor/manage-awardees" className="w-full">
                <Button className="w-full cursor-pointer">
                  Enter Donor Portal
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </CardFooter>
          </Card>

          <Card className="flex flex-col">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <GraduationCap className="h-5 w-5" />
                Awardee Portal
              </CardTitle>
              <CardDescription>
                Apply for and manage your scholarship funds
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-1">
              <ul className="list-inside list-disc space-y-2 text-left">
                <li>Apply for available scholarships</li>
                <li>Withdraw your scholarship funds</li>
                <li>Track your scholarship payment history</li>
                <li>Manage your profile and credentials</li>
              </ul>
            </CardContent>
            <CardFooter>
              <Link href="/awardee" className="w-full">
                <Button className="w-full cursor-pointer" variant="outline">
                  Enter Awardee Portal
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
