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
import { apiRequest } from "@/lib/queryClient";
import { Baby, WeightEntry } from "@shared/schema";

interface BabyInfoFormProps {
  onSubmit: (baby: Baby, birthWeightEntry: WeightEntry) => void;
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

  async function handleSubmit(values: BabyFormValues) {
    try {
      const res = await apiRequest("POST", "/api/baby", values);
      const baby = await res.json();
      
      // Get the birth weight entry
      const entriesRes = await apiRequest("GET", `/api/weight-entries/${baby.id}`);
      const entries = await entriesRes.json();
      const birthWeightEntry = entries[0];
      
      toast({
        title: "Baby information saved",
        description: `${baby.name}'s information has been saved.`,
      });
      
      // Pass the baby and birth weight entry to the parent component
      onSubmit(baby, birthWeightEntry);
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
        <h2 className="text-xl font-semibold mb-4">Baby Information</h2>
        
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
                        <span className="cursor-help text-gray-400 text-sm">
                          ⓘ
                          <div className="absolute bottom-full left-1/2 -translate-x-1/2 w-48 p-2 rounded bg-gray-800 text-white text-xs opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none mb-2 z-10">
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
                          <label htmlFor="male" className="text-sm text-gray-700">Boy</label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="female" id="female" />
                          <label htmlFor="female" className="text-sm text-gray-700">Girl</label>
                        </div>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <div className="flex justify-end">
              <Button type="submit">
                Save Information
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
