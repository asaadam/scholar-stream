"use client";

import type React from "react";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useAccount, useWriteContract } from "wagmi";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

// Import factory ABI and store
import factoryAbi from "@/abi/factoryAbi.json";
import { useScholarshipStore, Scholarship } from "@/lib/store";

const FACTORY_ADDRESS = "0xE023c88784F331620e1A1c1eCca7002a84348469";

// Simple UUID generation function
const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substring(2);
};

export default function CreateScholarship() {
  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    amount: "",
    token: "0x9987eb3623FAC93b15F772A93D57198003a9d7E0", // USDF (Mock token)
    duration: "",
    maxAwardees: "",
  });
  // Add state for time period
  const [timePeriod, setTimePeriod] = useState("month");

  // Get the addScholarship function from the store
  const addScholarship = useScholarshipStore((state) => state.addScholarship);

  const account = useAccount();
  const { writeContractAsync, isPending } = useWriteContract();

  // Calculate the streaming rate based on the selected time period
  const calculateStreamRate = (
    amount: number,
    durationMonths: number,
    period: string
  ) => {
    if (isNaN(amount) || isNaN(durationMonths) || durationMonths <= 0) {
      return "0.00";
    }

    switch (period) {
      case "second":
        // Total amount / total seconds
        return (amount / (durationMonths * 30 * 24 * 60 * 60)).toFixed(8);
      case "hour":
        // Total amount / total hours
        return (amount / (durationMonths * 30 * 24)).toFixed(4);
      case "month":
        // Total amount / total months
        return (amount / durationMonths).toFixed(2);
      default:
        return (amount / durationMonths).toFixed(2);
    }
  };

  // Modify handleInputChange to update rate immediately with current values
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { id, value } = e.target;

    // Update formData with the new value immediately
    const updatedFormData = { ...formData, [id]: value };
    setFormData(updatedFormData);

    // Use the updated values for calculation
    if (id === "amount" || id === "duration") {
      const amount = parseFloat(updatedFormData.amount);
      const duration = parseFloat(updatedFormData.duration);

      const rateEl = document.getElementById("rate-display");
      if (rateEl && !isNaN(amount) && !isNaN(duration) && duration > 0) {
        const rate = calculateStreamRate(amount, duration, timePeriod);
        rateEl.textContent = rate;
      }
    }
  };

  // Add handler for time period change with immediate update
  const handleTimePeriodChange = (period: string) => {
    setTimePeriod(period);

    // Update calculation immediately with new period
    const amount = parseFloat(formData.amount);
    const duration = parseFloat(formData.duration);

    const rateEl = document.getElementById("rate-display");
    if (rateEl && !isNaN(amount) && !isNaN(duration) && duration > 0) {
      const rate = calculateStreamRate(amount, duration, period);
      rateEl.textContent = rate;
    }
  };

  const handleTokenChange = (value: string) => {
    setFormData((prev) => ({ ...prev, token: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!account.address) {
      toast.error("Please connect your wallet first");
      return;
    }

    setIsCreating(true);

    try {
      // Calculate the stream rate
      const amount = parseFloat(formData.amount);
      const duration = parseFloat(formData.duration);
      const streamRate = amount / duration;

      // Create scholarship object to store
      const scholarship: Scholarship = {
        id: generateId(),
        name: formData.name,
        description: formData.description,
        amount: formData.amount,
        token: formData.token,
        tokenSymbol: "USDF", // Hardcoded for now, could be dynamic based on token selection
        duration: formData.duration,
        maxAwardees: formData.maxAwardees,
        streamRate: streamRate.toFixed(2),
        createdAt: Date.now(),
      };

      // Call the factory contract to create a new scholarship stream
      await writeContractAsync({
        address: FACTORY_ADDRESS,
        abi: factoryAbi,
        functionName: "createPayContract",
        args: [formData.token],
      });

      // Store the scholarship data with localStorage via Zustand
      addScholarship(scholarship);

      // Show success message
      toast.success("Scholarship stream created successfully!");

      // Redirect after successful creation
      setTimeout(() => {
        window.location.href = "/donor";
      }, 2000);
    } catch (error) {
      console.error("Error creating scholarship:", error);
      toast.error("Failed to create scholarship stream");
      setIsCreating(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mx-auto max-w-2xl">
        <div className="mb-6 flex items-center">
          <Link href="/donor">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Dashboard
            </Button>
          </Link>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Create Scholarship Stream</CardTitle>
            <CardDescription>
              Set up a new scholarship stream using stablecoins that will be
              distributed to awardees over time.
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name">Scholarship Name</Label>
                <Input
                  id="name"
                  placeholder="e.g., Computer Science Excellence Scholarship"
                  required
                  value={formData.name}
                  onChange={handleInputChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Describe the purpose and criteria for this scholarship"
                  rows={4}
                  value={formData.description}
                  onChange={handleInputChange}
                />
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="amount">Total Amount</Label>
                  <div className="flex">
                    <Input
                      id="amount"
                      type="number"
                      min="1"
                      placeholder="10000"
                      required
                      value={formData.amount}
                      onChange={handleInputChange}
                    />
                    <Select
                      defaultValue={formData.token}
                      onValueChange={handleTokenChange}
                    >
                      <SelectTrigger className="w-[120px]">
                        <SelectValue placeholder="Token" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="0x9987eb3623FAC93b15F772A93D57198003a9d7E0">
                          USDF (Mock token)
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="duration">Duration (months)</Label>
                  <Input
                    id="duration"
                    type="number"
                    min="1"
                    max="60"
                    placeholder="12"
                    required
                    value={formData.duration}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <div className="rounded-md bg-muted p-4">
                <div className="font-medium">Streaming Rate</div>
                <div className="mt-1 flex items-baseline">
                  <span id="rate-display" className="text-2xl font-bold">
                    0.00
                  </span>
                  <span className="ml-1 text-muted-foreground">
                    {" "}
                    USDF per {timePeriod}
                  </span>
                </div>

                {/* Time period selection buttons */}
                <div className="mt-2 flex flex-wrap gap-2">
                  <Button
                    type="button"
                    size="sm"
                    variant={timePeriod === "second" ? "default" : "outline"}
                    onClick={() => handleTimePeriodChange("second")}
                  >
                    Per Second
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    variant={timePeriod === "hour" ? "default" : "outline"}
                    onClick={() => handleTimePeriodChange("hour")}
                  >
                    Per Hour
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    variant={timePeriod === "month" ? "default" : "outline"}
                    onClick={() => handleTimePeriodChange("month")}
                  >
                    Per Month
                  </Button>
                </div>

                <p className="mt-2 text-sm text-muted-foreground">
                  Funds will be streamed continuously to awardees, calculated
                  per second based on this rate.
                </p>
                <p className="text-xs text-muted-foreground">
                  Each awardee will receive an equal stream from the total
                  amount.
                </p>
              </div>
            </CardContent>
            <CardFooter>
              <Button
                type="submit"
                className="w-full"
                disabled={isCreating || isPending}
              >
                {isCreating || isPending
                  ? "Creating Scholarship Stream..."
                  : "Create Scholarship Stream"}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
}
