import payContractAbi from "@/abi/payContract.json";
import { useQuery } from "@tanstack/react-query";
import { formatEther } from "viem";
import { useAccount, useReadContracts } from "wagmi";

export type TokenInfo = {
  id: string; // token address
  name: string;
  symbol: string;
  decimals: number;
};

export type PayContract = {
  id: string; // pay contract address
  token: TokenInfo;
  balance?: string;
};

// Add interface for the GraphQL response
interface PayContractItem {
  id: string;
  token: {
    id: string;
    name: string;
    symbol: string;
    decimals: string | number;
  };
}

// Separate fetch function for better reusability
const fetchPayContracts = async () => {
  try {
    const subgraphUrl = process.env.NEXT_PUBLIC_SUBGRAPH_URL;
    const response = await fetch(`${subgraphUrl}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: `
        query GetScholarships {
          payContracts {
            items {
              token {
                id
                name
                symbol
                decimals
              }
              id
            }
          }
        }
      `,
      }),
    });

    const data = await response.json();

    if (data.errors) {
      throw new Error(data.errors[0].message);
    }

    // Create a Set to track unique token IDs
    const uniqueTokenIds = new Set<string>();
    return data.data.payContracts.items
      .filter((item: PayContractItem) => {
        if (uniqueTokenIds.has(item.token.id)) {
          return false;
        }
        uniqueTokenIds.add(item.token.id);
        return true;
      })
      .map((item: PayContractItem) => ({
        id: item.id,
        token: {
          id: item.token.id,
          name: item.token.name,
          symbol: item.token.symbol,
          decimals: Number(item.token.decimals),
        },
      }));
  } catch (error) {
    console.error("Error fetching pay contracts:", error);
    return [];
  }
};

export function usePayContracts() {
  return useQuery({
    queryKey: ["payContracts"],
    queryFn: fetchPayContracts,
  });
}

// Add new hook for getting contract balances
export function usePayContractBalances() {
  const { data: payContracts, isLoading: isLoadingContracts } =
    usePayContracts();
  const { address } = useAccount();

  const contracts = payContracts || [];
  const { data: balances, isLoading: isLoadingBalances } = useReadContracts({
    contracts: contracts.map((contract: PayContract) => ({
      address: contract.id as `0x${string}`,
      abi: payContractAbi,
      functionName: "balances",
      args: [address as `0x${string}`],
    })),
  });

  const contractBalances = contracts.map(
    (contract: PayContract, index: number) => {
      const balance = balances?.[index];
      const formattedBalance =
        balance?.status === "success" && balance.result
          ? formatEther(balance.result as bigint)
          : "0";

      return {
        ...contract,
        balance: formattedBalance,
      };
    }
  );

  return {
    data: contractBalances,
    isLoading: isLoadingContracts || isLoadingBalances,
  };
}
