import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Baby, WeightEntry } from "@shared/schema";
import { formatDate, getPercentileRange, getPercentileStatus } from "@/lib/utils";
import { InfoIcon } from "lucide-react";

interface GrowthSummaryProps {
  baby: Baby;
  entries: WeightEntry[];
}

export function GrowthSummary({ baby, entries }: GrowthSummaryProps) {
  if (entries.length === 0) return null;
  
  // Get the latest entry (considering entries are sorted by age)
  const latestEntry = entries[entries.length - 1];
  
  // Get the birth entry (first entry)
  const birthEntry = entries[0];
  
  // Calculate weight gain
  const weightGain = Number(latestEntry.weight) - Number(birthEntry.weight);
  
  // Determine percentile range and status
  const percentileRange = getPercentileRange(Number(latestEntry.percentile));
  const percentileStatus = getPercentileStatus(Number(latestEntry.percentile));
  
  return (
    <Card className="shadow-md mt-8">
      <CardContent className="pt-6">
        <h2 className="text-xl font-semibold mb-4">Growth Summary</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="border border-gray-200 rounded-lg p-4 text-center">
            <div className="text-gray-500 mb-1">Current Weight</div>
            <div className="text-2xl font-bold text-gray-800">
              {Number(latestEntry.weight).toFixed(2)} kg
            </div>
            <div className="text-sm text-gray-500">
              {formatDate(latestEntry.date)}
            </div>
          </div>
          
          <div className="border border-gray-200 rounded-lg p-4 text-center">
            <div className="text-gray-500 mb-1">Current Percentile</div>
            <div className="text-2xl font-bold text-success">
              {latestEntry.percentile}th
            </div>
            <div className="text-sm text-success">{percentileStatus}</div>
          </div>
          
          <div className="border border-gray-200 rounded-lg p-4 text-center">
            <div className="text-gray-500 mb-1">Weight Gain</div>
            <div className="text-2xl font-bold text-gray-800">
              +{weightGain.toFixed(2)} kg
            </div>
            <div className="text-sm text-gray-500">since birth</div>
          </div>
        </div>
        
        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <div className="flex items-start">
            <div className="flex-shrink-0 pt-0.5">
              <InfoIcon className="h-5 w-5 text-accent" />
            </div>
            <div className="ml-3 text-sm text-gray-700">
              <h3 className="font-medium text-gray-900">What this means</h3>
              <div className="mt-2">
                <p>
                  Your baby is currently in the <span className="font-medium">{percentileRange}</span> percentile 
                  range for weight, which is considered {percentileStatus.toLowerCase()}.
                </p>
                <p className="mt-1">
                  The WHO growth charts are used to assess how your baby is growing compared to other healthy 
                  children of the same age and gender.
                </p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
