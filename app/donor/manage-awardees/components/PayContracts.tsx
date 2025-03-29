import payContractAbi from "@/abi/payContract.json";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  PayContract,
  usePayContractBalances,
} from "@/lib/hooks/usePayContracts";
import { useEffect, useState } from "react";
import { parseUnits } from "viem";
import { useWaitForTransactionReceipt, useWriteContract } from "wagmi";

export function PayContracts() {
  const { data: payContracts, isLoading } = usePayContractBalances();
  const [withdrawAmount, setWithdrawAmount] = useState<string>("");
  const [selectedContract, setSelectedContract] = useState<PayContract | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { writeContract: withdrawPayer, data: withdrawData } = useWriteContract();

  const { isLoading: isWithdrawing, isSuccess } = useWaitForTransactionReceipt({
    hash: withdrawData,
  });

  useEffect(() => {
    if (isSuccess) {
      setWithdrawAmount("");
      setSelectedContract(null);
      setIsModalOpen(false);
    }
  }, [isSuccess]);

  const handleWithdraw = async () => {
    if (!selectedContract) return;
    
    try {
      const decimals = selectedContract.token.decimals ?? 18;
      const parsedAmount = parseUnits(withdrawAmount, decimals);

      withdrawPayer({
        address: selectedContract.id as `0x${string}`,
        abi: payContractAbi,
        functionName: "withdrawPayer",
        args: [parsedAmount],
      });
    } catch (error) {
      console.error("Failed to withdraw:", error);
    }
  };

  const openWithdrawModal = (contract: PayContract) => {
    setSelectedContract(contract);
    setIsModalOpen(true);
  };

  if (isLoading) {
    return <div>Loading pay contracts...</div>;
  }

  if (!payContracts?.length) {
    return <div>No pay contracts found</div>;
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {payContracts.map((contract: PayContract) => (
          <Card key={contract.id} className="p-4">
            <div className="flex flex-col space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Token</span>
                <span className="font-medium">{contract.token.symbol}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Name</span>
                <span className="font-medium">{contract.token.name}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Balance</span>
                <span className="font-medium">{contract.balance}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Contract</span>
                <span className="font-mono text-sm truncate max-w-[200px]">
                  {contract.id}
                </span>
              </div>

              <Button
                onClick={() => openWithdrawModal(contract)}
                className="w-full mt-4"
              >
                Withdraw Funds
              </Button>
            </div>
          </Card>
        ))}
      </div>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Withdraw Funds</DialogTitle>
            <DialogDescription>
              {selectedContract && (
                <div className="text-sm text-muted-foreground mt-2">
                  <p>Token: {selectedContract.token.symbol}</p>
                  <p>Available Balance: {selectedContract.balance}</p>
                </div>
              )}
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-col space-y-4">
            <Input
              type="number"
              placeholder="Amount to withdraw"
              value={withdrawAmount}
              onChange={(e) => setWithdrawAmount(e.target.value)}
              className="w-full"
            />
            <Button
              onClick={handleWithdraw}
              disabled={
                !withdrawAmount ||
                parseFloat(withdrawAmount) <= 0 ||
                isWithdrawing
              }
              className="w-full"
            >
              {isWithdrawing ? "Withdrawing..." : "Confirm Withdrawal"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
