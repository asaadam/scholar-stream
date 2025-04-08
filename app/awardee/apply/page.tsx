"use client"

import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import type React from "react"
import { useState, useEffect } from "react"
import { toast } from "sonner";
import { useRouter } from "next/navigation"
import { useAccount } from "wagmi"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Scholarship, scholarships } from "../types"
import { useApplicationStore, ApplicationData } from "@/app/store/applicationStore"

// Update the availableScholarships to use the imported scholarships
const availableScholarships = scholarships;

export default function ApplyScholarship() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [selectedScholarship, setSelectedScholarship] = useState<Scholarship | null>(null)
  const [currentStep, setCurrentStep] = useState<"select" | "apply">("select")
  const router = useRouter()
  const { address } = useAccount()
  
  // Form state
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [email, setEmail] = useState("")
  const [walletAddress, setWalletAddress] = useState("")
  const [university, setUniversity] = useState("")
  const [major, setMajor] = useState("")
  const [gpa, setGpa] = useState("")
  const [yearOfStudy, setYearOfStudy] = useState("")
  const [expectedGraduation, setExpectedGraduation] = useState("")
  const [receivesFinancialAid, setReceivesFinancialAid] = useState("no")
  const [financialNeedDescription, setFinancialNeedDescription] = useState("")
  const [statementOfPurpose, setStatementOfPurpose] = useState("")

  // Get the submitApplication action from the store
  const submitApplication = useApplicationStore((state) => state.submitApplication)
  const getApplications = useApplicationStore((state) => state.getApplications)

  // Use useEffect to get the scholarshipId from URL and find the corresponding scholarship
  useEffect(() => {
    // Check if we have a scholarshipId in the URL
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const scholarshipId = params.get('scholarshipId');
      
      if (scholarshipId) {
        // Find the scholarship with the matching ID
        const scholarship = availableScholarships.find(s => s.id === scholarshipId);
        if (scholarship) {
          setSelectedScholarship(scholarship);
          // Always go directly to apply form when scholarshipId is in URL
          setCurrentStep("apply");
        }
      }
    }
  }, []);

  // Use useEffect to get wallet address from connected account
  useEffect(() => {
    if (address) {
      setWalletAddress(address)
    }
  }, [address])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    if (!selectedScholarship) {
      return;
    }

    // Create the application data object
    const applicationData: ApplicationData = {
      scholarshipId: selectedScholarship.id,
      scholarshipTitle: selectedScholarship.title,
      organizationName: selectedScholarship.organization.name,
      personalInfo: {
        firstName,
        lastName,
        email,
        walletAddress,
      },
      academicInfo: {
        university,
        major,
        gpa,
        yearOfStudy,
        expectedGraduation,
      },
      financialInfo: {
        receivesFinancialAid: receivesFinancialAid === "yes",
        financialNeedDescription,
      },
      statementOfPurpose,
      submittedAt: new Date().toISOString(),
    };

    // Submit to store
    submitApplication(applicationData);

    // Show success message and log applications
    setTimeout(() => {
      setIsSubmitting(false);
      
      // Log all applications to see the data was saved
      console.log("All applications:", getApplications());
      
      // Show success toast using sonner
      toast.success("Application Submitted", {
        description: `Your application for ${selectedScholarship.title} has been submitted successfully.`
      });
      
      // Redirect to dashboard after a delay
      setTimeout(() => {
        router.push("/awardee");
      }, 1000);
    }, 1000);
  }

  // If no scholarship is selected in URL, redirect back to browse page
  useEffect(() => {
    if (!selectedScholarship && currentStep === "apply") {
      if (typeof window !== 'undefined') {
        window.location.href = "/awardee/browse";
      }
    }
  }, [selectedScholarship, currentStep]);

  // Always show application form when accessed via URL parameter
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mx-auto max-w-2xl">
        <div className="mb-6 flex items-center">
          <Link href="/awardee/browse">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Scholarships
            </Button>
          </Link>
        </div>

        {selectedScholarship ? (
          <Card>
            <CardHeader>
              <CardTitle>Apply for {selectedScholarship.title}</CardTitle>
              <CardDescription>Submit your application for the {selectedScholarship.organization.name} scholarship program.</CardDescription>
            </CardHeader>
            <form onSubmit={handleSubmit}>
              <CardContent className="space-y-6">
                {/* Personal Information */}
                <div className="rounded-md border p-4">
                  <h3 className="mb-4 font-medium">Personal Information</h3>
                  <div className="grid gap-4">
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="firstName">First Name</Label>
                        <Input 
                          id="firstName" 
                          placeholder="First name" 
                          required 
                          value={firstName}
                          onChange={(e) => setFirstName(e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="lastName">Last Name</Label>
                        <Input 
                          id="lastName" 
                          placeholder="Last name" 
                          required 
                          value={lastName}
                          onChange={(e) => setLastName(e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <Input 
                        id="email" 
                        type="email" 
                        placeholder="your.email@example.com" 
                        required 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="wallet">Wallet Address</Label>
                      <Input 
                        id="wallet" 
                        placeholder="Connect wallet to get address" 
                        required 
                        value={walletAddress}
                        disabled
                      />
                      <p className="text-xs text-muted-foreground">
                        This is the wallet that will receive scholarship payments. Connect your wallet to automatically set this value.
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
                      <Input 
                        id="university" 
                        placeholder="Your university" 
                        required 
                        value={university}
                        onChange={(e) => setUniversity(e.target.value)}
                      />
                    </div>

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="major">Field of Study/Major</Label>
                        <Input 
                          id="major" 
                          placeholder="Your major" 
                          required 
                          value={major}
                          onChange={(e) => setMajor(e.target.value)}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="gpa">GPA</Label>
                        <Input 
                          id="gpa" 
                          placeholder="Your GPA (e.g., 3.8)" 
                          required 
                          value={gpa}
                          onChange={(e) => setGpa(e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="year">Year of Study</Label>
                        <Select 
                          required
                          value={yearOfStudy}
                          onValueChange={setYearOfStudy}
                        >
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
                        <Input 
                          id="graduation" 
                          type="month" 
                          required 
                          value={expectedGraduation}
                          onChange={(e) => setExpectedGraduation(e.target.value)}
                        />
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
                      <RadioGroup 
                        value={receivesFinancialAid}
                        onValueChange={setReceivesFinancialAid}
                      >
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
                        value={financialNeedDescription}
                        onChange={(e) => setFinancialNeedDescription(e.target.value)}
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
                    value={statementOfPurpose}
                    onChange={(e) => setStatementOfPurpose(e.target.value)}
                  />
                </div>
              </CardContent>
              <CardFooter className="flex justify-end">
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Submitting..." : "Submit Application"}
                </Button>
              </CardFooter>
            </form>
          </Card>
        ) : (
          <div className="text-center p-8 border rounded-lg">
            <h2 className="text-xl font-bold mb-4">No Scholarship Selected</h2>
            <p className="mb-4">Please select a scholarship from the browse page first.</p>
            <Link href="/awardee/browse">
              <Button>Browse Scholarships</Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}

