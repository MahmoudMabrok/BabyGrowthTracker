import { WHOGrowthData } from './whoData';

export interface WHOHeightData {
  boys: WHOGrowthData;
  girls: WHOGrowthData;
}

// WHO Height-for-age growth standards for children 0-5 years
// Data source: https://www.who.int/tools/child-growth-standards
export const whoHeightData: WHOHeightData = {
  boys: {
    ageMonths: [
      0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 14, 16, 18, 20, 22, 24, 
      26, 28, 30, 32, 34, 36, 38, 40, 42, 44, 46, 48, 50, 52, 54, 56, 58, 60
    ],
    percentile3: [
      46.3, 51.1, 54.7, 57.6, 60.0, 61.9, 63.6, 65.1, 66.5, 67.7, 69.0, 70.1, 71.2, 
      73.1, 74.9, 76.5, 78.0, 79.3, 80.5, 81.7, 82.8, 83.9, 84.9, 85.8, 86.7, 
      87.5, 88.3, 89.1, 89.9, 90.6, 91.3, 92.0, 92.7, 93.3, 94.0, 94.6, 95.2
    ],
    percentile15: [
      48.2, 53.0, 56.7, 59.6, 62.0, 64.0, 65.7, 67.3, 68.7, 70.0, 71.3, 72.4, 73.6, 
      75.6, 77.4, 79.0, 80.5, 81.9, 83.2, 84.4, 85.6, 86.7, 87.8, 88.8, 89.8, 
      90.7, 91.6, 92.5, 93.3, 94.1, 94.9, 95.6, 96.4, 97.1, 97.8, 98.5, 99.1
    ],
    percentile50: [
      49.9, 54.7, 58.4, 61.4, 63.9, 65.9, 67.6, 69.2, 70.6, 72.0, 73.3, 74.5, 75.7, 
      77.8, 79.6, 81.2, 82.8, 84.2, 85.6, 86.9, 88.1, 89.3, 90.5, 91.6, 92.7, 
      93.7, 94.7, 95.7, 96.7, 97.6, 98.5, 99.4, 100.3, 101.1, 101.9, 102.7, 103.5
    ],
    percentile85: [
      51.6, 56.4, 60.2, 63.2, 65.7, 67.7, 69.5, 71.0, 72.5, 73.9, 75.3, 76.6, 77.8, 
      79.9, 81.8, 83.5, 85.1, 86.6, 88.0, 89.4, 90.7, 92.0, 93.3, 94.5, 95.7, 
      96.8, 97.9, 99.0, 100.1, 101.1, 102.1, 103.1, 104.1, 105.0, 106.0, 106.9, 107.8
    ],
    percentile97: [
      53.4, 58.2, 62.1, 65.1, 67.6, 69.8, 71.6, 73.2, 74.7, 76.2, 77.6, 78.9, 80.2, 
      82.3, 84.2, 86.0, 87.6, 89.2, 90.7, 92.1, 93.5, 94.9, 96.2, 97.5, 98.8, 
      100.0, 101.2, 102.4, 103.5, 104.7, 105.8, 106.9, 108.0, 109.1, 110.1, 111.2, 112.2
    ]
  },
  girls: {
    ageMonths: [
      0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 14, 16, 18, 20, 22, 24, 
      26, 28, 30, 32, 34, 36, 38, 40, 42, 44, 46, 48, 50, 52, 54, 56, 58, 60
    ],
    percentile3: [
      45.6, 50.0, 53.2, 55.8, 58.0, 59.9, 61.5, 62.9, 64.3, 65.6, 66.8, 68.0, 69.1, 
      71.0, 72.8, 74.4, 75.8, 77.0, 78.1, 79.1, 80.0, 80.8, 81.5, 82.2, 82.8, 
      83.4, 84.0, 84.6, 85.2, 85.7, 86.3, 86.8, 87.4, 87.9, 88.4, 88.9, 89.3
    ],
    percentile15: [
      47.0, 51.5, 54.7, 57.4, 59.6, 61.5, 63.2, 64.7, 66.1, 67.4, 68.7, 69.9, 71.0, 
      73.0, 74.8, 76.4, 77.8, 79.1, 80.2, 81.2, 82.1, 83.0, 83.7, 84.4, 85.0, 
      85.6, 86.2, 86.7, 87.2, 87.7, 88.2, 88.7, 89.1, 89.6, 90.0, 90.5, 90.9
    ],
    percentile50: [
      49.1, 53.7, 57.1, 59.8, 62.1, 64.0, 65.7, 67.3, 68.7, 70.1, 71.5, 72.8, 74.0, 
      76.0, 77.8, 79.5, 81.0, 82.3, 83.5, 84.6, 85.6, 86.5, 87.4, 88.3, 89.0, 
      89.7, 90.4, 91.0, 91.6, 92.2, 92.8, 93.4, 93.9, 94.4, 95.0, 95.5, 95.9
    ],
    percentile85: [
      51.1, 55.9, 59.3, 62.0, 64.3, 66.3, 68.1, 69.7, 71.3, 72.8, 74.2, 75.6, 76.9, 
      79.0, 81.0, 82.7, 84.2, 85.7, 87.0, 88.2, 89.3, 90.4, 91.4, 92.4, 93.2, 
      94.1, 95.0, 95.8, 96.6, 97.3, 98.1, 98.9, 99.7, 100.4, 101.2, 101.9, 102.7
    ],
    percentile97: [
      52.9, 57.9, 61.4, 64.1, 66.4, 68.5, 70.3, 72.0, 73.7, 75.2, 76.7, 78.2, 79.6, 
      81.7, 83.7, 85.6, 87.2, 88.8, 90.2, 91.5, 92.7, 93.9, 95.0, 96.1, 97.1, 
      98.1, 99.0, 99.9, 100.8, 101.7, 102.5, 103.4, 104.3, 105.1, 105.9, 106.7, 107.5
    ]
  }
};

// Function to find the closest age index in the WHO data
export function getClosestHeightAgeIndex(ageMonths: number, gender: string): number {
  const data = gender === 'female' ? whoHeightData.girls : whoHeightData.boys;
  
  // Handle age outside the range
  if (ageMonths < 0) return 0;
  if (ageMonths > data.ageMonths[data.ageMonths.length - 1]) {
    return data.ageMonths.length - 1;
  }
  
  // Find the closest age
  let closestIndex = 0;
  let minDifference = Math.abs(data.ageMonths[0] - ageMonths);
  
  for (let i = 1; i < data.ageMonths.length; i++) {
    const difference = Math.abs(data.ageMonths[i] - ageMonths);
    if (difference < minDifference) {
      minDifference = difference;
      closestIndex = i;
    }
  }
  
  return closestIndex;
}

// Function to interpolate between percentile values
export function getInterpolatedHeightPercentile(age: number, height: number, gender: string): number {
  const data = gender === 'female' ? whoHeightData.girls : whoHeightData.boys;
  const ageData = data.ageMonths;
  const p3Data = data.percentile3;
  const p15Data = data.percentile15;
  const p50Data = data.percentile50;
  const p85Data = data.percentile85;
  const p97Data = data.percentile97;
  
  // Handle age outside the range
  if (age < 0) age = 0;
  if (age > ageData[ageData.length - 1]) age = ageData[ageData.length - 1];
  
  // Find indices for interpolation
  let lowerIndex = 0;
  while (lowerIndex < ageData.length - 1 && ageData[lowerIndex + 1] <= age) {
    lowerIndex++;
  }
  
  const upperIndex = Math.min(lowerIndex + 1, ageData.length - 1);
  
  // Interpolate percentile values
  let lowerAge = ageData[lowerIndex];
  let upperAge = ageData[upperIndex];
  let ageFactor = (upperAge === lowerAge) ? 0 : (age - lowerAge) / (upperAge - lowerAge);
  
  const p3 = p3Data[lowerIndex] + ageFactor * (p3Data[upperIndex] - p3Data[lowerIndex]);
  const p15 = p15Data[lowerIndex] + ageFactor * (p15Data[upperIndex] - p15Data[lowerIndex]);
  const p50 = p50Data[lowerIndex] + ageFactor * (p50Data[upperIndex] - p50Data[lowerIndex]);
  const p85 = p85Data[lowerIndex] + ageFactor * (p85Data[upperIndex] - p85Data[lowerIndex]);
  const p97 = p97Data[lowerIndex] + ageFactor * (p97Data[upperIndex] - p97Data[lowerIndex]);
  
  // Calculate percentile based on height
  let percentile = 50;
  
  if (height <= p3) {
    percentile = 3 * (height / p3);
  } else if (height <= p15) {
    percentile = 3 + (15 - 3) * ((height - p3) / (p15 - p3));
  } else if (height <= p50) {
    percentile = 15 + (50 - 15) * ((height - p15) / (p50 - p15));
  } else if (height <= p85) {
    percentile = 50 + (85 - 50) * ((height - p50) / (p85 - p50));
  } else if (height <= p97) {
    percentile = 85 + (97 - 85) * ((height - p85) / (p97 - p85));
  } else {
    percentile = 97 + (100 - 97) * ((height - p97) / (p97 * 0.05)); // approximate
  }
  
  return Math.min(100, Math.max(0, percentile));
}