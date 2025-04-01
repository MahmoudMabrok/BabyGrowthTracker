import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Baby, MeasurementEntry } from "@shared/schema";
import { formatDate, formatAge, getPercentileColor, formatHeightDisplay } from "@/lib/utils";
import { Pencil, Trash2, Scale, Ruler, FileText, Info } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface EntriesTableProps {
  baby: Baby;
  entries: MeasurementEntry[];
  onEdit: (entry: MeasurementEntry) => void;
  onDelete: (entryId: number) => void;
}

export function EntriesTable({ baby, entries, onEdit, onDelete }: EntriesTableProps) {
  const [activeTab, setActiveTab] = useState<string>("all");
  
  const renderEntryWeight = (entry: MeasurementEntry) => {
    if (!entry.weight) return "-";
    return `${Number(entry.weight).toFixed(2)} kg`;
  };
  
  const renderEntryHeight = (entry: MeasurementEntry) => {
    if (!entry.height) return "-";
    return `${Number(entry.height).toFixed(1)} cm`;
  };
  
  const renderWeightPercentile = (entry: MeasurementEntry) => {
    if (!entry.weightPercentile) return "-";
    return (
      <span className={`px-2 py-1 text-xs rounded-full font-medium ${getPercentileColor(Number(entry.weightPercentile))}`}>
        {entry.weightPercentile}th
      </span>
    );
  };
  
  const renderHeightPercentile = (entry: MeasurementEntry) => {
    if (!entry.heightPercentile) return "-";
    return (
      <span className={`px-2 py-1 text-xs rounded-full font-medium ${getPercentileColor(Number(entry.heightPercentile))}`}>
        {entry.heightPercentile}th
      </span>
    );
  };
  
  const renderMeasurementType = (entry: MeasurementEntry) => {
    const types = [];
    
    if (entry.weight) types.push(
      <TooltipProvider key="weight-provider">
        <Tooltip key="weight">
          <TooltipTrigger asChild>
            <Scale className="h-4 w-4 text-primary mr-1" />
          </TooltipTrigger>
          <TooltipContent>
            <p>Weight recorded</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
    
    if (entry.height) types.push(
      <TooltipProvider key="height-provider">
        <Tooltip key="height">
          <TooltipTrigger asChild>
            <Ruler className="h-4 w-4 text-secondary mr-1" />
          </TooltipTrigger>
          <TooltipContent>
            <p>Height recorded</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
    
    if (entry.notes) types.push(
      <TooltipProvider key="notes-provider">
        <Tooltip key="notes">
          <TooltipTrigger asChild>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </TooltipTrigger>
          <TooltipContent>
            <p>Has notes</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
    
    return (
      <div className="flex items-center">{types}</div>
    );
  };
  
  // Filter entries based on active tab
  const filteredEntries = entries.filter(entry => {
    if (activeTab === "all") return true;
    if (activeTab === "weight") return entry.weight !== null;
    if (activeTab === "height") return entry.height !== null;
    return true;
  });

  return (
    <Card className="shadow-md">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-center">
          <CardTitle className="text-xl font-semibold text-primary">Measurement History</CardTitle>
          <div className="text-sm text-muted-foreground">
            {entries.length} {entries.length === 1 ? 'entry' : 'entries'}
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="mb-4">
          <TabsList className="w-full grid grid-cols-3">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="weight">Weight</TabsTrigger>
            <TabsTrigger value="height">Height</TabsTrigger>
          </TabsList>
        </Tabs>
        
        {filteredEntries.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-border">
              <thead className="bg-muted/50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Date</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Age</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Type</th>
                  
                  {(activeTab === "all" || activeTab === "weight") && (
                    <>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Weight</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Weight %</th>
                    </>
                  )}
                  
                  {(activeTab === "all" || activeTab === "height") && (
                    <>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Height</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Height %</th>
                    </>
                  )}
                  
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-card divide-y divide-border">
                {filteredEntries.map((entry) => {
                  const isBirthEntry = entry.date === baby.birthDate && Number(entry.ageMonths) === 0;
                  
                  return (
                    <tr key={entry.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground">
                        {formatDate(entry.date)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground">
                        {formatAge(Number(entry.ageMonths))}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground">
                        {renderMeasurementType(entry)}
                      </td>
                      
                      {(activeTab === "all" || activeTab === "weight") && (
                        <>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground">
                            {renderEntryWeight(entry)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            {renderWeightPercentile(entry)}
                          </td>
                        </>
                      )}
                      
                      {(activeTab === "all" || activeTab === "height") && (
                        <>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground">
                            {renderEntryHeight(entry)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            {renderHeightPercentile(entry)}
                          </td>
                        </>
                      )}
                      
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        {isBirthEntry ? (
                          <span className="text-muted-foreground">(Birth)</span>
                        ) : (
                          <div className="flex space-x-2">
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              onClick={() => onEdit(entry)}
                              className="h-8 w-8"
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              onClick={() => onDelete(entry.id)}
                              className="h-8 w-8 text-destructive hover:text-destructive/90 hover:bg-destructive/10"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                            {entry.notes && (
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Button 
                                      variant="ghost" 
                                      size="icon" 
                                      className="h-8 w-8"
                                    >
                                      <Info className="h-4 w-4" />
                                    </Button>
                                  </TooltipTrigger>
                                  <TooltipContent className="max-w-xs">
                                    <p className="text-xs">{entry.notes}</p>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            )}
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="py-12 text-center">
            <div className="text-muted-foreground mb-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
            </div>
            <p className="text-muted-foreground">No measurements recorded yet.</p>
            <p className="text-muted-foreground text-sm mt-1">Add your baby's first measurement above.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
