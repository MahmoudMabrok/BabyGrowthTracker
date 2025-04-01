import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Baby, MeasurementEntry } from "@shared/schema";
import { MilestoneCard } from "@/components/MilestoneCard";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { formatAge } from "@/lib/utils";
import { PlusCircle } from "lucide-react";

interface MilestonesProps {
  baby: Baby;
  entries: MeasurementEntry[];
}

export function Milestones({ baby, entries }: MilestonesProps) {
  const [selectedEntryId, setSelectedEntryId] = useState<number | null>(null);
  const [milestoneType, setMilestoneType] = useState<"newborn" | "sitting" | "crawling" | "walking" | "cute">("cute");
  const [customNote, setCustomNote] = useState("");
  const [showCardCreator, setShowCardCreator] = useState(false);
  
  // Filter valid entries (must have either weight or height)
  const validEntries = entries.filter(entry => entry.weight || entry.height);
  
  // Get the selected entry
  const selectedEntry = validEntries.find(entry => entry.id === selectedEntryId) || null;
  
  // Get the milestone title based on age
  const getMilestoneTitle = (ageMonths: number): string => {
    if (ageMonths === 0) return "Newborn";
    if (ageMonths <= 3) return "3 Month Milestone";
    if (ageMonths <= 6) return "6 Month Milestone";
    if (ageMonths <= 9) return "9 Month Milestone";
    if (ageMonths <= 12) return "1 Year Milestone";
    if (ageMonths <= 18) return "18 Month Milestone";
    if (ageMonths <= 24) return "2 Year Milestone";
    return `${Math.floor(ageMonths / 12)} Year Milestone`;
  };
  
  // Get the milestone icon type based on age
  const getMilestoneIconType = (ageMonths: number): "newborn" | "sitting" | "crawling" | "walking" | "cute" => {
    if (ageMonths === 0) return "newborn";
    if (ageMonths <= 6) return "sitting";
    if (ageMonths <= 12) return "crawling";
    if (ageMonths > 12) return "walking";
    return "cute";
  };
  
  return (
    <Card className="shadow-md">
      <CardHeader className="pb-3">
        <CardTitle className="text-xl font-semibold text-primary">Growth Milestones</CardTitle>
      </CardHeader>
      
      <CardContent>
        <Tabs defaultValue="create" className="w-full">
          <TabsList className="grid grid-cols-2 mb-4">
            <TabsTrigger value="create">Create Milestone</TabsTrigger>
            <TabsTrigger value="view">View Milestones</TabsTrigger>
          </TabsList>
          
          <TabsContent value="create" className="py-2">
            {!showCardCreator ? (
              <div className="flex flex-col items-center justify-center p-8 text-center">
                <div className="text-muted-foreground mb-4">
                  <PlusCircle className="h-12 w-12 mx-auto" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Create a Growth Milestone Card</h3>
                <p className="text-muted-foreground mb-4">
                  Create a cute, shareable milestone card for your baby's growth journey.
                </p>
                <Button onClick={() => setShowCardCreator(true)}>Create Milestone Card</Button>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="milestone-entry">Select a measurement</Label>
                  <Select 
                    onValueChange={(value) => setSelectedEntryId(Number(value))}
                    value={selectedEntryId?.toString() || undefined}
                  >
                    <SelectTrigger id="milestone-entry">
                      <SelectValue placeholder="Select a measurement" />
                    </SelectTrigger>
                    <SelectContent>
                      {validEntries.map(entry => (
                        <SelectItem key={entry.id} value={entry.id.toString()}>
                          {formatAge(Number(entry.ageMonths))} - {new Date(entry.date).toLocaleDateString()}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                {selectedEntry && (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="milestone-type">Baby image style</Label>
                      <Select 
                        onValueChange={(value) => setMilestoneType(value as any)}
                        value={milestoneType}
                        defaultValue={getMilestoneIconType(Number(selectedEntry.ageMonths))}
                      >
                        <SelectTrigger id="milestone-type">
                          <SelectValue placeholder="Select a style" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="newborn">Newborn</SelectItem>
                          <SelectItem value="sitting">Sitting</SelectItem>
                          <SelectItem value="crawling">Crawling</SelectItem>
                          <SelectItem value="walking">Walking</SelectItem>
                          <SelectItem value="cute">Cute</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="milestone-note">Custom note (optional)</Label>
                      <Textarea
                        id="milestone-note"
                        placeholder="Add a custom note to the milestone card"
                        value={customNote}
                        onChange={(e) => setCustomNote(e.target.value)}
                        className="resize-none"
                      />
                    </div>
                    
                    <div className="pt-4">
                      <h3 className="text-lg font-semibold mb-4">Preview</h3>
                      
                      <div className="max-w-sm mx-auto milestone-card-appear">
                        <MilestoneCard
                          baby={baby}
                          entry={selectedEntry}
                          milestoneType={milestoneType || getMilestoneIconType(Number(selectedEntry.ageMonths))}
                          title={getMilestoneTitle(Number(selectedEntry.ageMonths))}
                          note={customNote || undefined}
                        />
                      </div>
                    </div>
                  </>
                )}
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="view" className="py-2">
            {validEntries.length === 0 ? (
              <div className="py-12 text-center">
                <div className="text-muted-foreground mb-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <p className="text-muted-foreground">No measurements available for milestone cards.</p>
                <p className="text-muted-foreground text-sm mt-1">Add measurements first to create milestone cards.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {validEntries.slice(0, 4).map((entry) => (
                  <div key={entry.id} className="milestone-card-appear">
                    <MilestoneCard
                      baby={baby}
                      entry={entry}
                      milestoneType={getMilestoneIconType(Number(entry.ageMonths))}
                      title={getMilestoneTitle(Number(entry.ageMonths))}
                    />
                  </div>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}