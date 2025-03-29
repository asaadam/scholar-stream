import { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  useAccount,
  useReadContract,
  useWaitForTransactionReceipt,
  useWriteContract,
} from "wagmi";

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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { HelpCircle } from "lucide-react";

import payContractAbi from "@/abi/payContract.json";
import { PayContract, usePayContracts } from "@/lib/hooks/usePayContracts";
import { formatUnits, parseUnits } from "viem";
import { useStreams } from "@/lib/hooks/useStreams";

interface AddAwardeeModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  scholarshipId: string;
  tokenAddress?: `0x${string}`;
  tokenSymbol?: string;
  payContractAddress?: `0x${string}`;
}

export function AddAwardeeModal({
  open,
  onOpenChange,
  tokenAddress,
  payContractAddress,
}: AddAwardeeModalProps) {
  const account = useAccount();
  const [newAwardeeWallet, setNewAwardeeWallet] = useState("");
  const [newAwardeeName, setNewAwardeeName] = useState("");
  const [amount, setAmount] = useState("");
  const [timePeriod, setTimePeriod] = useState("month");
  const [amountPerSec, setAmountPerSec] = useState("");
  const [isAddingAwardee, setIsAddingAwardee] = useState(false);
  const [selectedContract, setSelectedContract] = useState<PayContract | null>(
    null
  );
  const { refetch: refetchStreams } = useStreams();

  // Fetch available pay contracts
  const { data: payContracts, isLoading: isLoadingContracts } =
    usePayContracts();

  // Contract interaction
  const { writeContractAsync, data: writeContractData } = useWriteContract();
  const { status } = useWaitForTransactionReceipt({
    hash: writeContractData,
  });

  // Read contract balance
  const { data: contractBalanceData, refetch: refetchBalance } =
    useReadContract({
      address: selectedContract?.id as `0x${string}` | undefined,
      abi: payContractAbi,
      functionName: "balances",
      args: account.address ? [account.address] : undefined,
      query: {
        enabled: !!selectedContract?.id && !!account.address,
      },
    });

  // Formatted balance
  const [formattedBalance, setFormattedBalance] = useState("0");

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
      setNewAwardeeWallet("");
      setNewAwardeeName("");
      setAmount("");
      setTimePeriod("month");
      setAmountPerSec("");
    }
  }, [open]);

  // Format balance when contractBalanceData changes
  useEffect(() => {
    if (contractBalanceData && selectedContract) {
      const balance = contractBalanceData as bigint;
      setFormattedBalance(
        formatUnits(balance, selectedContract.token.decimals)
      );
    } else {
      setFormattedBalance("0");
    }
  }, [contractBalanceData, selectedContract]);

  // Calculate amount per second based on input and time period
  useEffect(() => {
    if (!amount || isNaN(parseFloat(amount))) {
      setAmountPerSec("");
      return;
    }

    const amountNum = parseFloat(amount);
    let perSec: number;

    switch (timePeriod) {
      case "second":
        perSec = amountNum;
        break;
      case "month":
        perSec = amountNum / (30 * 24 * 60 * 60); // month to seconds
        break;
      case "year":
        perSec = amountNum / (365 * 24 * 60 * 60); // year to seconds
        break;
      default:
        perSec = 0;
    }

    setAmountPerSec(perSec.toString());
  }, [amount, timePeriod]);

  useEffect(() => {
    if (status === "success") {
      console.log("success, refetching streams");
      refetchStreams();
    }
  }, [status, refetchStreams]);

  const handleTokenChange = (contractId: string) => {
    const contract = payContracts?.find(
      (c: PayContract) => c.id === contractId
    );
    if (contract) {
      setSelectedContract(contract);
      setAmount("");
      setAmountPerSec("");
    }
  };

  const parseAmount = (value: string): bigint => {
    if (!selectedContract) return BigInt(0);
    return parseUnits(value, selectedContract.token.decimals);
  };

  const handleAddAwardee = async () => {
    if (
      !selectedContract ||
      !account.address ||
      !newAwardeeWallet ||
      !newAwardeeName ||
      !amountPerSec
    ) {
      toast.error("Please fill in all required fields");
      return;
    }

    setIsAddingAwardee(true);

    try {
      const amountPerSecWei = parseAmount(amountPerSec);
      await writeContractAsync(
        {
          address: selectedContract.id as `0x${string}`,
          abi: payContractAbi,
          functionName: "createStream",
          args: [newAwardeeWallet, amountPerSecWei],
        },
        {
          onSuccess: () => {
            refetchBalance();
            refetchStreams();
            onOpenChange(false);
          },
        }
      );

      toast.success("Awardee added successfully");
    } catch (error) {
      console.error("Error adding awardee:", error);
      toast.error("Failed to add awardee");
    } finally {
      setIsAddingAwardee(false);
    }
  };

  if (isLoadingContracts) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Awardee</DialogTitle>
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
            <DialogTitle>Add New Awardee</DialogTitle>
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
          <DialogTitle>Add New Awardee</DialogTitle>
          <DialogDescription>
            Add a new awardee to receive scholarship payments.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <div className="flex items-center">
              <Label htmlFor="name" className="mr-2">
                Name
              </Label>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <HelpCircle className="h-4 w-4 text-muted-foreground" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="w-80">
                      This name is only stored locally and is not recorded on
                      the blockchain. It&apos;s used for your reference only.
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <Input
              id="name"
              value={newAwardeeName}
              onChange={(e) => setNewAwardeeName(e.target.value)}
              placeholder="Awardee name"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="wallet">Wallet Address</Label>
            <Input
              id="wallet"
              value={newAwardeeWallet}
              onChange={(e) => setNewAwardeeWallet(e.target.value)}
              placeholder="0x..."
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="token">Token</Label>
            <div className="flex items-center gap-2">
              <div className="flex-1">
                <Select
                  value={selectedContract?.id || ""}
                  onValueChange={handleTokenChange}
                >
                  <SelectTrigger id="token">
                    <SelectValue placeholder="Select token" />
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
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <HelpCircle className="h-4 w-4 text-muted-foreground" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="w-80">
                      {selectedContract && (
                        <>
                          Token: {selectedContract.token.symbol} (
                          {selectedContract.token.name})
                          <br />
                          Token Address: {selectedContract.token.id.slice(0, 6)}
                          ...{selectedContract.token.id.slice(-4)}
                          <br />
                          Decimals: {selectedContract.token.decimals}
                          <br />
                          Pay Contract: {selectedContract.id.slice(0, 6)}...
                          {selectedContract.id.slice(-4)}
                        </>
                      )}
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            {formattedBalance && (
              <div className="text-xs text-muted-foreground mt-1">
                Available Balance: {parseFloat(formattedBalance).toFixed(4)}{" "}
                {selectedContract?.token.symbol}
              </div>
            )}
          </div>

          <div className="flex gap-4">
            <div className="space-y-2 flex-1">
              <Label htmlFor="amount">Amount</Label>
              <Input
                id="amount"
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
              />
            </div>

            <div className="space-y-2 w-[130px]">
              <Label htmlFor="timePeriod">Per</Label>
              <Select value={timePeriod} onValueChange={setTimePeriod}>
                <SelectTrigger id="timePeriod">
                  <SelectValue placeholder="Time Period" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="second">Second</SelectItem>
                  <SelectItem value="month">Month</SelectItem>
                  <SelectItem value="year">Year</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {amountPerSec && (
            <div className="rounded-md bg-muted p-3 text-sm">
              <p>
                Amount per second:{" "}
                <strong>
                  {parseFloat(amountPerSec).toFixed(
                    selectedContract?.token.decimals || 18
                  )}
                </strong>{" "}
                {selectedContract?.token.symbol}
              </p>
            </div>
          )}
        </div>
        <DialogFooter>
          <Button
            onClick={handleAddAwardee}
            disabled={
              isAddingAwardee ||
              !newAwardeeName ||
              !newAwardeeWallet ||
              !amount ||
              !amountPerSec ||
              !selectedContract
            }
          >
            {isAddingAwardee ? "Adding..." : "Add Awardee"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
