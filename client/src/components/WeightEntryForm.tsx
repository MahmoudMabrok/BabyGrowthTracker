import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Form, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormControl,
  FormMessage 
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { weightEntryFormSchema, WeightEntryFormValues, Baby } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { calculateAgeInMonths, calculatePercentile } from "@/lib/utils";
import * as storageService from "@/services/storageService";

interface WeightEntryFormProps {
  baby: Baby;
  onEntryAdded: () => void;
}

export function WeightEntryForm({ baby, onEntryAdded }: WeightEntryFormProps) {
  const { toast } = useToast();
  
  const form = useForm<WeightEntryFormValues>({
    resolver: zodResolver(weightEntryFormSchema),
    defaultValues: {
      date: new Date().toISOString().split('T')[0],
      weight: undefined,
    },
  });

  function handleSubmit(values: WeightEntryFormValues) {
    try {
      // Calculate age in months based on birth date and measurement date
      const ageMonths = calculateAgeInMonths(baby.birthDate, values.date);
      
      // Calculate percentile
      const percentile = calculatePercentile(ageMonths, Number(values.weight), baby.gender);
      
      // Store the data in localStorage
      storageService.createWeightEntry({
        babyId: baby.id,
        date: values.date,
        weight: String(values.weight),
        ageMonths: String(ageMonths),
        percentile: String(percentile)
      });
      
      // Show success message
      toast({
        title: "Measurement added",
        description: "The new measurement has been recorded."
      });
      
      // Reset form
      form.reset({
        date: new Date().toISOString().split('T')[0],
        weight: undefined,
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
      <CardContent className="pt-6">
        <h2 className="text-xl font-semibold mb-4">Add New Measurement</h2>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
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
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
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
                      <span className="cursor-help text-gray-400 text-sm">
                        ⓘ
                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 w-48 p-2 rounded bg-gray-800 text-white text-xs opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none mb-2 z-10">
                          Automatically calculated from birth date and measurement date
                        </div>
                      </span>
                    </div>
                  </div>
                  <FormControl>
                    <Input 
                      type="text" 
                      value={displayAge}
                      className="bg-gray-100"
                      readOnly
                    />
                  </FormControl>
                </FormItem>
              </div>
              <div className="w-1/3">
                <Select disabled defaultValue="months">
                  <SelectTrigger className="bg-gray-100">
                    <SelectValue placeholder="Unit" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="months">Months</SelectItem>
                    <SelectItem value="years">Years</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="mt-6 flex justify-end">
              <Button type="submit">
                Add Measurement
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
