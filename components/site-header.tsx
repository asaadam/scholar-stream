import Link from "next/link"
import { GraduationCap } from "lucide-react"

import { WalletConnect } from "@/components/wallet-connect"

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center space-x-2">
          <GraduationCap className="h-6 w-6" />
          <span className="font-bold">ScholarStream</span>
        </Link>
        <nav className="flex items-center space-x-4">
          <Link href="/donor" className="text-sm font-medium">
            Donor
          </Link>
          <Link href="/awardee" className="text-sm font-medium">
            Awardee
          </Link>
          <WalletConnect />
        </nav>
      </div>
    </header>
  )
}

