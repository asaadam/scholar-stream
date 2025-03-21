"use client"

import { useState } from "react"
import { Wallet } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

export function WalletConnect() {
  const [connected, setConnected] = useState(false)
  const [address, setAddress] = useState("")

  const connectWallet = async () => {
    // Mock wallet connection
    // In a real app, this would use wagmi/viem or ethers.js
    setTimeout(() => {
      const mockAddress = "0x" + Math.random().toString(16).slice(2, 12)
      setAddress(mockAddress)
      setConnected(true)
    }, 500)
  }

  const disconnectWallet = () => {
    setConnected(false)
    setAddress("")
  }

  if (connected) {
    return (
      <Button variant="outline" onClick={disconnectWallet}>
        <Wallet className="mr-2 h-4 w-4" />
        {address.slice(0, 6)}...{address.slice(-4)}
      </Button>
    )
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Wallet className="mr-2 h-4 w-4" />
          Connect Wallet
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Connect your wallet</DialogTitle>
          <DialogDescription>Connect your wallet to access the platform features.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <Button onClick={connectWallet}>MetaMask</Button>
          <Button onClick={connectWallet} variant="outline">
            WalletConnect
          </Button>
          <Button onClick={connectWallet} variant="outline">
            Coinbase Wallet
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

