import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}



export const formatCurrency = (amount: string | number) => {
  const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;

  // For amounts less than 1 lakh, use standard formatting
  if (numAmount < 100000) {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(numAmount);
  }

  // For amounts in lakhs (1,00,000 to 99,99,999)
  if (numAmount < 10000000) {
    const lakhs = numAmount / 100000;
    return `₹${lakhs.toFixed(2)} Lakh` + (lakhs !== 1 ? 's' : '');
  }

  // For amounts in crores (1,00,00,000 and above)
  const crores = numAmount / 10000000;
  return `₹${crores.toFixed(2)} Crore` + (crores !== 1 ? 's' : '');
}