// WHO growth standards based on weight-for-age data
// Source: World Health Organization (simplified for implementation)

export interface WHOGrowthData {
  ageMonths: number[];
  percentile3: number[];
  percentile15: number[];
  percentile50: number[];
  percentile85: number[];
  percentile97: number[];
}

export interface WHOWeightData {
  boys: WHOGrowthData;
  girls: WHOGrowthData;
}

// WHO weight-for-age data from birth to 24 months
export const whoWeightData: WHOWeightData = {
  boys: {
    ageMonths: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 14, 16, 18, 20, 22, 24],
    percentile3: [2.5, 3.4, 4.3, 5.0, 5.6, 6.0, 6.4, 6.7, 7.0, 7.3, 7.5, 7.7, 7.9, 8.3, 8.6, 8.9, 9.2, 9.4, 9.7],
    percentile15: [2.9, 3.9, 4.9, 5.7, 6.2, 6.7, 7.1, 7.4, 7.7, 8.0, 8.2, 8.4, 8.6, 9.0, 9.4, 9.7, 10.0, 10.3, 10.5],
    percentile50: [3.3, 4.5, 5.6, 6.4, 7.0, 7.5, 7.9, 8.3, 8.6, 8.9, 9.2, 9.4, 9.6, 10.1, 10.5, 10.9, 11.3, 11.6, 11.9],
    percentile85: [3.7, 5.0, 6.2, 7.1, 7.8, 8.3, 8.8, 9.2, 9.6, 9.9, 10.2, 10.5, 10.8, 11.3, 11.7, 12.2, 12.6, 13.0, 13.3],
    percentile97: [4.3, 5.8, 7.1, 8.0, 8.7, 9.3, 9.8, 10.3, 10.7, 11.0, 11.4, 11.7, 12.0, 12.5, 13.0, 13.5, 14.0, 14.4, 14.8]
  },
  girls: {
    ageMonths: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 14, 16, 18, 20, 22, 24],
    percentile3: [2.4, 3.2, 4.0, 4.6, 5.1, 5.5, 5.8, 6.1, 6.3, 6.6, 6.8, 7.0, 7.1, 7.5, 7.8, 8.1, 8.4, 8.6, 8.9],
    percentile15: [2.8, 3.6, 4.5, 5.2, 5.7, 6.1, 6.5, 6.8, 7.0, 7.3, 7.5, 7.7, 7.9, 8.3, 8.6, 9.0, 9.3, 9.5, 9.8],
    percentile50: [3.2, 4.2, 5.1, 5.8, 6.4, 6.9, 7.3, 7.6, 7.9, 8.2, 8.5, 8.7, 8.9, 9.3, 9.6, 10.0, 10.4, 10.7, 11.0],
    percentile85: [3.6, 4.8, 5.8, 6.6, 7.3, 7.8, 8.2, 8.6, 8.9, 9.2, 9.5, 9.8, 10.1, 10.5, 10.9, 11.4, 11.8, 12.2, 12.5],
    percentile97: [4.2, 5.5, 6.6, 7.5, 8.2, 8.8, 9.3, 9.7, 10.0, 10.4, 10.7, 11.0, 11.3, 11.8, 12.2, 12.8, 13.3, 13.7, 14.2]
  }
};

// Helper function to get the closest age index
export function getClosestAgeIndex(ageMonths: number, gender: string): number {
  const data = gender === 'male' ? whoWeightData.boys : whoWeightData.girls;
  
  // Find the closest age index
  let closestIndex = 0;
  let smallestDifference = Math.abs(data.ageMonths[0] - ageMonths);
  
  for (let i = 1; i < data.ageMonths.length; i++) {
    const difference = Math.abs(data.ageMonths[i] - ageMonths);
    if (difference < smallestDifference) {
      smallestDifference = difference;
      closestIndex = i;
    }
  }
  
  return closestIndex;
}

// Helper function to interpolate percentile values
export function getInterpolatedPercentile(age: number, weight: number, gender: string): number {
  const data = gender === 'male' ? whoWeightData.boys : whoWeightData.girls;
  
  // Find the two closest age indices
  let lowerIndex = 0;
  let upperIndex = data.ageMonths.length - 1;
  
  for (let i = 0; i < data.ageMonths.length; i++) {
    if (data.ageMonths[i] <= age && (i === data.ageMonths.length - 1 || data.ageMonths[i + 1] > age)) {
      lowerIndex = i;
      upperIndex = Math.min(i + 1, data.ageMonths.length - 1);
      break;
    }
  }
  
  // If age is exactly at a data point, no need for interpolation
  if (data.ageMonths[lowerIndex] === age) {
    if (weight <= data.percentile3[lowerIndex]) return 3;
    if (weight <= data.percentile15[lowerIndex]) {
      // Interpolate between 3rd and 15th
      return 3 + (15 - 3) * (weight - data.percentile3[lowerIndex]) / (data.percentile15[lowerIndex] - data.percentile3[lowerIndex]);
    }
    if (weight <= data.percentile50[lowerIndex]) {
      // Interpolate between 15th and 50th
      return 15 + (50 - 15) * (weight - data.percentile15[lowerIndex]) / (data.percentile50[lowerIndex] - data.percentile15[lowerIndex]);
    }
    if (weight <= data.percentile85[lowerIndex]) {
      // Interpolate between 50th and 85th
      return 50 + (85 - 50) * (weight - data.percentile50[lowerIndex]) / (data.percentile85[lowerIndex] - data.percentile50[lowerIndex]);
    }
    if (weight <= data.percentile97[lowerIndex]) {
      // Interpolate between 85th and 97th
      return 85 + (97 - 85) * (weight - data.percentile85[lowerIndex]) / (data.percentile97[lowerIndex] - data.percentile85[lowerIndex]);
    }
    return 97;
  }
  
  // Interpolate between two age points
  const ageDiff = data.ageMonths[upperIndex] - data.ageMonths[lowerIndex];
  const ratio = (age - data.ageMonths[lowerIndex]) / ageDiff;
  
  // Interpolate each percentile value
  const p3 = data.percentile3[lowerIndex] + ratio * (data.percentile3[upperIndex] - data.percentile3[lowerIndex]);
  const p15 = data.percentile15[lowerIndex] + ratio * (data.percentile15[upperIndex] - data.percentile15[lowerIndex]);
  const p50 = data.percentile50[lowerIndex] + ratio * (data.percentile50[upperIndex] - data.percentile50[lowerIndex]);
  const p85 = data.percentile85[lowerIndex] + ratio * (data.percentile85[upperIndex] - data.percentile85[lowerIndex]);
  const p97 = data.percentile97[lowerIndex] + ratio * (data.percentile97[upperIndex] - data.percentile97[lowerIndex]);
  
  // Determine percentile based on weight
  if (weight <= p3) return 3;
  if (weight <= p15) {
    // Interpolate between 3rd and 15th
    return 3 + (15 - 3) * (weight - p3) / (p15 - p3);
  }
  if (weight <= p50) {
    // Interpolate between 15th and 50th
    return 15 + (50 - 15) * (weight - p15) / (p50 - p15);
  }
  if (weight <= p85) {
    // Interpolate between 50th and 85th
    return 50 + (85 - 50) * (weight - p50) / (p85 - p50);
  }
  if (weight <= p97) {
    // Interpolate between 85th and 97th
    return 85 + (97 - 85) * (weight - p85) / (p97 - p85);
  }
  return 97;
}
