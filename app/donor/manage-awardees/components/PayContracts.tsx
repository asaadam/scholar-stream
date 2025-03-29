import { Card } from "@/components/ui/card";
import { usePayContractBalances, PayContract } from "@/lib/hooks/usePayContracts";

export function PayContracts() {
  const { data: payContracts, isLoading } = usePayContractBalances();

  if (isLoading) {
    return <div>Loading pay contracts...</div>;
  }

  if (!payContracts?.length) {
    return <div>No pay contracts found</div>;
  }

  return (
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
          </div>
        </Card>
      ))}
    </div>
  );
} 