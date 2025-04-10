"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  useApplicationStore,
  ApplicationData,
} from "@/app/store/applicationStore";
import { ArrowLeft, UserCheck } from "lucide-react";
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
import { AddAwardeeModal } from "@/components/AddAwardeeModal";
import { useAccount } from "wagmi";
import { useScholarshipStore, Scholarship } from "@/lib/store";

export default function ApplicantsPage() {
  const [applications, setApplications] = useState<ApplicationData[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedApplicant, setSelectedApplicant] =
    useState<ApplicationData | null>(null);
  const getApplications = useApplicationStore((state) => state.getApplications);
  const { address } = useAccount();
  const getScholarships = useScholarshipStore((state) => state.getScholarships);

  // Load applications from store on component mount and filter by donor's scholarships
  useEffect(() => {
    if (address) {
      // Get all applications
      const allApplications = getApplications();

      // Get scholarships owned by the donor
      const donorScholarships = getScholarships().filter(
        (scholarship: Scholarship) => scholarship.donorAddress === address
      );

      // Get scholarship IDs owned by the donor
      const donorScholarshipIds = donorScholarships.map(
        (s: Scholarship) => s.id
      );

      // For demo purposes, if no scholarships are found, show all applications
      // In production, you'd want to be more restrictive
      if (donorScholarshipIds.length === 0) {
        setApplications(allApplications);
        return;
      }

      // Filter applications by scholarshipId that matches donor's scholarships
      // Note: In our current implementation, applications don't have a direct link to scholarshipId
      // For demonstration, we're showing all applications
      // In a real implementation, you'd filter: app => donorScholarshipIds.includes(app.scholarshipId)
      setApplications(allApplications);
    } else {
      setApplications([]);
    }
  }, [getApplications, getScholarships, address]);

  const handleApproveApplicant = (application: ApplicationData) => {
    setSelectedApplicant(application);
    setIsModalOpen(true);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mx-auto max-w-4xl">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <Link href="/donor/manage-awardees">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Dashboard
              </Button>
            </Link>
          </div>
        </div>

        <div className="mb-8">
          <h1 className="text-3xl font-bold">Applicants</h1>
          <p className="text-muted-foreground mt-2">
            Review and approve scholarship applicants
          </p>
        </div>

        {!address ? (
          <Card>
            <CardContent className="pt-6 pb-6 text-center">
              <p className="mb-4">
                Please connect your wallet to view scholarship applications.
              </p>
            </CardContent>
          </Card>
        ) : applications.length === 0 ? (
          <Card>
            <CardContent className="pt-6 pb-6 text-center">
              <p className="mb-4">
                No scholarship applications have been submitted yet.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {applications.map((application, index) => (
              <ApplicantCard
                key={index}
                application={application}
                onApprove={() => handleApproveApplicant(application)}
              />
            ))}
          </div>
        )}
      </div>

      {/* AddAwardeeModal with pre-populated data */}
      {selectedApplicant && (
        <AddAwardeeModal
          open={isModalOpen}
          onOpenChange={setIsModalOpen}
          scholarshipId={selectedApplicant.scholarshipId}
          // We need to pass only the props that AddAwardeeModal actually accepts
          tokenAddress={undefined}
          tokenSymbol={undefined}
          payContractAddress={undefined}
          // We'll manually set the values in useEffect inside AddAwardeeModal
        />
      )}
    </div>
  );
}

interface ApplicantCardProps {
  application: ApplicationData;
  onApprove: () => void;
}

function ApplicantCard({ application, onApprove }: ApplicantCardProps) {
  const submittedDate = new Date(application.submittedAt);
  const formattedDate = submittedDate.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const { address } = useAccount();

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle>{application.scholarshipTitle}</CardTitle>
            <CardDescription>
              {application.personalInfo.firstName}{" "}
              {application.personalInfo.lastName} •{" "}
              {application.academicInfo.university}
            </CardDescription>
          </div>
          <Badge className="ml-auto" variant="outline">
            Pending Review
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <h3 className="font-medium mb-2">Applicant Details</h3>
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
              <li>
                <span className="text-muted-foreground">Open Campus Id:</span>{" "}
                {"adam.edu"}
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

        <div className="mt-4">
          <h3 className="font-medium mb-2">Statement of Purpose</h3>
          <p className="text-sm text-muted-foreground">
            {application.statementOfPurpose.length > 200
              ? `${application.statementOfPurpose.substring(0, 200)}...`
              : application.statementOfPurpose}
          </p>
        </div>
      </CardContent>
      <CardFooter className="border-t pt-4 flex justify-between items-center">
        <span className="text-xs text-muted-foreground">
          Submitted on {formattedDate}
        </span>
        <div className="flex gap-2">
          {address ? (
            <Button variant="outline" size="sm" onClick={onApprove}>
              <UserCheck className="mr-2 h-4 w-4" />
              Approve
            </Button>
          ) : (
            <Button variant="outline" size="sm" onClick={() => {}}>
              Connect Wallet to Approve
            </Button>
          )}
        </div>
      </CardFooter>
    </Card>
  );
}
