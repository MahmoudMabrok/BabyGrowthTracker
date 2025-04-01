
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
  FormMessage,
  FormDescription
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { measurementEntryFormSchema, MeasurementEntryFormValues, Baby, MeasurementEntry } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";
import { Textarea } from "@/components/ui/textarea";
import { calculateAgeInMonths, calculatePercentile, calculateHeightPercentile } from "@/lib/utils";
import * as storageService from "@/services/storageService";

interface EditEntryModalProps {
  baby: Baby;
  entry: MeasurementEntry | null;
  isOpen: boolean;
  onClose: () => void;
}

export function EditEntryModal({ baby, entry, isOpen, onClose }: EditEntryModalProps) {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = React.useState(entry?.weight ? "weight" : "height");
  
  const form = useForm<MeasurementEntryFormValues>({
    resolver: zodResolver(measurementEntryFormSchema),
    defaultValues: {
      date: entry?.date || "",
      weight: entry?.weight ? Number(entry.weight) : undefined,
      height: entry?.height ? Number(entry.height) : undefined,
      notes: entry?.notes || ""
    },
  });
  
  // Update form values when entry changes
  React.useEffect(() => {
    if (entry) {
      form.reset({
        date: entry.date,
        weight: entry.weight ? Number(entry.weight) : undefined,
        height: entry.height ? Number(entry.height) : undefined,
        notes: entry.notes || ""
      });
    }
  }, [entry, form]);

  function handleSubmit(values: MeasurementEntryFormValues) {
    if (!entry) return;
    
    try {
      // Calculate age in months based on birth date and measurement date
      const ageMonths = calculateAgeInMonths(baby.birthDate, values.date);
      
      // Prepare the update data
      const updateData: Partial<MeasurementEntry> = {
        date: values.date,
        ageMonths: String(ageMonths),
        notes: values.notes || null
      };

      // Update weight data if provided
      if (values.weight !== undefined) {
        const weightPercentile = calculatePercentile(ageMonths, values.weight, baby.gender);
        updateData.weight = String(values.weight);
        updateData.weightPercentile = String(weightPercentile);
      }

      // Update height data if provided
      if (values.height !== undefined) {
        const heightPercentile = calculateHeightPercentile(ageMonths, values.height, baby.gender);
        updateData.height = String(values.height);
        updateData.heightPercentile = String(heightPercentile);
      }
      
      // Update the data in localStorage
      storageService.updateMeasurementEntry(entry.id, updateData);
      
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

            <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-6">
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
