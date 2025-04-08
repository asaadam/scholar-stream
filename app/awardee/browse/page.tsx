"use client";

import { useState } from "react";
import { Bookmark, Share2, MoreVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Scholarship, scholarships } from "../types";

export default function ScholarshipListing() {
  const [selectedScholarship, setSelectedScholarship] =
    useState<Scholarship | null>(null);

  return (
    <div className="container mx-auto max-w-7xl px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">
          Available Scholarships
        </h1>
        <p className="text-muted-foreground mt-2">
          Browse and apply for scholarships that match your profile
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {scholarships.map((scholarship) => (
            <ScholarshipCard
              key={scholarship.id}
              scholarship={scholarship}
              onSelect={() => setSelectedScholarship(scholarship)}
              isSelected={selectedScholarship?.id === scholarship.id}
            />
          ))}
        </div>

        <div className="lg:col-span-1">
          {selectedScholarship ? (
            <ScholarshipDetails scholarship={selectedScholarship} />
          ) : (
            <div className="rounded-lg border border-border bg-card p-6 text-center">
              <p className="text-muted-foreground">
                Select a scholarship to view details
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

interface ScholarshipCardProps {
  scholarship: Scholarship;
  onSelect: () => void;
  isSelected: boolean;
}

function ScholarshipCard({
  scholarship,
  onSelect,
  isSelected,
}: ScholarshipCardProps) {
  return (
    <div
      className={`rounded-lg p-6 cursor-pointer transition-all ${
        isSelected ? "border-2 border-primary" : "border border-border"
      } bg-card hover:bg-accent/50`}
      onClick={onSelect}
    >
      <div className="flex justify-between items-start mb-4">
        <h2 className="text-xl font-bold text-foreground">
          {scholarship.title}
        </h2>
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">
            {scholarship.postedTime}
          </span>
          <button className="text-muted-foreground hover:text-foreground">
            <Bookmark size={20} />
          </button>
        </div>
      </div>

      <div className="flex flex-wrap gap-3 mb-4">
        {scholarship.type.includes("Senior") && (
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <Badge variant="outline" className="rounded-sm border-border">
              <span className="mr-1">👤</span> Senior
            </Badge>
          </div>
        )}

        {scholarship.type.includes("Remote") && (
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <Badge variant="outline" className="rounded-sm border-border">
              <span className="mr-1">🌐</span> Remote
            </Badge>
          </div>
        )}

        {scholarship.type.includes("Full Time") && (
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <Badge variant="outline" className="rounded-sm border-border">
              <span className="mr-1">⏱️</span> Full Time
            </Badge>
          </div>
        )}

        {scholarship.type.some(
          (type) =>
            type.includes("Design") ||
            type.includes("Sales") ||
            type.includes("Growth") ||
            type.includes("Devel")
        ) && (
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <Badge variant="outline" className="rounded-sm border-border">
              <span className="mr-1">📊</span>{" "}
              {scholarship.type.find(
                (type) =>
                  type.includes("Design") ||
                  type.includes("Sales") ||
                  type.includes("Growth") ||
                  type.includes("Devel")
              )}
            </Badge>
          </div>
        )}

        {scholarship.isTopScholarship && (
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <Badge
              variant="outline"
              className="rounded-sm border-none bg-gradient-to-r from-primary to-primary/80 text-primary-foreground"
            >
              <span className="mr-1">🚀</span> Top Scholarship
            </Badge>
          </div>
        )}
      </div>

      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-full overflow-hidden bg-muted flex items-center justify-center">
          <Image
            src={scholarship.organization.logo || "/placeholder.svg"}
            alt={scholarship.organization.name}
            width={40}
            height={40}
            className="object-cover"
          />
        </div>
        <span className="font-medium text-foreground">
          {scholarship.organization.name}
        </span>

        {scholarship.fundingAmount && (
          <div className="ml-auto flex items-center gap-1 text-sm text-muted-foreground">
            <span>Last Funding: {scholarship.fundingAmount}</span>
            <span className="text-xs bg-muted rounded-full w-4 h-4 flex items-center justify-center">
              ℹ️
            </span>
          </div>
        )}
      </div>

      {scholarship.fundingDate && (
        <div className="flex items-center gap-1 text-sm text-muted-foreground mb-6">
          <span>Funding Date: {scholarship.fundingDate}</span>
          <span className="text-xs bg-muted rounded-full w-4 h-4 flex items-center justify-center">
            ℹ️
          </span>
        </div>
      )}

      {scholarship.employees && (
        <div className="flex items-center gap-1 text-sm text-muted-foreground mb-6">
          <span>Employees: {scholarship.employees}</span>
        </div>
      )}

      <div className="flex flex-wrap gap-2">
        {scholarship.tags.map((tag, index) => (
          <Badge
            key={index}
            className="uppercase text-xs py-1 px-3"
            style={{
              backgroundColor: getTagColor(tag).bg,
              color: getTagColor(tag).text,
              borderColor: getTagColor(tag).border,
            }}
          >
            {tag}
          </Badge>
        ))}
      </div>
    </div>
  );
}

function ScholarshipDetails({ scholarship }: { scholarship: Scholarship }) {
  return (
    <div className="rounded-lg border border-primary overflow-hidden sticky top-4">
      <Tabs defaultValue="details">
        <div className="bg-card px-4 py-2">
          <TabsList className="grid w-full grid-cols-2 bg-transparent">
            <TabsTrigger
              value="details"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-md"
            >
              Scholarship Details
            </TabsTrigger>
            <TabsTrigger
              value="organization"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-md"
            >
              Organization
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="details" className="p-0 m-0">
          <div className="p-6">
            <div className="flex justify-between items-start mb-6">
              <h2 className="text-2xl font-bold text-foreground">
                {scholarship.title}
              </h2>
              <div className="flex items-center gap-2">
                <button className="text-muted-foreground hover:text-foreground">
                  <Share2 size={20} />
                </button>
                <button className="text-muted-foreground hover:text-foreground">
                  <MoreVertical size={20} />
                </button>
              </div>
            </div>

            <div className="flex flex-wrap gap-3 mb-6">
              {scholarship.type.includes("Senior") && (
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Badge variant="outline" className="rounded-sm border-border">
                    <span className="mr-1">👤</span> Senior
                  </Badge>
                </div>
              )}

              {scholarship.type.includes("Remote") && (
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Badge variant="outline" className="rounded-sm border-border">
                    <span className="mr-1">🌐</span> Remote
                  </Badge>
                </div>
              )}

              {scholarship.type.includes("European Region") && (
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Badge variant="outline" className="rounded-sm border-border">
                    <span className="mr-1">🌍</span> European Region
                  </Badge>
                </div>
              )}

              {scholarship.type.includes("Full Time") && (
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Badge variant="outline" className="rounded-sm border-border">
                    <span className="mr-1">⏱️</span> Full Time
                  </Badge>
                </div>
              )}

              {scholarship.type.some(
                (type) =>
                  type.includes("Design") ||
                  type.includes("Sales") ||
                  type.includes("Growth") ||
                  type.includes("Devel")
              ) && (
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Badge variant="outline" className="rounded-sm border-border">
                    <span className="mr-1">📊</span>{" "}
                    {scholarship.type.find(
                      (type) =>
                        type.includes("Design") ||
                        type.includes("Sales") ||
                        type.includes("Growth") ||
                        type.includes("Devel")
                    )}
                  </Badge>
                </div>
              )}
            </div>

            <Link href={`/awardee/apply?scholarshipId=${scholarship.id}`} className="w-full">
              <Button className="w-full bg-primary hover:bg-primary/90 mb-8">
                Apply Now
              </Button>
            </Link>

            {scholarship.description && (
              <div className="mb-8">
                <h3 className="text-xl font-bold text-foreground mb-4">
                  Description
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {scholarship.description}
                </p>
              </div>
            )}

            {scholarship.requirements &&
              scholarship.requirements.length > 0 && (
                <div className="mb-8">
                  <h3 className="text-xl font-bold text-foreground mb-4">
                    Requirements
                  </h3>
                  <ul className="space-y-2">
                    {scholarship.requirements.map((requirement, index) => (
                      <li
                        key={index}
                        className="flex items-start gap-2 text-muted-foreground text-sm"
                      >
                        <span className="text-primary mt-1">•</span>
                        <span>{requirement}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

            {scholarship.responsibilities &&
              scholarship.responsibilities.length > 0 && (
                <div>
                  <h3 className="text-xl font-bold text-foreground mb-4">
                    Responsibilities
                  </h3>
                  <ul className="space-y-2">
                    {scholarship.responsibilities.map(
                      (responsibility, index) => (
                        <li
                          key={index}
                          className="flex items-start gap-2 text-muted-foreground text-sm"
                        >
                          <span className="text-primary mt-1">•</span>
                          <span>{responsibility}</span>
                        </li>
                      )
                    )}
                  </ul>
                </div>
              )}
          </div>
        </TabsContent>

        <TabsContent value="organization" className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-full overflow-hidden bg-muted flex items-center justify-center">
              <Image
                src={scholarship.organization.logo || "/placeholder.svg"}
                alt={scholarship.organization.name}
                width={48}
                height={48}
                className="object-cover"
              />
            </div>
            <span className="font-medium text-foreground text-xl">
              {scholarship.organization.name}
            </span>
          </div>

          <p className="text-muted-foreground text-sm leading-relaxed">
            {scholarship.organization.name} is a leading organization offering
            scholarships to talented individuals. Visit their website for more
            information about their programs and initiatives.
          </p>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function getTagColor(tag: string) {
  const tagColors: Record<
    string,
    { bg: string; text: string; border: string }
  > = {
    MARKETING: { bg: "#3d2b1f", text: "#ff8c38", border: "#ff8c38" },
    "COMMUNITY ENGAGEMENT": {
      bg: "#3d2b1f",
      text: "#ff8c38",
      border: "#ff8c38",
    },
    DEFI: { bg: "#1f3d2b", text: "#38ff8c", border: "#38ff8c" },
    SOLANA: { bg: "#2b1f3d", text: "#8c38ff", border: "#8c38ff" },
    "CONTENT CREATION": { bg: "#3d1f2b", text: "#ff388c", border: "#ff388c" },
    "CONSULTATIVE SALES": { bg: "#3d1f2b", text: "#ff388c", border: "#ff388c" },
    BLOCKCHAIN: { bg: "#2b1f3d", text: "#8c38ff", border: "#8c38ff" },
    "SOLUTION SALES": { bg: "#1f3d2b", text: "#38ff8c", border: "#38ff8c" },
    SALES: { bg: "#3d2b1f", text: "#ff8c38", border: "#ff8c38" },
    WEB3: { bg: "#1f2b3d", text: "#388cff", border: "#388cff" },
    TECHNOLOGY: { bg: "#1f2b3d", text: "#388cff", border: "#388cff" },
    BRANDING: { bg: "#1f2b3d", text: "#388cff", border: "#388cff" },
    "GRAPHIC DESIGN": { bg: "#2b1f3d", text: "#8c38ff", border: "#8c38ff" },
    FIGMA: { bg: "#1f2b3d", text: "#388cff", border: "#388cff" },
    COMMUNICATION: { bg: "#3d1f2b", text: "#ff388c", border: "#ff388c" },
    CRYPTOCURRENCY: { bg: "#2b1f3d", text: "#8c38ff", border: "#8c38ff" },
    ADOBE: { bg: "#3d1f2b", text: "#ff388c", border: "#ff388c" },
    CREATIVITY: { bg: "#1f3d2b", text: "#38ff8c", border: "#38ff8c" },
    "TEAM LEADERSHIP": { bg: "#3d2b1f", text: "#ff8c38", border: "#ff8c38" },
    "PROJECT MANAGEMENT": { bg: "#1f2b3d", text: "#388cff", border: "#388cff" },
  };

  return (
    tagColors[tag] || { bg: "#1f1f1f", text: "#ffffff", border: "#333333" }
  );
}
