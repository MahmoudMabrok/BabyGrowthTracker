import React, { useEffect, useRef, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Baby, WeightEntry } from "@shared/schema";
import { whoWeightData } from "@/lib/whoData";
import Chart from "chart.js/auto";

interface GrowthChartProps {
  baby: Baby;
  entries: WeightEntry[];
}

export function GrowthChart({ baby, entries }: GrowthChartProps) {
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstance = useRef<Chart | null>(null);
  const [chartView, setChartView] = useState<"weight" | "percentile">("weight");
  
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
    const whoData = baby.gender === "male" ? whoWeightData.boys : whoWeightData.girls;
    
    // Prepare datasets
    if (chartView === "weight") {
      // Weight chart
      chartInstance.current = new Chart(ctx, {
        type: "line",
        data: {
          labels: whoData.ageMonths,
          datasets: [
            {
              label: "3rd Percentile",
              data: whoData.percentile3,
              borderColor: "rgba(200, 200, 200, 0.7)",
              borderWidth: 1,
              borderDash: [5, 5],
              fill: false,
              pointRadius: 0
            },
            {
              label: "50th Percentile",
              data: whoData.percentile50,
              borderColor: "rgba(150, 150, 150, 0.8)",
              borderWidth: 2,
              fill: false,
              pointRadius: 0
            },
            {
              label: "97th Percentile",
              data: whoData.percentile97,
              borderColor: "rgba(200, 200, 200, 0.7)",
              borderWidth: 1,
              borderDash: [5, 5],
              fill: false,
              pointRadius: 0
            },
            {
              label: "Your Baby",
              data: entries.map(entry => ({
                x: Number(entry.ageMonths),
                y: Number(entry.weight)
              })),
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
    } else {
      // Percentile chart
      chartInstance.current = new Chart(ctx, {
        type: "line",
        data: {
          labels: entries.map(entry => Number(entry.ageMonths)),
          datasets: [
            {
              label: "Percentile",
              data: entries.map(entry => Number(entry.percentile)),
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
                  return `Percentile: ${context.parsed.y}%`;
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
  }, [baby, entries, chartView]);
  
  return (
    <Card className="shadow-md h-full">
      <CardContent className="p-4 h-full">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Growth Chart</h2>
          <div className="flex space-x-2">
            <Button 
              variant={chartView === "weight" ? "default" : "outline"} 
              size="sm"
              onClick={() => setChartView("weight")}
            >
              Weight
            </Button>
            <Button 
              variant={chartView === "percentile" ? "default" : "outline"} 
              size="sm"
              onClick={() => setChartView("percentile")}
            >
              Percentile
            </Button>
          </div>
        </div>
        
        <div className="h-[400px] relative">
          <canvas ref={chartRef} />
        </div>
        
        {chartView === "weight" && (
          <div className="mt-4 text-sm text-gray-500 flex flex-wrap justify-center gap-4">
            <div className="flex items-center">
              <span className="inline-block w-3 h-3 rounded-full bg-primary mr-1"></span>
              <span>Your Baby</span>
            </div>
            <div className="flex items-center">
              <span className="inline-block w-3 h-3 rounded-full bg-gray-300 mr-1"></span>
              <span>50th Percentile</span>
            </div>
            <div className="flex items-center">
              <span className="inline-block w-3 h-3 border border-dashed border-gray-400 rounded-full mr-1"></span>
              <span>3rd Percentile</span>
            </div>
            <div className="flex items-center">
              <span className="inline-block w-3 h-3 border border-dashed border-gray-400 rounded-full mr-1"></span>
              <span>97th Percentile</span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
