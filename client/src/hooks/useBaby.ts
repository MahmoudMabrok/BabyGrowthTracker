import { useState, useEffect } from 'react';
import { Baby, InsertBaby, MeasurementEntry } from '@shared/schema';
import * as storageService from '@/services/storageService';
import { calculatePercentile, calculateHeightPercentile } from '@/lib/utils';

export function useBabyData() {
  const [allBabies, setAllBabies] = useState<Baby[]>([]);
  const [activeBaby, setActiveBaby] = useState<Baby | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Get all babies and active baby on initial load
  useEffect(() => {
    // Load all babies
    const babies = storageService.getAllBabies();
    setAllBabies(babies);
    
    // Check for active baby
    const activeBabyId = storageService.getActiveBaby();
    
    if (activeBabyId) {
      // If there's an active baby, get it
      const baby = storageService.getBaby(activeBabyId);
      if (baby) {
        setActiveBaby(baby);
      } else if (babies.length > 0) {
        // If active baby not found but there are babies, set the first one as active
        setActiveBaby(babies[0]);
        storageService.setActiveBaby(babies[0].id);
      }
    } else if (babies.length > 0) {
      // No active baby set, but babies exist - use the first one
      setActiveBaby(babies[0]);
      storageService.setActiveBaby(babies[0].id);
    }
    
    setIsLoading(false);
  }, []);

  // Create a new baby and save to localStorage
  const createBaby = (babyData: InsertBaby): Baby => {
    const newBaby = storageService.createBaby(babyData);
    
    // Update state
    setAllBabies(prevBabies => [...prevBabies, newBaby]);
    setActiveBaby(newBaby);
    
    // Set as active baby
    storageService.setActiveBaby(newBaby.id);
    
    return newBaby;
  };
  
  // Delete a baby and all its measurements
  const deleteBaby = (babyId: number): void => {
    try {
      storageService.deleteBaby(babyId);
      
      // Update state
      setAllBabies(prevBabies => prevBabies.filter(baby => baby.id !== babyId));
      
      // If the deleted baby was active, find a new active baby
      if (activeBaby && activeBaby.id === babyId) {
        const remainingBabies = storageService.getAllBabies();
        if (remainingBabies.length > 0) {
          setActiveBaby(remainingBabies[0]);
          storageService.setActiveBaby(remainingBabies[0].id);
        } else {
          setActiveBaby(null);
        }
      }
    } catch (error) {
      console.error("Error deleting baby:", error);
      throw error;
    }
  };
  
  // Set a baby as active
  const setActive = (baby: Baby): void => {
    setActiveBaby(baby);
    storageService.setActiveBaby(baby.id);
  };

  return {
    allBabies,
    activeBaby,
    isLoading,
    createBaby,
    deleteBaby,
    setActive
  };
}

export function useWeightEntries(babyId: number | null) {
  const [entries, setEntries] = useState<Array<any>>([]);
  
  // Load entries for the baby
  useEffect(() => {
    if (babyId) {
      refreshEntries();
    }
  }, [babyId]);

  // Refresh entries from storage
  const refreshEntries = () => {
    if (babyId) {
      const loadedEntries = storageService.getWeightEntriesByBabyId(babyId);
      
      // Update percentiles - needed when creating a new entry without a percentile value
      const updatedEntries = loadedEntries.map(entry => {
        if (!entry.percentile) {
          // If no percentile is set, calculate and update it
          const baby = storageService.getBaby(entry.babyId);
          if (baby) {
            const calculatedPercentile = calculatePercentile(
              Number(entry.ageMonths),
              Number(entry.weight),
              baby.gender
            );
            
            // Update the entry with the calculated percentile
            const updatedEntry = storageService.updateWeightEntry(entry.id, {
              percentile: String(calculatedPercentile)
            });
            return updatedEntry;
          }
        }
        return entry;
      });
      
      setEntries(updatedEntries);
    } else {
      setEntries([]);
    }
  };

  // Add a new weight entry
  const addWeightEntry = (entryData: any) => {
    const newEntry = storageService.createWeightEntry(entryData);
    refreshEntries();
    return newEntry;
  };

  // Update a weight entry
  const updateWeightEntry = (id: number, updatedData: any) => {
    const updatedEntry = storageService.updateWeightEntry(id, updatedData);
    refreshEntries();
    return updatedEntry;
  };

  // Delete a weight entry
  const deleteWeightEntry = (id: number) => {
    storageService.deleteWeightEntry(id);
    refreshEntries();
  };

  return {
    entries,
    addWeightEntry,
    updateWeightEntry,
    deleteWeightEntry,
    refreshEntries
  };
}