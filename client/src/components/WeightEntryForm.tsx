import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Form, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormControl,
  FormMessage, 
  FormDescription
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { measurementEntryFormSchema, MeasurementEntryFormValues, Baby } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { 
  calculateAgeInMonths, 
  calculatePercentile,
  calculateHeightPercentile
} from "@/lib/utils";
import * as storageService from "@/services/storageService";

interface MeasurementEntryFormProps {
  baby: Baby;
  onEntryAdded: () => void;
}

export function WeightEntryForm({ baby, onEntryAdded }: MeasurementEntryFormProps) {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("weight");
  
  const form = useForm<MeasurementEntryFormValues>({
    resolver: zodResolver(measurementEntryFormSchema),
    defaultValues: {
      date: new Date().toISOString().split('T')[0],
      weight: undefined,
      height: undefined,
      notes: ""
    },
  });

  function handleSubmit(values: MeasurementEntryFormValues) {
    try {
      // Calculate age in months based on birth date and measurement date
      const ageMonths = calculateAgeInMonths(baby.birthDate, values.date);
      
      // Prepare the base entry
      const entry: any = {
        babyId: baby.id,
        date: values.date,
        ageMonths: String(ageMonths),
        notes: values.notes || null
      };
      
      // Add weight data if provided
      if (values.weight !== undefined) {
        const weightPercentile = calculatePercentile(ageMonths, values.weight, baby.gender);
        entry.weight = String(values.weight);
        entry.weightPercentile = String(weightPercentile);
      }
      
      // Add height data if provided
      if (values.height !== undefined) {
        const heightPercentile = calculateHeightPercentile(ageMonths, values.height, baby.gender);
        entry.height = String(values.height);
        entry.heightPercentile = String(heightPercentile);
      }
      
      // Store the data in localStorage
      storageService.createMeasurementEntry(entry);
      
      // Show success message
      toast({
        title: "Measurement added",
        description: "The new measurement has been recorded."
      });
      
      // Reset form
      form.reset({
        date: new Date().toISOString().split('T')[0],
        weight: undefined,
        height: undefined,
        notes: ""
      });
      
      // Notify parent that entry was added
      onEntryAdded();
    } catch (error) {
      console.error("Error adding measurement:", error);
      toast({
        title: "Error",
        description: "Failed to add measurement. Please try again.",
        variant: "destructive",
      });
    }
  }

  // Calculate age based on measurement date
  const measurementDate = form.watch("date");
  const ageInMonths = measurementDate ? calculateAgeInMonths(baby.birthDate, measurementDate) : 0;
  const displayAge = ageInMonths.toFixed(1);

  return (
    <Card className="shadow-md">
      <CardHeader className="pb-3">
        <CardTitle className="text-xl font-semibold text-primary">Add New Measurement</CardTitle>
      </CardHeader>
      
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Measurement Date</FormLabel>
                    <FormControl>
                      <Input 
                        type="date" 
                        {...field} 
                        className="bg-background"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="flex items-end gap-2">
                <div className="flex-1">
                  <FormItem>
                    <div className="flex items-center gap-1">
                      <FormLabel>Age</FormLabel>
                      <div className="relative group">
                        <span className="cursor-help text-muted-foreground text-sm">
                          ⓘ
                          <div className="absolute bottom-full left-1/2 -translate-x-1/2 w-48 p-2 rounded bg-popover text-popover-foreground border border-border text-xs opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none mb-2 z-10">
                            Automatically calculated from birth date and measurement date
                          </div>
                        </span>
                      </div>
                    </div>
                    <FormControl>
                      <Input 
                        type="text" 
                        value={displayAge}
                        className="bg-muted"
                        readOnly
                      />
                    </FormControl>
                  </FormItem>
                </div>
                <div className="w-1/3">
                  <Select disabled defaultValue="months">
                    <SelectTrigger className="bg-muted">
                      <SelectValue placeholder="Unit" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="months">Months</SelectItem>
                      <SelectItem value="years">Years</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            <Tabs defaultValue="weight" value={activeTab} onValueChange={setActiveTab} className="mt-6">
              <TabsList className="grid grid-cols-2">
                <TabsTrigger value="weight">Weight</TabsTrigger>
                <TabsTrigger value="height">Height</TabsTrigger>
              </TabsList>
              
              <TabsContent value="weight" className="pt-4">
                <FormField
                  control={form.control}
                  name="weight"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Weight (kg)</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          placeholder="e.g. 5.2" 
                          step="0.01"
                          min="0.5"
                          {...field}
                          onChange={(e) => {
                            field.onChange(e.target.valueAsNumber);
                          }}
                          className="bg-background"
                        />
                      </FormControl>
                      <FormDescription>
                        Enter the baby's weight in kilograms
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </TabsContent>
              
              <TabsContent value="height" className="pt-4">
                <FormField
                  control={form.control}
                  name="height"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Height (cm)</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          placeholder="e.g. 60.5" 
                          step="0.1"
                          min="30"
                          max="200"
                          {...field}
                          onChange={(e) => {
                            field.onChange(e.target.valueAsNumber);
                          }}
                          className="bg-background"
                        />
                      </FormControl>
                      <FormDescription>
                        Enter the baby's height in centimeters
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </TabsContent>
            </Tabs>
            
            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notes (optional)</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Add any notes about this measurement" 
                      {...field}
                      className="bg-background"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="mt-6 flex justify-end">
              <Button type="submit" className="bg-primary hover:bg-primary/90">
                Add Measurement
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
