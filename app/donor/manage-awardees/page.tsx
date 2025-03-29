"use client";

import { Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useAccount, useWriteContract } from "wagmi";

import { AddAwardeeModal } from "@/components/AddAwardeeModal";
import { DepositModal } from "@/components/DepositModal";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { PayContract, usePayContracts } from "@/lib/hooks/usePayContracts";
import { useTokenInfo } from "@/lib/hooks/useTokenInfo";
import { Awardee, Scholarship, useAwardeeStore } from "@/lib/store";
import { AwardeesTable } from "./components/AwardeesTable";
import { PayContracts } from "./components/PayContracts";
import { ScholarshipHeader } from "./components/ScholarshipHeader";

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
    name: "Scholarship",
    description: "Scholarship for demonstration purposes",
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
  const { data: payContracts } = usePayContracts();
  // Find the current pay contract and token details from the fetched data
  const currentPayContract = payContracts?.find(
    (contract: PayContract) =>
      contract.id.toLowerCase() === scholarship.payContractAddress.toLowerCase()
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
    const decimals = tokenInfo.decimals || tokenDetails?.decimals || 18;
    return `${(amountPerMonth / Math.pow(10, decimals)).toFixed(2)} ${
      tokenInfo.symbol ||
      tokenDetails?.symbol ||
      scholarship.tokenSymbol ||
      "USDC"
    }/month`;
  };

  const tokenSymbol =
    tokenInfo.symbol ||
    tokenDetails?.symbol ||
    scholarship.tokenSymbol ||
    "USDC";

  return (
    <div className="container mx-auto px-4 py-8">
      <ScholarshipHeader
        scholarship={scholarship}
        tokenSymbol={tokenSymbol}
        onDepositClick={() => setShowDepositModal(true)}
      />

      <div className="my-4">
        <h2 className="text-xl font-semibold mb-4">Available Pay Contracts</h2>
        <PayContracts />
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="mb-6">
            <div className="flex justify-end">
              <Button size="sm" onClick={() => setShowAddDialog(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Add Awardee
              </Button>
            </div>
          </div>

          <AwardeesTable
            tokenSymbol={tokenSymbol}
            onToggleStatus={toggleAwardeeStatus}
            onRemove={removeAwardee}
            formatAmountDisplay={formatAmountDisplay}
            tokenDecimals={tokenInfo.decimals || tokenDetails?.decimals || 18}
          />

          {/* Add AddAwardeeModal */}
          <AddAwardeeModal
            open={showAddDialog}
            onOpenChange={setShowAddDialog}
            scholarshipId={scholarship.id}
            tokenAddress={scholarship.tokenAddress as `0x${string}`}
            payContractAddress={scholarship.payContractAddress as `0x${string}`}
            onAwardeeAdded={handleAwardeeAdded}
          />

          {/* Add deposit modal */}
          <DepositModal
            open={showDepositModal}
            onOpenChange={setShowDepositModal}
            tokenAddress={scholarship.tokenAddress as `0x${string}`}
            payContractAddress={scholarship.payContractAddress as `0x${string}`}
            onDepositSuccess={refetchBalance}
          />
        </CardContent>
      </Card>
    </div>
  );
}
