"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, Check, Eye, X } from "lucide-react"

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

export default function ManageCandidates() {
  // Mock data for candidates
  const [candidates, setCandidates] = useState([
    {
      id: 1,
      name: "Morgan Lee",
      wallet: "0x3c4d5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t1a2b",
      university: "Stanford University",
      major: "Computer Science",
      gpa: "3.8",
      status: "Pending",
      email: "morgan.lee@example.com",
      year: "Junior",
      graduation: "May 2026",
      financialAid: "No",
      financialNeed:
        "I am currently working part-time to cover my living expenses, but tuition costs are becoming increasingly difficult to manage.",
      statement:
        "I am passionate about using computer science to solve real-world problems. My goal is to develop accessible technology solutions for underserved communities. This scholarship would allow me to focus more on my studies and research projects instead of working extra hours to cover expenses.",
      documents: ["transcript.pdf", "recommendation.pdf"],
    },
    {
      id: 2,
      name: "Casey Brown",
      wallet: "0x7g8h9i0j1k2l3m4n5o6p7q8r9s0t1a2b3c4d5e6f",
      university: "MIT",
      major: "Electrical Engineering",
      gpa: "3.9",
      status: "Pending",
      email: "casey.brown@example.com",
      year: "Senior",
      graduation: "December 2025",
      financialAid: "Yes",
      financialNeed:
        "I currently have a partial scholarship that covers 40% of my tuition, but I still need additional support for the remaining costs and living expenses.",
      statement:
        "I'm researching renewable energy solutions and hope to contribute to sustainable technology development. This scholarship would help me complete my final year without taking on additional debt.",
      documents: ["transcript.pdf", "recommendation.pdf", "research_paper.pdf"],
    },
    {
      id: 3,
      name: "Jordan Rivera",
      wallet: "0x1k2l3m4n5o6p7q8r9s0t1a2b3c4d5e6f7g8h9i0j",
      university: "UC Berkeley",
      major: "Computer Engineering",
      gpa: "3.7",
      status: "Pending",
      email: "jordan.rivera@example.com",
      year: "Sophomore",
      graduation: "May 2027",
      financialAid: "No",
      financialNeed:
        "I am the first in my family to attend college and am currently financing my education through loans. Additional support would significantly reduce my future debt burden.",
      statement:
        "I'm interested in hardware-software integration and IoT technologies. I hope to develop devices that can help with environmental monitoring and conservation efforts. This scholarship would allow me to participate in more research opportunities without worrying about financial constraints.",
      documents: ["transcript.pdf", "recommendation.pdf"],
    },
  ])

  const [selectedCandidate, setSelectedCandidate] = useState<any>(null)
  const [showApproveDialog, setShowApproveDialog] = useState(false)
  const [streamAmount, setStreamAmount] = useState("")

  const viewApplication = (candidate: any) => {
    setSelectedCandidate(candidate)
  }

  const openApproveDialog = (candidate: any) => {
    setSelectedCandidate(candidate)
    setShowApproveDialog(true)
  }

  const approveCandidate = () => {
    setCandidates(
      candidates.map((candidate) => {
        if (candidate.id === selectedCandidate.id) {
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

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6 flex items-center">
        <Link href="/donor">
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
            Computer Science Excellence Scholarship - Review and approve scholarship applicants
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-6">
            <p className="text-sm text-muted-foreground">3 pending applications, 2 spots remaining</p>
          </div>

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
                    <span>Computer Science Excellence</span>
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

