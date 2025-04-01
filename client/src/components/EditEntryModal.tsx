import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { 
  Form, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormControl,
  FormMessage 
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { weightEntryFormSchema, WeightEntryFormValues, Baby, WeightEntry } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";
import { calculateAgeInMonths, calculatePercentile } from "@/lib/utils";
import * as storageService from "@/services/storageService";

interface EditEntryModalProps {
  baby: Baby;
  entry: WeightEntry | null;
  isOpen: boolean;
  onClose: () => void;
}

export function EditEntryModal({ baby, entry, isOpen, onClose }: EditEntryModalProps) {
  const { toast } = useToast();
  
  const form = useForm<WeightEntryFormValues>({
    resolver: zodResolver(weightEntryFormSchema),
    defaultValues: {
      date: entry?.date || "",
      weight: entry ? Number(entry.weight) : undefined,
    },
  });
  
  // Update form values when entry changes
  React.useEffect(() => {
    if (entry) {
      form.reset({
        date: entry.date,
        weight: Number(entry.weight),
      });
    }
  }, [entry, form]);

  function handleSubmit(values: WeightEntryFormValues) {
    if (!entry) return;
    
    try {
      // Calculate age in months based on birth date and measurement date
      const ageMonths = calculateAgeInMonths(baby.birthDate, values.date);
      
      // Calculate percentile
      const percentile = calculatePercentile(ageMonths, Number(values.weight), baby.gender);
      
      // Update the data in localStorage
      storageService.updateWeightEntry(entry.id, {
        date: values.date,
        weight: String(values.weight),
        ageMonths: String(ageMonths),
        percentile: String(percentile)
      });
      
      // Show success message
      toast({
        title: "Measurement updated",
        description: "The measurement has been updated successfully."
      });
      
      // Close modal
      onClose();
    } catch (error) {
      console.error("Error updating measurement:", error);
      toast({
        title: "Error",
        description: "Failed to update measurement. Please try again.",
        variant: "destructive",
      });
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Measurement</DialogTitle>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4 py-4">
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
            
            <DialogFooter className="pt-4">
              <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
              <Button type="submit">Save Changes</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
