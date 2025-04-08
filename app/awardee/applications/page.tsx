"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  useApplicationStore,
  ApplicationData,
} from "@/app/store/applicationStore";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAccount } from "wagmi";

export default function ApplicationsPage() {
  const [applications, setApplications] = useState<ApplicationData[]>([]);
  const getApplications = useApplicationStore((state) => state.getApplications);
  const clearApplications = useApplicationStore(
    (state) => state.clearApplications
  );
  const { address } = useAccount();

  // Load applications from store on component mount and filter by current wallet address
  useEffect(() => {
    if (address) {
      const allApplications = getApplications();
      const userApplications = allApplications.filter(
        (app) =>
          app.personalInfo.walletAddress.toLowerCase() === address.toLowerCase()
      );
      console.log(allApplications);
      setApplications(userApplications);
    } else {
      setApplications([]);
    }
  }, [getApplications, address]);

  // Handle clearing only the current user's applications
  const handleClearApplications = () => {
    if (address) {
      // Get all applications
      const allApplications = getApplications();
      // Filter out current user's applications
      const otherApplications = allApplications.filter(
        (app) =>
          app.personalInfo.walletAddress.toLowerCase() !== address.toLowerCase()
      );

      // Clear all and re-add the ones we want to keep
      clearApplications();
      otherApplications.forEach((app) => {
        useApplicationStore.getState().submitApplication(app);
      });

      // Update local state
      setApplications([]);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mx-auto max-w-4xl">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <Link href="/awardee">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Dashboard
              </Button>
            </Link>
          </div>
          {applications.length > 0 && address && (
            <Button
              variant="destructive"
              size="sm"
              onClick={handleClearApplications}
            >
              Clear My Applications
            </Button>
          )}
        </div>

        <div className="mb-8">
          <h1 className="text-3xl font-bold">Your Applications</h1>
          <p className="text-muted-foreground mt-2">
            View and manage all your scholarship applications
          </p>
        </div>

        {!address ? (
          <Card>
            <CardContent className="pt-6 pb-6 text-center">
              <p className="mb-4">
                Please connect your wallet to view your applications.
              </p>
            </CardContent>
          </Card>
        ) : applications.length === 0 ? (
          <Card>
            <CardContent className="pt-6 pb-6 text-center">
              <p className="mb-4">
                You haven&apos;t submitted any applications yet.
              </p>
              <Link href="/awardee/browse">
                <Button>Browse Scholarships</Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {applications.map((application, index) => (
              <ApplicationCard key={index} application={application} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function ApplicationCard({ application }: { application: ApplicationData }) {
  const submittedDate = new Date(application.submittedAt);
  const formattedDate = submittedDate.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle>{application.scholarshipTitle}</CardTitle>
            <CardDescription>{application.organizationName}</CardDescription>
          </div>
          <Badge className="ml-auto">Submitted</Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <h3 className="font-medium mb-2">Personal Information</h3>
            <ul className="space-y-1 text-sm">
              <li>
                <span className="text-muted-foreground">Name:</span>{" "}
                {application.personalInfo.firstName}{" "}
                {application.personalInfo.lastName}
              </li>
              <li>
                <span className="text-muted-foreground">Email:</span>{" "}
                {application.personalInfo.email}
              </li>
              <li>
                <span className="text-muted-foreground">Wallet:</span>{" "}
                <span className="font-mono text-xs">
                  {application.personalInfo.walletAddress}
                </span>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-medium mb-2">Academic Information</h3>
            <ul className="space-y-1 text-sm">
              <li>
                <span className="text-muted-foreground">University:</span>{" "}
                {application.academicInfo.university}
              </li>
              <li>
                <span className="text-muted-foreground">Major:</span>{" "}
                {application.academicInfo.major}
              </li>
              <li>
                <span className="text-muted-foreground">GPA:</span>{" "}
                {application.academicInfo.gpa}
              </li>
              <li>
                <span className="text-muted-foreground">Year:</span>{" "}
                {application.academicInfo.yearOfStudy}
              </li>
            </ul>
          </div>
        </div>
      </CardContent>
      <CardFooter className="border-t pt-4 text-xs text-muted-foreground">
        Submitted on {formattedDate}
      </CardFooter>
    </Card>
  );
}
