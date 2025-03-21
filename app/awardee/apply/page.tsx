"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, Upload } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

export default function ApplyScholarship() {
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Mock available scholarships
  const availableScholarships = [
    {
      id: 1,
      name: "Engineering Futures Scholarship",
      donor: "Tech Foundation",
      amount: "500 USDC monthly",
      duration: "24 months",
    },
    {
      id: 2,
      name: "Data Science Excellence Scholarship",
      donor: "AI Research Institute",
      amount: "300 USDC monthly",
      duration: "12 months",
    },
  ]

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Mock submission delay
    setTimeout(() => {
      setIsSubmitting(false)
      window.location.href = "/awardee"
    }, 2000)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mx-auto max-w-2xl">
        <div className="mb-6 flex items-center">
          <Link href="/awardee">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Dashboard
            </Button>
          </Link>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Apply for Scholarship</CardTitle>
            <CardDescription>Submit your application for an available scholarship program.</CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="scholarship">Select Scholarship</Label>
                <Select required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a scholarship" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableScholarships.map((scholarship) => (
                      <SelectItem key={scholarship.id} value={scholarship.id.toString()}>
                        {scholarship.name} - {scholarship.amount}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Personal Information */}
              <div className="rounded-md border p-4">
                <h3 className="mb-4 font-medium">Personal Information</h3>
                <div className="grid gap-4">
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name</Label>
                      <Input id="firstName" placeholder="First name" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input id="lastName" placeholder="Last name" required />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input id="email" type="email" placeholder="your.email@example.com" required />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="wallet">Wallet Address</Label>
                    <Input id="wallet" placeholder="Your wallet address (0x...)" required />
                    <p className="text-xs text-muted-foreground">
                      This is the wallet that will receive scholarship payments.
                    </p>
                  </div>
                </div>
              </div>

              {/* Academic Information */}
              <div className="rounded-md border p-4">
                <h3 className="mb-4 font-medium">Academic Information</h3>
                <div className="grid gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="university">University/Institution</Label>
                    <Input id="university" placeholder="Your university" required />
                  </div>

                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="major">Field of Study/Major</Label>
                      <Input id="major" placeholder="Your major" required />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="gpa">GPA</Label>
                      <Input id="gpa" placeholder="Your GPA (e.g., 3.8)" required />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="year">Year of Study</Label>
                      <Select required>
                        <SelectTrigger id="year">
                          <SelectValue placeholder="Select year" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="freshman">Freshman</SelectItem>
                          <SelectItem value="sophomore">Sophomore</SelectItem>
                          <SelectItem value="junior">Junior</SelectItem>
                          <SelectItem value="senior">Senior</SelectItem>
                          <SelectItem value="graduate">Graduate</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="graduation">Expected Graduation</Label>
                      <Input id="graduation" type="month" required />
                    </div>
                  </div>
                </div>
              </div>

              {/* Financial Need */}
              <div className="rounded-md border p-4">
                <h3 className="mb-4 font-medium">Financial Information</h3>
                <div className="grid gap-4">
                  <div className="space-y-2">
                    <Label>Do you currently receive any financial aid?</Label>
                    <RadioGroup defaultValue="no">
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="yes" id="aid-yes" />
                        <Label htmlFor="aid-yes">Yes</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="no" id="aid-no" />
                        <Label htmlFor="aid-no">No</Label>
                      </div>
                    </RadioGroup>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="financial-need">Describe your financial need</Label>
                    <Textarea
                      id="financial-need"
                      placeholder="Explain your current financial situation and how this scholarship would help you."
                      rows={3}
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Statement of Purpose */}
              <div className="space-y-2">
                <Label htmlFor="statement">Statement of Purpose</Label>
                <Textarea
                  id="statement"
                  placeholder="Explain why you should receive this scholarship, your academic goals, and how this scholarship will help you achieve them."
                  rows={5}
                  required
                />
              </div>

              {/* Document Upload */}
              <div className="space-y-2">
                <Label>Supporting Documents</Label>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="rounded-md border border-dashed p-4 text-center">
                    <div className="flex flex-col items-center justify-center space-y-2">
                      <Upload className="h-8 w-8 text-muted-foreground" />
                      <div className="text-sm font-medium">Transcript</div>
                      <div className="text-xs text-muted-foreground">PDF or image, max 5MB</div>
                      <Input id="transcript" type="file" className="hidden" />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => document.getElementById("transcript")?.click()}
                      >
                        Upload Transcript
                      </Button>
                    </div>
                  </div>

                  <div className="rounded-md border border-dashed p-4 text-center">
                    <div className="flex flex-col items-center justify-center space-y-2">
                      <Upload className="h-8 w-8 text-muted-foreground" />
                      <div className="text-sm font-medium">Recommendation Letter</div>
                      <div className="text-xs text-muted-foreground">PDF, max 5MB</div>
                      <Input id="recommendation" type="file" className="hidden" />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => document.getElementById("recommendation")?.click()}
                      >
                        Upload Letter
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? "Submitting Application..." : "Submit Application"}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  )
}

