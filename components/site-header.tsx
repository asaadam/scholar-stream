'use client'

import Link from "next/link";
import { usePathname } from "next/navigation";
import { GraduationCap } from "lucide-react";
import { ConnectKitButton } from "connectkit";

export function SiteHeader() {
  const pathname = usePathname();
  
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex h-16 items-center justify-between">
        <Link href="/" className={`flex items-center space-x-2 ${
          pathname === "/" ? "text-primary" : ""
        }`}>
          <GraduationCap className="h-6 w-6" />
          <span className="font-bold">ScholarStream</span>
        </Link>
        <nav className="flex items-center space-x-4">
          <Link 
            href="/donor/manage-awardees" 
            className={`relative text-sm font-medium px-3 py-2 rounded-md transition-all ${
              pathname === "/donor/manage-awardees" || pathname.startsWith("/donor/")
                ? "text-white bg-primary shadow-md"
                : "text-muted-foreground hover:text-primary hover:bg-muted/50"
            }`}
          >
            Donor
            {(pathname === "/donor/manage-awardees" || pathname.startsWith("/donor/")) && (
              <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-primary mx-1" />
            )}
          </Link>
          <Link 
            href="/awardee" 
            className={`relative text-sm font-medium px-3 py-2 rounded-md transition-all ${
              pathname === "/awardee" || pathname.startsWith("/awardee/")
                ? "text-white bg-primary shadow-md"
                : "text-muted-foreground hover:text-primary hover:bg-muted/50"
            }`}
          >
            Awardee
            {(pathname === "/awardee" || pathname.startsWith("/awardee/")) && (
              <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-primary mx-1" />
            )}
          </Link>
          <Link 
            href="/simulate-yield" 
            className={`relative text-sm font-medium px-3 py-2 rounded-md transition-all ${
              pathname === "/simulate-yield"
                ? "text-white bg-primary shadow-md"
                : "text-muted-foreground hover:text-primary hover:bg-muted/50"
            }`}
          >
            Simulate Yield
            {pathname === "/simulate-yield" && (
              <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-primary mx-1" />
            )}
          </Link>
          <ConnectKitButton />
        </nav>
      </div>
    </header>
  );
}
