import React, { useEffect, useRef, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Baby, MeasurementEntry } from "@shared/schema";
import { whoWeightData } from "@/lib/whoData";
import { whoHeightData } from "@/lib/whoHeightData";
import Chart from "chart.js/auto";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface GrowthChartProps {
  baby: Baby;
  entries: MeasurementEntry[];
}

type ChartType = "weight" | "height" | "percentile";

export function GrowthChart({ baby, entries }: GrowthChartProps) {
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstance = useRef<Chart | null>(null);
  const [chartType, setChartType] = useState<ChartType>("weight");
  const [percentileType, setPercentileType] = useState<"weight" | "height">("weight");
  
  // Prepare data for the chart
  useEffect(() => {
    if (!chartRef.current) return;
    
    // Destroy previous chart instance if it exists
    if (chartInstance.current) {
      chartInstance.current.destroy();
    }
    
    const ctx = chartRef.current.getContext("2d");
    if (!ctx) return;
    
    // Get WHO data based on gender
    const whoWeightStandards = baby.gender === "male" ? whoWeightData.boys : whoWeightData.girls;
    const whoHeightStandards = baby.gender === "male" ? whoHeightData.boys : whoHeightData.girls;
    
    // Prepare datasets based on chart type
    if (chartType === "weight") {
      // Weight chart
      chartInstance.current = new Chart(ctx, {
        type: "line",
        data: {
          labels: whoWeightStandards.ageMonths,
          datasets: [
            {
              label: "3rd Percentile",
              data: whoWeightStandards.percentile3,
              borderColor: "rgba(200, 200, 200, 0.7)",
              borderWidth: 1,
              borderDash: [5, 5],
              fill: false,
              pointRadius: 0
            },
            {
              label: "50th Percentile",
              data: whoWeightStandards.percentile50,
              borderColor: "rgba(150, 150, 150, 0.8)",
              borderWidth: 2,
              fill: false,
              pointRadius: 0
            },
            {
              label: "97th Percentile",
              data: whoWeightStandards.percentile97,
              borderColor: "rgba(200, 200, 200, 0.7)",
              borderWidth: 1,
              borderDash: [5, 5],
              fill: false,
              pointRadius: 0
            },
            {
              label: "Your Baby",
              data: entries
                .filter(entry => entry.weight) // Only include entries with weight data
                .map(entry => ({
                  x: Number(entry.ageMonths),
                  y: Number(entry.weight)
                })) as any, // Type assertion needed for Chart.js
              borderColor: "hsl(var(--primary))",
              backgroundColor: "hsl(var(--primary))",
              borderWidth: 2,
              fill: false,
              pointRadius: 6,
              pointHoverRadius: 8
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            title: {
              display: false
            },
            legend: {
              display: false
            },
            tooltip: {
              callbacks: {
                label: function(context) {
                  let label = context.dataset.label || '';
                  if (label) {
                    label += ': ';
                  }
                  if (context.parsed.y !== null) {
                    label += context.parsed.y + ' kg';
                  }
                  return label;
                }
              }
            }
          },
          scales: {
            x: {
              title: {
                display: true,
                text: 'Age (months)'
              }
            },
            y: {
              title: {
                display: true,
                text: 'Weight (kg)'
              }
            }
          }
        }
      });
    } else if (chartType === "height") {
      // Height chart
      chartInstance.current = new Chart(ctx, {
        type: "line",
        data: {
          labels: whoHeightStandards.ageMonths,
          datasets: [
            {
              label: "3rd Percentile",
              data: whoHeightStandards.percentile3,
              borderColor: "rgba(200, 200, 200, 0.7)",
              borderWidth: 1,
              borderDash: [5, 5],
              fill: false,
              pointRadius: 0
            },
            {
              label: "50th Percentile",
              data: whoHeightStandards.percentile50,
              borderColor: "rgba(150, 150, 150, 0.8)",
              borderWidth: 2,
              fill: false,
              pointRadius: 0
            },
            {
              label: "97th Percentile",
              data: whoHeightStandards.percentile97,
              borderColor: "rgba(200, 200, 200, 0.7)",
              borderWidth: 1,
              borderDash: [5, 5],
              fill: false,
              pointRadius: 0
            },
            {
              label: "Your Baby",
              data: entries
                .filter(entry => entry.height) // Only include entries with height data
                .map(entry => ({
                  x: Number(entry.ageMonths),
                  y: Number(entry.height)
                })) as any, // Type assertion needed for Chart.js
              borderColor: "hsl(var(--secondary))",
              backgroundColor: "hsl(var(--secondary))",
              borderWidth: 2,
              fill: false,
              pointRadius: 6,
              pointHoverRadius: 8
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            title: {
              display: false
            },
            legend: {
              display: false
            },
            tooltip: {
              callbacks: {
                label: function(context) {
                  let label = context.dataset.label || '';
                  if (label) {
                    label += ': ';
                  }
                  if (context.parsed.y !== null) {
                    label += context.parsed.y + ' cm';
                  }
                  return label;
                }
              }
            }
          },
          scales: {
            x: {
              title: {
                display: true,
                text: 'Age (months)'
              }
            },
            y: {
              title: {
                display: true,
                text: 'Height (cm)'
              }
            }
          }
        }
      });
    } else if (chartType === "percentile") {
      // Percentile chart - can show either weight or height percentiles
      const percentileData = percentileType === "weight" 
        ? entries
            .filter(entry => entry.weightPercentile)
            .map(entry => ({
              x: Number(entry.ageMonths),
              y: Number(entry.weightPercentile)
            }))
        : entries
            .filter(entry => entry.heightPercentile)
            .map(entry => ({
              x: Number(entry.ageMonths),
              y: Number(entry.heightPercentile)
            }));
            
      const chartColor = percentileType === "weight" 
        ? "hsl(var(--primary))" 
        : "hsl(var(--secondary))";
        
      chartInstance.current = new Chart(ctx, {
        type: "line",
        data: {
          labels: percentileData.map(point => point.x),
          datasets: [
            {
              label: `${percentileType.charAt(0).toUpperCase() + percentileType.slice(1)} Percentile`,
              data: percentileData as any,
              borderColor: chartColor,
              backgroundColor: chartColor,
              borderWidth: 2,
              fill: false,
              pointRadius: 6,
              pointHoverRadius: 8
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            title: {
              display: false
            },
            legend: {
              display: false
            },
            tooltip: {
              callbacks: {
                label: function(context) {
                  return `${percentileType.charAt(0).toUpperCase() + percentileType.slice(1)} Percentile: ${context.parsed.y}%`;
                }
              }
            }
          },
          scales: {
            x: {
              title: {
                display: true,
                text: 'Age (months)'
              }
            },
            y: {
              title: {
                display: true,
                text: 'Percentile'
              },
              min: 0,
              max: 100,
              ticks: {
                callback: function(value) {
                  return value + '%';
                }
              }
            }
          }
        }
      });
    }
    
    // Clean up chart instance on unmount
    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [baby, entries, chartType, percentileType]);
  
  return (
    <Card className="shadow-md h-full">
      <CardContent className="p-4 h-full">
        <div className="flex flex-col mb-4">
          <h2 className="text-xl font-semibold mb-3">Growth Chart</h2>
          
          <Tabs defaultValue="weight" value={chartType} onValueChange={(value) => setChartType(value as ChartType)} className="w-full">
            <TabsList className="grid grid-cols-3 mb-2">
              <TabsTrigger value="weight">Weight</TabsTrigger>
              <TabsTrigger value="height">Height</TabsTrigger>
              <TabsTrigger value="percentile">Percentile</TabsTrigger>
            </TabsList>
            
            {chartType === "percentile" && (
              <div className="flex justify-end my-2">
                <div className="inline-flex rounded-md shadow-sm" role="group">
                  <Button 
                    variant={percentileType === "weight" ? "default" : "outline"} 
                    size="sm"
                    onClick={() => setPercentileType("weight")}
                    className="rounded-r-none"
                  >
                    Weight
                  </Button>
                  <Button 
                    variant={percentileType === "height" ? "default" : "outline"} 
                    size="sm"
                    onClick={() => setPercentileType("height")}
                    className="rounded-l-none"
                  >
                    Height
                  </Button>
                </div>
              </div>
            )}
          </Tabs>
        </div>
        
        <div className="h-[400px] relative">
          <canvas ref={chartRef} />
        </div>
        
        {(chartType === "weight" || chartType === "height") && (
          <div className="mt-4 text-sm text-muted-foreground flex flex-wrap justify-center gap-4">
            <div className="flex items-center">
              <span className={`inline-block w-3 h-3 rounded-full ${chartType === "weight" ? "bg-primary" : "bg-secondary"} mr-1`}></span>
              <span>Your Baby</span>
            </div>
            <div className="flex items-center">
              <span className="inline-block w-3 h-3 rounded-full bg-gray-300 mr-1"></span>
              <span>50th Percentile</span>
            </div>
            <div className="flex items-center">
              <span className="inline-block w-3 h-3 border border-dashed border-gray-400 rounded-full mr-1"></span>
              <span>3rd/97th Percentiles</span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
