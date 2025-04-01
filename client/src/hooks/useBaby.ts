import { useState, useEffect } from 'react';
import { Baby, InsertBaby } from '@shared/schema';
import * as storageService from '@/services/storageService';
import { calculatePercentile } from '@/lib/utils';

export function useBabyData() {
  const [baby, setBaby] = useState<Baby | null>(null);

  // Get all babies on initial load (currently we only support one baby at a time)
  useEffect(() => {
    const allBabies = storageService.getAllBabies();
    if (allBabies.length > 0) {
      setBaby(allBabies[0]);
    }
  }, []);

  // Create a new baby and save to localStorage
  const createBaby = (babyData: InsertBaby): Baby => {
    const newBaby = storageService.createBaby(babyData);
    setBaby(newBaby);
    return newBaby;
  };

  return {
    baby,
    createBaby
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