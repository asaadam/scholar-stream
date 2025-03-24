import { useState, useEffect } from "react";

export type TokenInfo = {
  id: string; // token address
  name: string;
  symbol: string;
  decimals: number;
};

export type PayContract = {
  id: string; // pay contract address
  token: TokenInfo;
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

export function usePayContracts() {
  const [payContracts, setPayContracts] = useState<PayContract[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPayContracts = async () => {
      try {
        setIsLoading(true);

        // You might want to externalize this URL to an environment variable
        const response = await fetch(
          "https://scholar-indexer.alessandroaw.dev/",
          {
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
          }
        );

        const data = await response.json();

        if (data.errors) {
          throw new Error(data.errors[0].message);
        }

        // Transform the data structure if needed
        const contracts = data.data.payContracts.items.map(
          (item: PayContractItem) => ({
            id: item.id,
            token: {
              id: item.token.id,
              name: item.token.name,
              symbol: item.token.symbol,
              decimals: Number(item.token.decimals),
            },
          })
        );

        setPayContracts(contracts);
      } catch (err) {
        console.error("Error fetching pay contracts:", err);
        setError(err instanceof Error ? err.message : "Unknown error occurred");
      } finally {
        setIsLoading(false);
      }
    };

    fetchPayContracts();
  }, []);

  return { payContracts, isLoading, error };
}
