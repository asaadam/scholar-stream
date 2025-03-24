"use client";

import { ArrowLeft, Plus, Trash2, UserCheck, Wallet } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useAccount, useWriteContract } from "wagmi";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useTokenInfo } from "@/lib/hooks/useTokenInfo";
import {
  Awardee,
  Scholarship,
  useAwardeeStore,
} from "@/lib/store";
import { usePayContracts } from "@/lib/hooks/usePayContracts";
import { DepositModal } from "@/components/DepositModal";
import { AddAwardeeModal } from "@/components/AddAwardeeModal";

// Import contract ABIs
import payContractAbi from "@/abi/payContract.json";

export default function ManageAwardees() {
  const account = useAccount();

  // Awardee store functions
  const addAwardee = useAwardeeStore((state) => state.addAwardee);
  const updateAwardee = useAwardeeStore((state) => state.updateAwardee);
  const removeAwardeeFromStore = useAwardeeStore(
    (state) => state.removeAwardee
  );
  const getAwardeesByScholarship = useAwardeeStore(
    (state) => state.getAwardeesByScholarship
  );

  // Create a hardcoded scholarship with all required properties
  const hardcodedScholarship: Scholarship = {
    id: "scholarship-123",
    name: "Hardcoded Scholarship",
    description: "A hardcoded scholarship for demonstration purposes",
    amount: "10000",
    duration: "12",
    maxAwardees: "10",
    tokenAddress: "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174", // Example USDC on Polygon
    tokenSymbol: "USDC",
    payContractAddress: "0x1234567890123456789012345678901234567890", // Example address
    createdAt: new Date().getTime(),
    streamRate: "0.1", // Added missing required property
    isActive: true, // Added missing required property
    donorAddress: account.address, // Optional but useful
  };

  // Since we're hardcoding it, we don't need to set or update it
  const scholarship = hardcodedScholarship;
  const [awardees, setAwardees] = useState<Awardee[]>([]);

  // New state for add awardee modal
  const [showAddDialog, setShowAddDialog] = useState(false);

  // Contract interaction
  const { writeContractAsync } = useWriteContract();

  // Use our custom hook to get token info
  const { tokenInfo, refetchBalance, parseAmount } = useTokenInfo(
    scholarship.tokenAddress as `0x${string}`,
    scholarship.payContractAddress as `0x${string}`
  );

  // Add state for deposit modal
  const [showDepositModal, setShowDepositModal] = useState(false);

  // Fetch available pay contracts
  const { payContracts } = usePayContracts();

  // Find the current pay contract and token details from the fetched data
  const currentPayContract = payContracts.find(
    (contract) =>
      contract.id.toLowerCase() ===
      scholarship.payContractAddress.toLowerCase()
  );

  // If we found the contract in our GraphQL data, use that token info
  // otherwise fall back to our existing useTokenInfo hook
  const tokenDetails = currentPayContract?.token;

  useEffect(() => {
    if (account.address) {
      // Load awardees for this scholarship from storage
      const storedAwardees = getAwardeesByScholarship(hardcodedScholarship.id);
      setAwardees(storedAwardees);
    }
  }, [account.address, getAwardeesByScholarship]);

  // Update the effect to refresh balance when scholarship changes
  useEffect(() => {
    if (scholarship.tokenAddress && scholarship.payContractAddress) {
      refetchBalance();
    }
  }, [scholarship, refetchBalance]);

  const handleAwardeeAdded = (newAwardee: Awardee) => {
    // Add to the store
    addAwardee(newAwardee);

    // Update local state
    setAwardees([...awardees, newAwardee]);

    // Refresh balance
    refetchBalance();
  };

  const toggleAwardeeStatus = async (awardee: Awardee) => {
    try {
      if (awardee.status === "Active") {
        // Cancel the stream if it's active
        const amountPerSecWei = parseAmount(awardee.amountPerSec);

        await writeContractAsync({
          address: scholarship.payContractAddress as `0x${string}`,
          abi: payContractAbi,
          functionName: "cancelStream",
          args: [awardee.wallet, amountPerSecWei],
        });

        // Update status to paused
        updateAwardee(awardee.id, { status: "Paused" });

        // Update local state
        setAwardees(
          awardees.map((a) =>
            a.id === awardee.id ? { ...a, status: "Paused" } : a
          )
        );

        toast.success("Scholarship stream paused");
      } else {
        // Recreate the stream if it's paused
        const amountPerSecWei = parseAmount(awardee.amountPerSec);

        await writeContractAsync({
          address: scholarship.payContractAddress as `0x${string}`,
          abi: payContractAbi,
          functionName: "createStream",
          args: [awardee.wallet, amountPerSecWei],
        });

        // Update status to active
        updateAwardee(awardee.id, { status: "Active" });

        // Update local state
        setAwardees(
          awardees.map((a) =>
            a.id === awardee.id ? { ...a, status: "Active" } : a
          )
        );

        toast.success("Scholarship stream activated");
      }

      // Refresh balance
      refetchBalance();
    } catch (error) {
      console.error("Error toggling awardee status:", error);
      toast.error("Failed to update awardee status");
    }
  };

  const removeAwardee = async (awardee: Awardee) => {
    try {
      if (awardee.status === "Active") {
        // Cancel the stream if it's active
        const amountPerSecWei = parseAmount(awardee.amountPerSec);

        await writeContractAsync({
          address: scholarship.payContractAddress as `0x${string}`,
          abi: payContractAbi,
          functionName: "cancelStream",
          args: [awardee.wallet, amountPerSecWei],
        });
      }

      // Remove from store
      removeAwardeeFromStore(awardee.id);

      // Update local state
      setAwardees(awardees.filter((a) => a.id !== awardee.id));

      // Refresh balance
      refetchBalance();

      toast.success("Awardee removed successfully");
    } catch (error) {
      console.error("Error removing awardee:", error);
      toast.error("Failed to remove awardee");
    }
  };

  const formatAmountDisplay = (awardee: Awardee) => {
    const amountPerSec = parseFloat(awardee.amountPerSec);
    const amountPerMonth = amountPerSec * 30 * 24 * 60 * 60;
    return `${amountPerMonth.toFixed(2)} ${
      tokenInfo.symbol ||
      tokenDetails?.symbol ||
      scholarship.tokenSymbol ||
      "USDC"
    }/month`;
  };

  const formatBalance = () => {
    return `${parseFloat(tokenInfo.formattedBalance || "0").toFixed(2)} ${
      tokenInfo.symbol ||
      tokenDetails?.symbol ||
      scholarship.tokenSymbol ||
      "USDC"
    }`;
  };

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
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Manage Awardees</CardTitle>
              <CardDescription>
                {scholarship.name} - {scholarship.amount}{" "}
                {tokenInfo.symbol ||
                  tokenDetails?.symbol ||
                  scholarship.tokenSymbol}{" "}
                over {scholarship.duration} months
              </CardDescription>
            </div>
            <Button
              variant="outline"
              onClick={() => setShowDepositModal(true)}
              className="flex items-center gap-2"
            >
              <Wallet className="h-4 w-4" />
              Deposit Funds
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="mb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <Card className="p-4 bg-muted/50">
                <div className="flex flex-col">
                  <span className="text-sm text-muted-foreground">
                    Contract Balance:
                  </span>
                  <span className="text-xl font-bold">{formatBalance()}</span>
                </div>
              </Card>
              <Card className="p-4 bg-muted/50">
                <div className="flex flex-col">
                  <span className="text-sm text-muted-foreground">
                    Active Awardees:
                  </span>
                  <span className="text-xl font-bold">
                    {awardees.filter((a) => a.status === "Active").length} /{" "}
                    {scholarship.maxAwardees}
                  </span>
                </div>
              </Card>
            </div>

            <div className="flex justify-end">
              <Button size="sm" onClick={() => setShowAddDialog(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Add Awardee
              </Button>
            </div>
          </div>

          {awardees.length === 0 ? (
            <div className="rounded-md border border-dashed p-8 text-center">
              <h3 className="text-md font-medium text-muted-foreground">
                No Awardees Yet
              </h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Use the &quot;Add Awardee&quot; button to start adding
                scholarship recipients.
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Wallet Address</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {awardees.map((awardee) => (
                  <TableRow key={awardee.id}>
                    <TableCell>{awardee.name}</TableCell>
                    <TableCell className="font-mono text-xs">
                      {awardee.wallet.slice(0, 6)}...{awardee.wallet.slice(-4)}
                    </TableCell>
                    <TableCell>{formatAmountDisplay(awardee)}</TableCell>
                    <TableCell>
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                          awardee.status === "Active"
                            ? "bg-green-100 text-green-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {awardee.status}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => toggleAwardeeStatus(awardee)}
                        >
                          <UserCheck className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removeAwardee(awardee)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}

          {/* Add AddAwardeeModal */}
          <AddAwardeeModal
            open={showAddDialog}
            onOpenChange={setShowAddDialog}
            scholarshipId={scholarship.id}
            tokenAddress={scholarship.tokenAddress as `0x${string}`}
            tokenSymbol={
              tokenInfo.symbol ||
              tokenDetails?.symbol ||
              scholarship.tokenSymbol
            }
            payContractAddress={
              scholarship.payContractAddress as `0x${string}`
            }
            onAwardeeAdded={handleAwardeeAdded}
          />

          {/* Add deposit modal */}
          <DepositModal
            open={showDepositModal}
            onOpenChange={setShowDepositModal}
            tokenAddress={scholarship.tokenAddress as `0x${string}`}
            tokenSymbol={
              tokenInfo.symbol ||
              tokenDetails?.symbol ||
              scholarship.tokenSymbol
            }
            payContractAddress={
              scholarship.payContractAddress as `0x${string}`
            }
            onDepositSuccess={refetchBalance}
          />
        </CardContent>
      </Card>
    </div>
  );
}
