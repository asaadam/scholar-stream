import { useState, useEffect } from "react";
import { useReadContract } from "wagmi";
import { formatUnits, parseUnits, erc20Abi } from "viem";

export type TokenInfo = {
  symbol: string;
  decimals: number;
  balance?: string;
  formattedBalance?: string;
};

export function useTokenInfo(
  tokenAddress?: `0x${string}`,
  balanceAddress?: `0x${string}`
) {
  const [tokenInfo, setTokenInfo] = useState<TokenInfo>({
    symbol: "",
    decimals: 18, // Default to 18
  });

  // Fetch token symbol
  const { data: symbolData } = useReadContract({
    address: tokenAddress,
    abi: erc20Abi,
    functionName: "symbol",
    query: {
      enabled: !!tokenAddress,
    },
  });

  // Fetch token decimals
  const { data: decimalsData } = useReadContract({
    address: tokenAddress,
    abi: erc20Abi,
    functionName: "decimals",
    query: {
      enabled: !!tokenAddress,
    },
  });

  // Fetch token balance if balanceAddress is provided
  const { data: balanceData, refetch: refetchBalance } = useReadContract({
    address: tokenAddress,
    abi: erc20Abi,
    functionName: "balanceOf",
    args: balanceAddress ? [balanceAddress] : undefined,
    query: {
      enabled: !!tokenAddress && !!balanceAddress,
    },
  });

  // Update token info when data changes
  useEffect(() => {
    const newInfo: TokenInfo = { ...tokenInfo };
    
    if (symbolData !== undefined) {
      newInfo.symbol = symbolData as string;
    }
    
    if (decimalsData !== undefined) {
      newInfo.decimals = Number(decimalsData);
    }
    
    if (balanceData !== undefined) {
      const balance = balanceData as bigint;
      newInfo.balance = balance.toString();
      newInfo.formattedBalance = formatUnits(balance, newInfo.decimals);
    }
    
    setTokenInfo(newInfo);
  }, [symbolData, decimalsData, balanceData]);

  // Helper functions
  const formatAmount = (amount: bigint | string): string => {
    if (typeof amount === "string") {
      // If it's already formatted, return as is
      if (amount.includes(".")) return amount;
      // Otherwise, convert to bigint first
      return formatUnits(BigInt(amount), tokenInfo.decimals);
    }
    return formatUnits(amount, tokenInfo.decimals);
  };

  const parseAmount = (amount: string): bigint => {
    return parseUnits(amount, tokenInfo.decimals);
  };

  return {
    tokenInfo,
    refetchBalance,
    formatAmount,
    parseAmount,
  };
} 