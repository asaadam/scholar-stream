import { useQuery } from "@tanstack/react-query";
import { PayContract } from "./usePayContracts";

export interface Vault {
  id: string;
  name: string;
  symbol: string;
  decimals: string;
}

export interface VaultResponse {
  data: {
    payContract: {
      id: string;
      vault: Vault;
    };
  };
}

export function useGetVaults(selectedContract: PayContract | null) {
  const { data: vaultData, isLoading: isLoadingVault } =
    useQuery<VaultResponse>({
      queryKey: ["vaults", selectedContract?.id],
      queryFn: async () => {
        if (!selectedContract?.id) {
          throw new Error("No pay contract selected");
        }

        const response = await fetch(
          process.env.NEXT_PUBLIC_SUBGRAPH_URL || "",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              query: `
        query getVaults {
          payContract(id: "${selectedContract.id}") {
            id
            vault {
              id,
              name,
              symbol,
              decimals
            }
          }
        }
      `,
            }),
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch vaults");
        }

        return response.json();
      },
      enabled: !!selectedContract?.id,
    });

  return { vaultData, isLoadingVault };
}
