"use client";

import { useState, useEffect } from "react";
import { useAccount } from "wagmi";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { WalletConnect } from "@/components/wallet-connect";
import { YieldSimulation, useYieldStore } from "@/lib/yieldStore";
import Link from "next/link";

export default function SimulationHistory() {
  const account = useAccount();
  const [userSimulations, setUserSimulations] = useState<YieldSimulation[]>([]);
  const getSimulationsByWallet = useYieldStore((state) => state.getSimulationsByWallet);
  const clearSimulations = useYieldStore((state) => state.clearSimulations);
  
  useEffect(() => {
    if (account.address) {
      // Get all simulations for the current wallet
      const simulations = getSimulationsByWallet(account.address);
      setUserSimulations(simulations);
    } else {
      setUserSimulations([]);
    }
  }, [account.address, getSimulationsByWallet]);

  const getFormattedDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleString();
  };

  const getCompoundingLabel = (period: string) => {
    switch (period) {
      case "daily": return "Daily";
      case "weekly": return "Weekly";
      case "monthly": return "Monthly";
      case "quarterly": return "Quarterly";
      case "annually": return "Annually";
      default: return period;
    }
  };

  const calculateROI = (principal: string, finalAmount: string) => {
    const principalNum = parseFloat(principal);
    const finalNum = parseFloat(finalAmount);
    
    if (principalNum === 0 || isNaN(principalNum) || isNaN(finalNum)) {
      return "0.00";
    }
    
    const roi = ((finalNum - principalNum) / principalNum) * 100;
    return roi.toFixed(2);
  };

  const handleClearSimulations = () => {
    if (confirm("Are you sure you want to clear all your simulation history?")) {
      clearSimulations();
      setUserSimulations([]);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Yield Simulation History</h1>
        <div className="flex items-center space-x-4">
          <Link href="/simulate-yield">
            <Button variant="outline">
              New Simulation
            </Button>
          </Link>
          <WalletConnect />
        </div>
      </div>

      {!account.isConnected ? (
        <Card>
          <CardContent className="py-8">
            <div className="text-center">
              <p className="text-lg mb-4">Please connect your wallet to view your simulation history</p>
              <WalletConnect />
            </div>
          </CardContent>
        </Card>
      ) : userSimulations.length === 0 ? (
        <Card>
          <CardContent className="py-8">
            <div className="text-center">
              <p className="text-lg mb-4">You don&apos;t have any saved simulations yet</p>
              <Link href="/simulate-yield">
                <Button>
                  Create Your First Simulation
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="flex justify-end mb-4">
            <Button 
              variant="destructive" 
              onClick={handleClearSimulations}
              size="sm"
            >
              Clear History
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {userSimulations.map((simulation) => (
              <Card key={simulation.id}>
                <CardHeader>
                  <CardTitle className="text-lg">{getFormattedDate(simulation.createdAt)}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Principal</span>
                      <span className="font-medium">{simulation.principal}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">APY</span>
                      <span className="font-medium">{simulation.apy}%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Duration</span>
                      <span className="font-medium">{simulation.duration} months</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Compounding</span>
                      <span className="font-medium">{getCompoundingLabel(simulation.compoundingPeriod)}</span>
                    </div>
                    <hr />
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Final Amount</span>
                      <span className="font-semibold">{simulation.finalAmount}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">ROI</span>
                      <span className="font-semibold text-green-600">
                        {calculateROI(simulation.principal, simulation.finalAmount)}%
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </>
      )}
    </div>
  );
} 