"use client";

import { ConnectKitProvider } from "connectkit";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider } from "wagmi";
import { config } from "@/config/wagmi";
import { ProgressProvider } from "@bprogress/next/app";
// Create a client
const queryClient = new QueryClient();

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ProgressProvider>
      <WagmiProvider config={config}>
        <QueryClientProvider client={queryClient}>
          <ConnectKitProvider>{children}</ConnectKitProvider>
        </QueryClientProvider>
      </WagmiProvider>
    </ProgressProvider>
  );
}
