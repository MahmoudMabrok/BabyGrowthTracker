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
import { babyFormSchema, BabyFormValues } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/hooks/use-toast";
import { Baby } from "@shared/schema";
import * as storageService from "@/services/storageService";
import { calculatePercentile } from "@/lib/utils";

interface BabyInfoFormProps {
  onSubmit: (baby: Baby) => void;
}

export function BabyInfoForm({ onSubmit }: BabyInfoFormProps) {
  const { toast } = useToast();

  const form = useForm<BabyFormValues>({
    resolver: zodResolver(babyFormSchema),
    defaultValues: {
      name: "",
      birthDate: "",
      birthWeight: undefined,
      gender: "male",
    },
  });

  function handleSubmit(values: BabyFormValues) {
    try {
      // Convert number values to strings for storage
      const babyData = {
        ...values,
        birthWeight: String(values.birthWeight)
      };

      // Create the baby in local storage
      const baby = storageService.createBaby(babyData);

      // Get the birth weight entry
      const entries = storageService.getWeightEntriesByBabyId(baby.id);
      let birthWeightEntry = entries[0];

      // Calculate and update percentile for the birth weight entry
      if (birthWeightEntry) {
        const percentile = calculatePercentile(0, Number(values.birthWeight), values.gender);
        storageService.updateWeightEntry(birthWeightEntry.id, {
          percentile: String(percentile)
        });
      }

      toast({
        title: "Baby information saved",
        description: `${baby.name}'s information has been saved.`,
      });

      // Pass the baby to the parent component
      onSubmit(baby);
      window.location.href = "/"; // Redirect to home page
    } catch (error) {
      console.error("Error creating baby:", error);
      toast({
        title: "Error",
        description: "Failed to save baby information. Please try again.",
        variant: "destructive",
      });
    }
  }

  return (
    <Card className="shadow-md">
      <CardContent className="pt-6">
        <h2 className="text-2xl font-bold text-primary mb-6">Baby Information</h2>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Baby's Name</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Enter baby's name" 
                        {...field} 
                        className="bg-background"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="birthDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Birth Date</FormLabel>
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

              <FormField
                control={form.control}
                name="birthWeight"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center gap-1">
                      <FormLabel>Birth Weight (kg)</FormLabel>
                      <div className="relative group">
                        <span className="cursor-help text-muted-foreground text-sm">
                          ⓘ
                          <div className="absolute bottom-full left-1/2 -translate-x-1/2 w-48 p-2 rounded bg-popover text-popover-foreground border border-border text-xs opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none mb-2 z-10">
                            Enter weight in kilograms (e.g. 3.5)
                          </div>
                        </span>
                      </div>
                    </div>
                    <FormControl>
                      <Input 
                        type="number" 
                        placeholder="e.g. 3.5" 
                        step="0.01"
                        min="0.5"
                        max="6"
                        {...field}
                        onChange={(e) => {
                          field.onChange(e.target.valueAsNumber);
                        }}
                        className="bg-background"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="gender"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel>Gender</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="grid grid-cols-2 gap-4"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="male" id="male" />
                          <label htmlFor="male" className="text-sm text-foreground">Boy</label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="female" id="female" />
                          <label htmlFor="female" className="text-sm text-foreground">Girl</label>
                        </div>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex justify-end">
              <Button type="submit" className="bg-primary hover:bg-primary/90">
                Save Information
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}