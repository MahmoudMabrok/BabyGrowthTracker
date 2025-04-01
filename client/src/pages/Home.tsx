import React, { useState } from "react";
import { BabyInfoForm } from "@/components/BabyInfoForm";
import { GrowthChart } from "@/components/GrowthChart";
import { WeightEntryForm } from "@/components/WeightEntryForm";
import { EntriesTable } from "@/components/EntriesTable";
import { EditEntryModal } from "@/components/EditEntryModal";
import { GrowthSummary } from "@/components/GrowthSummary";
import { Baby, WeightEntry } from "@shared/schema";
import { useQuery } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Separator } from "@/components/ui/separator";
import { Baby as BabyIcon } from "lucide-react";

export default function Home() {
  const [babyData, setBabyData] = useState<Baby | null>(null);
  const [editingEntry, setEditingEntry] = useState<WeightEntry | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeletingEntry, setIsDeletingEntry] = useState<number | null>(null);
  const { toast } = useToast();
  
  // Fetch weight entries if baby data exists
  const { data: entries = [] } = useQuery({
    queryKey: babyData ? [`/api/weight-entries/${babyData.id}`] : [],
    enabled: !!babyData,
  });
  
  // Handler for baby info form submission
  const handleBabyInfoSubmit = (baby: Baby, birthWeightEntry: WeightEntry) => {
    setBabyData(baby);
  };
  
  // Handler for entry addition
  const handleEntryAdded = () => {
    // Additional actions after entry is added
  };
  
  // Handler for editing an entry
  const handleEditEntry = (entry: WeightEntry) => {
    setEditingEntry(entry);
    setIsEditModalOpen(true);
  };
  
  // Handler for closing edit modal
  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setEditingEntry(null);
  };
  
  // Handler for deleting an entry
  const handleDeleteEntry = (entryId: number) => {
    setIsDeletingEntry(entryId);
  };
  
  // Handler for confirming deletion
  const handleConfirmDelete = async () => {
    if (isDeletingEntry) {
      try {
        await apiRequest("DELETE", `/api/weight-entries/${isDeletingEntry}`);
        
        toast({
          title: "Measurement deleted",
          description: "The measurement has been deleted successfully."
        });
        
        // Invalidate queries to refresh data
        if (babyData) {
          queryClient.invalidateQueries({ queryKey: [`/api/weight-entries/${babyData.id}`] });
        }
      } catch (error) {
        console.error("Error deleting measurement:", error);
        toast({
          title: "Error",
          description: "Failed to delete measurement. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsDeletingEntry(null);
      }
    }
  };
  
  // Handler for canceling deletion
  const handleCancelDelete = () => {
    setIsDeletingEntry(null);
  };
  
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-primary flex items-center">
              <BabyIcon className="mr-2 h-6 w-6" /> Baby Growth Tracker
            </h1>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {!babyData ? (
          <BabyInfoForm onSubmit={handleBabyInfoSubmit} />
        ) : (
          <div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <GrowthChart baby={babyData} entries={entries} />
              </div>
              
              <div className="lg:col-span-1">
                <WeightEntryForm baby={babyData} onEntryAdded={handleEntryAdded} />
                <div className="mt-8">
                  <EntriesTable 
                    baby={babyData} 
                    entries={entries} 
                    onEdit={handleEditEntry}
                    onDelete={handleDeleteEntry}
                  />
                </div>
              </div>
            </div>
            
            <GrowthSummary baby={babyData} entries={entries} />
          </div>
        )}
      </main>

      <footer className="bg-white border-t border-gray-200 py-6 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-sm text-gray-500">
            Baby Growth Tracker uses WHO growth standards. This app is for informational purposes only and is not a substitute for professional medical advice.
          </p>
        </div>
      </footer>
      
      {/* Edit modal */}
      <EditEntryModal
        baby={babyData!}
        entry={editingEntry}
        isOpen={isEditModalOpen}
        onClose={handleCloseEditModal}
      />
      
      {/* Delete confirmation dialog */}
      <AlertDialog open={isDeletingEntry !== null} onOpenChange={handleCancelDelete}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete this measurement record.
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleCancelDelete}>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleConfirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
