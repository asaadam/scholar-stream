"use client"

import { useState, useEffect, Suspense } from "react"
import Link from "next/link"
import { ArrowLeft, Check, Eye, X } from "lucide-react"
import { useAccount } from "wagmi"
import { useSearchParams } from "next/navigation"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useScholarshipStore, Scholarship } from "@/lib/store"

// Define a proper Candidate type
interface Candidate {
  id: number;
  name: string;
  wallet: string;
  university: string;
  major: string;
  gpa: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  email: string;
  year: string;
  graduation: string;
  financialAid: string;
  financialNeed: string;
  statement: string;
  documents: string[];
}

// Create a client component that uses useSearchParams
function ManageCandidatesContent() {
  const account = useAccount()
  const searchParams = useSearchParams()
  const scholarshipId = searchParams.get("id")
  
  const getScholarshipById = useScholarshipStore((state) => state.getScholarshipById)
  const getActiveScholarship = useScholarshipStore((state) => state.getActiveScholarship)
  
  const [scholarship, setScholarship] = useState<Scholarship | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (account.address) {
      let activeScholarship: Scholarship | undefined

      // If ID is provided in URL, use it
      if (scholarshipId) {
        activeScholarship = getScholarshipById(scholarshipId)
      } else {
        // Otherwise get the active scholarship for this wallet
        activeScholarship = getActiveScholarship(account.address)
      }

      setScholarship(activeScholarship || null)
      setIsLoading(false)
    }
  }, [account.address, scholarshipId, getScholarshipById, getActiveScholarship])

  // Mock data for candidates
  const [candidates, setCandidates] = useState<Candidate[]>([])

  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null)
  const [showApproveDialog, setShowApproveDialog] = useState(false)
  const [streamAmount, setStreamAmount] = useState("")

  const viewApplication = (candidate: Candidate) => {
    setSelectedCandidate(candidate)
  }

  const openApproveDialog = (candidate: Candidate) => {
    setSelectedCandidate(candidate)
    setShowApproveDialog(true)
  }

  const approveCandidate = () => {
    setCandidates(
      candidates.map((candidate) => {
        if (candidate.id === selectedCandidate?.id) {
          return { ...candidate, status: "Approved" }
        }
        return candidate
      }),
    )
    setShowApproveDialog(false)
  }

  const rejectCandidate = (id: number) => {
    setCandidates(
      candidates.map((candidate) => {
        if (candidate.id === id) {
          return { ...candidate, status: "Rejected" }
        }
        return candidate
      }),
    )
  }

  if (isLoading) {
    return <div className="container mx-auto px-4 py-8">Loading scholarship data...</div>
  }

  if (!scholarship) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6 flex items-center">
          <Link href="/donor/manage-awardees">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Dashboard
            </Button>
          </Link>
        </div>
        <div className="rounded-md bg-yellow-50 p-4 border border-yellow-200">
          <h3 className="text-sm font-medium text-yellow-800">No Scholarship Found</h3>
          <div className="mt-2 text-sm text-yellow-700">
            The scholarship you&apos;re trying to manage doesn&apos;t exist or you don&apos;t have access to it.
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6 flex items-center">
        <Link href="/donor/manage-awardees">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Manage Candidates</CardTitle>
          <CardDescription>
            {scholarship.name} - Review and approve scholarship applicants
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-6">
            <p className="text-sm text-muted-foreground">
              {candidates.filter(c => c.status === "Pending").length} pending applications, 
              {parseInt(scholarship.maxAwardees) - candidates.filter(c => c.status === "Approved").length} spots remaining
            </p>
          </div>

          {candidates.length === 0 ? (
            <div className="rounded-md border border-dashed p-8 text-center">
              <h3 className="text-md font-medium text-muted-foreground">No Candidates Yet</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Candidates will appear here once they apply for your scholarship.
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Wallet Address</TableHead>
                  <TableHead>University</TableHead>
                  <TableHead>Major</TableHead>
                  <TableHead>GPA</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {candidates.map((candidate) => (
                  <TableRow key={candidate.id}>
                    <TableCell>{candidate.name}</TableCell>
                    <TableCell className="font-mono text-xs">
                      {candidate.wallet.slice(0, 6)}...{candidate.wallet.slice(-4)}
                    </TableCell>
                    <TableCell>{candidate.university}</TableCell>
                    <TableCell>{candidate.major}</TableCell>
                    <TableCell>{candidate.gpa}</TableCell>
                    <TableCell>
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                          candidate.status === "Approved"
                            ? "bg-green-100 text-green-800"
                            : candidate.status === "Rejected"
                              ? "bg-red-100 text-red-800"
                              : "bg-blue-100 text-blue-800"
                        }`}
                      >
                        {candidate.status}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="ghost" size="icon" onClick={() => viewApplication(candidate)}>
                              <Eye className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-h-[80vh] overflow-y-auto sm:max-w-[600px]">
                            <DialogHeader>
                              <DialogTitle>Application Details</DialogTitle>
                              <DialogDescription>
                                Review the complete application for {selectedCandidate?.name}
                              </DialogDescription>
                            </DialogHeader>

                            {selectedCandidate && (
                              <Tabs defaultValue="personal" className="mt-4">
                                <TabsList className="grid w-full grid-cols-4">
                                  <TabsTrigger value="personal">Personal</TabsTrigger>
                                  <TabsTrigger value="academic">Academic</TabsTrigger>
                                  <TabsTrigger value="financial">Financial</TabsTrigger>
                                  <TabsTrigger value="documents">Documents</TabsTrigger>
                                </TabsList>

                                <TabsContent value="personal" className="space-y-4 pt-4">
                                  <div className="grid grid-cols-2 gap-4">
                                    <div>
                                      <Label className="text-xs text-muted-foreground">Full Name</Label>
                                      <div className="font-medium">{selectedCandidate.name}</div>
                                    </div>
                                    <div>
                                      <Label className="text-xs text-muted-foreground">Email</Label>
                                      <div className="font-medium">{selectedCandidate.email}</div>
                                    </div>
                                    <div>
                                      <Label className="text-xs text-muted-foreground">Wallet Address</Label>
                                      <div className="font-mono text-xs">{selectedCandidate.wallet}</div>
                                    </div>
                                  </div>

                                  <div>
                                    <Label className="text-xs text-muted-foreground">Statement of Purpose</Label>
                                    <div className="mt-1 rounded-md bg-muted p-3 text-sm">
                                      {selectedCandidate.statement}
                                    </div>
                                  </div>
                                </TabsContent>

                                <TabsContent value="academic" className="space-y-4 pt-4">
                                  <div className="grid grid-cols-2 gap-4">
                                    <div>
                                      <Label className="text-xs text-muted-foreground">University</Label>
                                      <div className="font-medium">{selectedCandidate.university}</div>
                                    </div>
                                    <div>
                                      <Label className="text-xs text-muted-foreground">Major</Label>
                                      <div className="font-medium">{selectedCandidate.major}</div>
                                    </div>
                                    <div>
                                      <Label className="text-xs text-muted-foreground">Year</Label>
                                      <div className="font-medium">{selectedCandidate.year}</div>
                                    </div>
                                    <div>
                                      <Label className="text-xs text-muted-foreground">GPA</Label>
                                      <div className="font-medium">{selectedCandidate.gpa}</div>
                                    </div>
                                    <div>
                                      <Label className="text-xs text-muted-foreground">Expected Graduation</Label>
                                      <div className="font-medium">{selectedCandidate.graduation}</div>
                                    </div>
                                  </div>
                                </TabsContent>

                                <TabsContent value="financial" className="space-y-4 pt-4">
                                  <div className="grid grid-cols-2 gap-4">
                                    <div>
                                      <Label className="text-xs text-muted-foreground">Current Financial Aid</Label>
                                      <div className="font-medium">{selectedCandidate.financialAid}</div>
                                    </div>
                                  </div>

                                  <div>
                                    <Label className="text-xs text-muted-foreground">Financial Need Statement</Label>
                                    <div className="mt-1 rounded-md bg-muted p-3 text-sm">
                                      {selectedCandidate.financialNeed}
                                    </div>
                                  </div>
                                </TabsContent>

                                <TabsContent value="documents" className="space-y-4 pt-4">
                                  <div className="space-y-2">
                                    {selectedCandidate.documents.map((doc: string, index: number) => (
                                      <div
                                        key={index}
                                        className="flex items-center justify-between rounded-md border p-3"
                                      >
                                        <div className="font-medium">{doc}</div>
                                        <Button variant="outline" size="sm">
                                          View
                                        </Button>
                                      </div>
                                    ))}
                                  </div>
                                </TabsContent>
                              </Tabs>
                            )}

                            <DialogFooter className="mt-6 flex justify-between">
                              {selectedCandidate?.status === "Pending" && (
                                <>
                                  <Button
                                    variant="outline"
                                    onClick={() => rejectCandidate(selectedCandidate.id)}
                                    className="border-red-200 bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-700"
                                  >
                                    <X className="mr-2 h-4 w-4" />
                                    Reject
                                  </Button>
                                  <Button
                                    onClick={() => openApproveDialog(selectedCandidate)}
                                    className="bg-green-600 text-white hover:bg-green-700"
                                  >
                                    <Check className="mr-2 h-4 w-4" />
                                    Approve
                                  </Button>
                                </>
                              )}
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>

                        {candidate.status === "Pending" && (
                          <>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => openApproveDialog(candidate)}
                              className="text-green-600 hover:text-green-700"
                            >
                              <Check className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => rejectCandidate(candidate.id)}
                              className="text-red-600 hover:text-red-700"
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Approve Dialog */}
      <Dialog open={showApproveDialog} onOpenChange={setShowApproveDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Approve Candidate</DialogTitle>
            <DialogDescription>Set up a scholarship stream for {selectedCandidate?.name}</DialogDescription>
          </DialogHeader>

          {selectedCandidate && (
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-xs text-muted-foreground">Candidate</Label>
                  <div className="font-medium">{selectedCandidate.name}</div>
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">Wallet Address</Label>
                  <div className="font-mono text-xs">{selectedCandidate.wallet}</div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="stream-amount">Monthly Stream Amount</Label>
                <div className="flex">
                  <Input
                    id="stream-amount"
                    type="number"
                    min="1"
                    placeholder="250"
                    value={streamAmount}
                    onChange={(e) => setStreamAmount(e.target.value)}
                    required
                  />
                  <div className="flex items-center justify-center rounded-r-md border border-l-0 bg-muted px-3 text-sm">
                    USDC
                  </div>
                </div>
                <p className="text-xs text-muted-foreground">
                  This amount will be streamed continuously to the awardee, calculated per second.
                </p>
              </div>

              <div className="rounded-md bg-muted p-4">
                <div className="font-medium">Scholarship Details</div>
                <div className="mt-2 space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Scholarship:</span>
                    <span>{scholarship.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Total Duration:</span>
                    <span>12 months</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Total Amount:</span>
                    <span>{streamAmount ? `${Number.parseFloat(streamAmount) * 12} USDC` : "0 USDC"}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowApproveDialog(false)}>
              Cancel
            </Button>
            <Button onClick={approveCandidate} disabled={!streamAmount}>
              Approve & Start Stream
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

// Main page component
export default function ManageCandidates() {
  return (
    <Suspense fallback={<div className="container mx-auto px-4 py-8">Loading...</div>}>
      <ManageCandidatesContent />
    </Suspense>
  )
}

