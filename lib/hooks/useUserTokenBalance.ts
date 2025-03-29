import { useState, useEffect } from "react";
import { useReadContract, useAccount } from "wagmi";
import { formatUnits, parseUnits, erc20Abi } from "viem";

export function useUserTokenBalance(tokenAddress?: `0x${string}`) {
  const account = useAccount();
  const [formattedBalance, setFormattedBalance] = useState<string>("0");
  const [tokenDecimals, setTokenDecimals] = useState<number>(18);

  // Fetch token decimals
  const { data: decimalsData } = useReadContract({
    address: tokenAddress,
    abi: erc20Abi,
    functionName: "decimals",
    query: {
      enabled: !!tokenAddress,
      refetchOnMount: true,
    },
  });

  // Fetch user's token balance
  const { data: balanceData, refetch: refetchBalance } = useReadContract({
    address: tokenAddress,
    abi: erc20Abi,
    functionName: "balanceOf",
    args: account.address ? [account.address] : undefined,
    query: {
      enabled: !!tokenAddress && !!account.address,
      refetchOnMount: true,
    },
  });

  // Reset state when tokenAddress changes
  useEffect(() => {
    setFormattedBalance("0");
    setTokenDecimals(18);
  }, [tokenAddress]);

  // Update token decimals
  useEffect(() => {
    if (decimalsData !== undefined) {
      setTokenDecimals(Number(decimalsData));
    }
  }, [decimalsData]);

  // Format balance when it changes
  useEffect(() => {
    if (balanceData && tokenDecimals !== undefined) {
      setFormattedBalance(formatUnits(balanceData as bigint, tokenDecimals));
    }
  }, [balanceData, tokenDecimals]);

  // Helper function for parsing amounts
  const parseAmount = (amount: string): bigint => {
    return parseUnits(amount, tokenDecimals);
  };

  return {
    balance: balanceData as bigint | undefined,
    formattedBalance,
    tokenDecimals,
    refetchBalance,
    parseAmount,
  };
} 