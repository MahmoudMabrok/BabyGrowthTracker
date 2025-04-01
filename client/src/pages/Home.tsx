import React, { useState } from "react";
import { BabyInfoForm } from "@/components/BabyInfoForm";
import { GrowthChart } from "@/components/GrowthChart";
import { WeightEntryForm } from "@/components/WeightEntryForm";
import { EntriesTable } from "@/components/EntriesTable";
import { EditEntryModal } from "@/components/EditEntryModal";
import { GrowthSummary } from "@/components/GrowthSummary";
import { BabySelector } from "@/components/BabySelector";
import { Baby, MeasurementEntry } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Baby as BabyIcon, Download } from "lucide-react";
import { useBabyData, useWeightEntries } from "@/hooks/useBaby";
import {
  TooltipProvider,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";

export default function Home() {
  // State management
  const { 
    allBabies, 
    activeBaby, 
    isLoading, 
    createBaby, 
    deleteBaby, 
    setActive 
  } = useBabyData();
  
  const [editingEntry, setEditingEntry] = useState<MeasurementEntry | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeletingEntry, setIsDeletingEntry] = useState<number | null>(null);
  const [isAddingNewBaby, setIsAddingNewBaby] = useState(false);
  const { toast } = useToast();
  
  // Use weight entries hook to fetch and manage entries
  const { 
    entries = [], 
    refreshEntries,
    deleteWeightEntry 
  } = useWeightEntries(activeBaby?.id || null);
  
  // Handler for baby info form submission
  const handleBabyInfoSubmit = (baby: Baby) => {
    refreshEntries();
    setIsAddingNewBaby(false);
  };
  
  // Handler for entry addition
  const handleEntryAdded = () => {
    refreshEntries();
  };
  
  // Handler for editing an entry
  const handleEditEntry = (entry: MeasurementEntry) => {
    setEditingEntry(entry);
    setIsEditModalOpen(true);
  };
  
  // Handler for closing edit modal
  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setEditingEntry(null);
    refreshEntries();
  };
  
  // Handler for deleting an entry
  const handleDeleteEntry = (entryId: number) => {
    setIsDeletingEntry(entryId);
  };
  
  // Handler for confirming deletion
  const handleConfirmDelete = () => {
    if (isDeletingEntry) {
      try {
        deleteWeightEntry(isDeletingEntry);
        
        toast({
          title: "Measurement deleted",
          description: "The measurement has been deleted successfully."
        });
        
        refreshEntries();
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
  
  // Handler for baby selector
  const handleSelectBaby = (baby: Baby) => {
    setActive(baby);
  };
  
  // Handler for adding new baby
  const handleAddNewBaby = () => {
    setIsAddingNewBaby(true);
  };
  
  // Handler for deleting a baby
  const handleDeleteBaby = (babyId: number) => {
    try {
      deleteBaby(babyId);
      toast({
        title: "Child profile deleted",
        description: "The child profile has been deleted successfully."
      });
    } catch (error) {
      console.error("Error deleting baby:", error);
      toast({
        title: "Error",
        description: "Failed to delete child profile. Please try again.",
        variant: "destructive",
      });
    }
  };
  
  // Export data handler
  const handleExportData = () => {
    if (!activeBaby) return;
    
    try {
      const exportData = {
        baby: activeBaby,
        measurements: entries
      };
      
      // Create and download the file
      const dataStr = JSON.stringify(exportData, null, 2);
      const dataUri = "data:application/json;charset=utf-8," + encodeURIComponent(dataStr);
      
      const exportFileDefaultName = `${activeBaby.name.replace(/\s+/g, '_')}_growth_data.json`;
      
      const linkElement = document.createElement('a');
      linkElement.setAttribute('href', dataUri);
      linkElement.setAttribute('download', exportFileDefaultName);
      linkElement.click();
      
      toast({
        title: "Data exported",
        description: `Growth data for ${activeBaby.name} has been exported.`
      });
    } catch (error) {
      console.error("Error exporting data:", error);
      toast({
        title: "Export failed",
        description: "Failed to export data. Please try again.",
        variant: "destructive"
      });
    }
  };
  
  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-background">
      <header className="bg-card shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-primary flex items-center">
              <BabyIcon className="mr-2 h-6 w-6" /> Baby Growth Tracker
            </h1>
            
            <div className="flex items-center space-x-2">
              {activeBaby && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button 
                        variant="outline" 
                        size="icon"
                        onClick={handleExportData}
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Export growth data</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
              
              <BabySelector
                babies={allBabies}
                activeBaby={activeBaby}
                onSelectBaby={handleSelectBaby}
                onAddNewBaby={handleAddNewBaby}
                onDeleteBaby={handleDeleteBaby}
              />
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {(!activeBaby || isAddingNewBaby) ? (
          <BabyInfoForm onSubmit={handleBabyInfoSubmit} />
        ) : (
          <div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <GrowthChart baby={activeBaby} entries={entries} />
              </div>
              
              <div className="lg:col-span-1">
                <WeightEntryForm baby={activeBaby} onEntryAdded={handleEntryAdded} />
                <div className="mt-8">
                  <EntriesTable 
                    baby={activeBaby} 
                    entries={entries} 
                    onEdit={handleEditEntry}
                    onDelete={handleDeleteEntry}
                  />
                </div>
              </div>
            </div>
            
            <GrowthSummary baby={activeBaby} entries={entries} />
          </div>
        )}
      </main>

      <footer className="bg-card border-t border-border py-6 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-sm text-muted-foreground">
            Baby Growth Tracker uses WHO growth standards. This app is for informational purposes only and is not a substitute for professional medical advice.
          </p>
        </div>
      </footer>
      
      {/* Edit modal */}
      {activeBaby && editingEntry && (
        <EditEntryModal
          baby={activeBaby}
          entry={editingEntry}
          isOpen={isEditModalOpen}
          onClose={handleCloseEditModal}
        />
      )}
      
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
