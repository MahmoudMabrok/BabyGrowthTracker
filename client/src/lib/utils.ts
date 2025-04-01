import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { getInterpolatedPercentile } from "./whoData";
import { format } from 'date-fns';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Calculate age in months between two dates
export function calculateAgeInMonths(birthDate: string, currentDate: string): number {
  const birth = new Date(birthDate);
  const current = new Date(currentDate);
  
  // Calculate the difference in months
  const months = (current.getFullYear() - birth.getFullYear()) * 12 + 
                (current.getMonth() - birth.getMonth());
  
  // Adjust for partial months
  const birthDay = birth.getDate();
  const currentDay = current.getDate();
  
  // If the current day is earlier in the month than the birth day,
  // we're not quite at a full month since the last whole-month birthday
  if (currentDay < birthDay) {
    return months - (birthDay - currentDay) / 30;
  } else {
    return months + (currentDay - birthDay) / 30;
  }
}

// Format date for display
export function formatDate(dateString: string): string {
  try {
    const date = new Date(dateString);
    return format(date, 'MMMM d, yyyy');
  } catch (error) {
    return dateString;
  }
}

// Format age for display
export function formatAge(ageMonths: number): string {
  if (ageMonths === 0) {
    return "0 (Birth)";
  } else if (ageMonths < 1) {
    // Convert to days for very young babies
    const days = Math.round(ageMonths * 30);
    return `${days} day${days !== 1 ? 's' : ''}`;
  } else if (ageMonths < 24) {
    // Display as months for babies under 2 years
    const roundedMonths = Math.round(ageMonths * 10) / 10;
    return `${roundedMonths} month${roundedMonths !== 1 ? 's' : ''}`;
  } else {
    // Display as years and months for older babies
    const years = Math.floor(ageMonths / 12);
    const months = Math.round(ageMonths % 12);
    if (months === 0) {
      return `${years} year${years !== 1 ? 's' : ''}`;
    } else {
      return `${years} year${years !== 1 ? 's' : ''} ${months} month${months !== 1 ? 's' : ''}`;
    }
  }
}

// Calculate percentile based on WHO growth data
export function calculatePercentile(ageMonths: number, weight: number, gender: string): number {
  return Math.round(getInterpolatedPercentile(ageMonths, weight, gender));
}

// Get percentile range description
export function getPercentileRange(percentile: number): string {
  if (percentile < 3) return "below 3rd";
  if (percentile < 15) return "3rd-15th";
  if (percentile < 50) return "15th-50th";
  if (percentile < 85) return "50th-85th";
  if (percentile < 97) return "85th-97th";
  return "above 97th";
}

// Get color based on percentile
export function getPercentileColor(percentile: number): string {
  if (percentile < 3) return "text-destructive bg-destructive/10";
  if (percentile < 15) return "text-amber-600 bg-amber-100";
  if (percentile < 85) return "text-primary bg-primary/10";
  if (percentile < 97) return "text-amber-600 bg-amber-100";
  return "text-destructive bg-destructive/10";
}

// Get status text based on percentile
export function getPercentileStatus(percentile: number): string {
  if (percentile < 3) return "Low weight";
  if (percentile < 15) return "Slightly underweight";
  if (percentile < 85) return "Healthy weight";
  if (percentile < 97) return "Slightly overweight";
  return "High weight";
}

// Format weight with 2 decimal places
export function formatWeight(weight: number): string {
  return weight.toFixed(2);
}
