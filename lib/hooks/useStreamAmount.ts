import { useState, useEffect } from 'react';

interface StreamAmountProps {
  amountPerSec: string;
  amountReceived: string;
  status: 'Active' | 'Paused';
}

export function useStreamAmount({ amountPerSec, amountReceived, status }: StreamAmountProps) {
  const [currentAmount, setCurrentAmount] = useState(parseFloat(amountReceived));

  useEffect(() => {
    if (status !== 'Active') {
      setCurrentAmount(parseFloat(amountReceived));
      return;
    }

    const interval = setInterval(() => {
      setCurrentAmount((prev) => {
        const amountPerSecNum = parseFloat(amountPerSec);
        // Calculate the amount for 10ms: (amountPerSec / 1000) * 10
        const amountPer10Ms = (amountPerSecNum / 1000) * 10;
        return prev + amountPer10Ms;
      });
    }, 10);

    return () => clearInterval(interval);
  }, [amountPerSec, amountReceived, status]);

  return currentAmount;
} 