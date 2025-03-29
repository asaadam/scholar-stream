import { useState, useEffect } from "react";
import { toast } from "sonner";
import { erc20Abi } from "viem";
import { useWriteContract } from "wagmi";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useUserTokenBalance } from "@/lib/hooks/useUserTokenBalance";
import { PayContract, usePayContracts } from "@/lib/hooks/usePayContracts";
import payContractAbi from "@/abi/payContract.json";

interface DepositModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  tokenAddress?: `0x${string}`;
  tokenSymbol?: string;
  payContractAddress?: `0x${string}`;
  onDepositSuccess: () => void;
}

export function DepositModal({
  open,
  onOpenChange,
  tokenAddress,
  payContractAddress,
  onDepositSuccess,
}: DepositModalProps) {
  const [amount, setAmount] = useState("");
  const [isDepositing, setIsDepositing] = useState(false);
  const [selectedContract, setSelectedContract] = useState<PayContract | null>(
    null
  );

  // Fetch available pay contracts
  const { data: payContracts, isLoading: isLoadingContracts } =
    usePayContracts();

  // Get user's token balance for the selected token
  const { formattedBalance, parseAmount, refetchBalance } = useUserTokenBalance(
    selectedContract?.token.id as `0x${string}` | undefined
  );

  // Contract interaction
  const { writeContractAsync } = useWriteContract();

  // Set initial selected contract if tokenAddress and payContractAddress are provided
  useEffect(() => {
    if (open && tokenAddress && payContractAddress && payContracts.length > 0) {
      const contract = payContracts.find(
        (c: PayContract) =>
          c.token.id.toLowerCase() === tokenAddress.toLowerCase() &&
          c.id.toLowerCase() === payContractAddress.toLowerCase()
      );

      if (contract) {
        setSelectedContract(contract);
      } else if (!selectedContract && payContracts.length > 0) {
        // Default to first contract if no match and nothing selected
        setSelectedContract(payContracts[0]);
      }
    } else if (open && payContracts.length > 0 && !selectedContract) {
      // Default to first contract if none selected
      setSelectedContract(payContracts[0]);
    }
  }, [open, tokenAddress, payContractAddress, payContracts, selectedContract]);

  // Reset form when closing
  useEffect(() => {
    if (!open) {
      setAmount("");
    }
  }, [open]);

  const handleTokenChange = (contractId: string) => {
    const contract = payContracts?.find(
      (c: PayContract) => c.id === contractId
    );
    if (contract) {
      setSelectedContract(contract);
      // Reset amount when changing tokens
      setAmount("");
    }
  };

  const handleDeposit = async () => {
    if (!selectedContract) {
      toast.error("Please select a token");
      return;
    }

    if (!amount || isNaN(parseFloat(amount)) || parseFloat(amount) <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }

    if (parseFloat(amount) > parseFloat(formattedBalance)) {
      toast.error("Insufficient balance");
      return;
    }

    setIsDepositing(true);

    try {
      // First approve the token transfer
      await writeContractAsync({
        address: selectedContract.token.id as `0x${string}`,
        abi: erc20Abi,
        functionName: "approve",
        args: [selectedContract.id as `0x${string}`, parseAmount(amount)],
      });

      toast.info("Token approved. Processing deposit...");

      // Then deposit to the pay contract
      await writeContractAsync({
        address: selectedContract.id as `0x${string}`,
        abi: payContractAbi,
        functionName: "deposit",
        args: [parseAmount(amount)],
      });

      // Reset form
      setAmount("");

      // Close the modal
      onOpenChange(false);

      // Refresh balances
      refetchBalance();
      onDepositSuccess();

      toast.success("Deposit successful");
    } catch (error) {
      console.error("Error depositing:", error);
      toast.error("Failed to deposit");
    } finally {
      setIsDepositing(false);
    }
  };

  const setMaxAmount = () => {
    setAmount(formattedBalance);
  };

  if (isLoadingContracts) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Deposit Funds</DialogTitle>
          </DialogHeader>
          <div className="py-8 text-center">Loading available tokens...</div>
        </DialogContent>
      </Dialog>
    );
  }

  if (payContracts.length === 0) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Deposit Funds</DialogTitle>
          </DialogHeader>
          <div className="py-8 text-center">
            No payment contracts available.
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Deposit Funds</DialogTitle>
          <DialogDescription>
            Add funds to a scholarship contract to pay awardees.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="token-selection">Select Token</Label>
            <Select
              value={selectedContract?.id || ""}
              onValueChange={handleTokenChange}
            >
              <SelectTrigger id="token-selection">
                <SelectValue placeholder="Select a token" />
              </SelectTrigger>
              <SelectContent>
                {payContracts.map((contract: PayContract) => (
                  <SelectItem key={contract.id} value={contract.id}>
                    {contract.token.symbol} - {contract.token.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {selectedContract && (
            <>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="deposit-amount">Amount</Label>
                  <span className="text-xs text-muted-foreground">
                    Balance: {parseFloat(formattedBalance).toFixed(4)}{" "}
                    {selectedContract.token.symbol}
                  </span>
                </div>
                <div className="flex space-x-2">
                  <Input
                    id="deposit-amount"
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="0.00"
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={setMaxAmount}
                    className="whitespace-nowrap"
                  >
                    Max
                  </Button>
                </div>
              </div>

              <div className="rounded-md bg-muted p-3 text-sm">
                <p>
                  <strong>Token Details:</strong>
                </p>
                <p className="mt-1">• Name: {selectedContract.token.name}</p>
                <p>• Symbol: {selectedContract.token.symbol}</p>
                <p>• Decimals: {selectedContract.token.decimals}</p>
                <p>
                  • Contract: {selectedContract.id.slice(0, 6)}...
                  {selectedContract.id.slice(-4)}
                </p>
              </div>
            </>
          )}
        </div>
        <DialogFooter>
          <Button
            onClick={handleDeposit}
            disabled={
              isDepositing ||
              !selectedContract ||
              !amount ||
              parseFloat(amount) <= 0 ||
              parseFloat(amount) > parseFloat(formattedBalance)
            }
          >
            {isDepositing ? "Depositing..." : "Deposit"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
