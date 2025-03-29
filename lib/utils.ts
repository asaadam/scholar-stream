import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const getAwardeeNamesKey = (payerAddress: string) =>
  `awardee_names_${payerAddress}`;

export function getAwardeeName(
  payerAddress: string,
  awardeeAddress: string
): string | null {
  if (!payerAddress) return null;
  const names = JSON.parse(
    localStorage.getItem(getAwardeeNamesKey(payerAddress)) || "{}"
  );
  return names[awardeeAddress] || null;
}

export function setAwardeeName(
  payerAddress: string,
  awardeeAddress: string,
  name: string
) {
  if (!payerAddress) return;
  const key = getAwardeeNamesKey(payerAddress);
  const names = JSON.parse(localStorage.getItem(key) || "{}");
  names[awardeeAddress] = name;
  localStorage.setItem(key, JSON.stringify(names));
}
