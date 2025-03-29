interface StreamCalculationParams {
  startTimestamp: string;
  amountPerSec: string;
  amountReceived?: string;
}

export function calculateStreamAmount({
  startTimestamp,
  amountPerSec,
  amountReceived = "0",
}: StreamCalculationParams): number {
  const startTime = parseInt(startTimestamp) * 1000;
  const now = Date.now();
  const totalTimeInSeconds = (now - startTime) / 1000;
  const amountPerSecNum = parseFloat(amountPerSec);
  const amountReceivedNum = parseFloat(amountReceived);

  // Validate values
  if (
    isNaN(startTime) ||
    isNaN(totalTimeInSeconds) ||
    isNaN(amountPerSecNum) ||
    isNaN(amountReceivedNum)
  ) {
    console.error("Invalid values:", {
      startTime,
      totalTimeInSeconds,
      amountPerSec: amountPerSecNum,
      amountReceived: amountReceivedNum,
    });
    return 0;
  }

  const totalAccruedAmount = amountPerSecNum * totalTimeInSeconds;
  const unclaimedAmount = totalAccruedAmount - amountReceivedNum;

  return amountReceivedNum + Math.max(0, unclaimedAmount);
}

export function calculateAmountPerMs(amountPerSec: string): number {
  const amountPerSecNum = parseFloat(amountPerSec);
  if (isNaN(amountPerSecNum)) {
    console.error("Invalid amountPerSec:", amountPerSec);
    return 0;
  }
  return amountPerSecNum / 1000;
} 