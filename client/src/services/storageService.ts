import { Baby, InsertBaby, WeightEntry, InsertWeightEntry } from "@shared/schema";

// Local storage keys
const BABIES_STORAGE_KEY = 'babyTracker_babies';
const WEIGHT_ENTRIES_STORAGE_KEY = 'babyTracker_weightEntries';

// Counter keys for generating IDs
const BABY_COUNTER_KEY = 'babyTracker_babyCounter';
const ENTRY_COUNTER_KEY = 'babyTracker_entryCounter';

// Helper functions for localStorage
function getItem<T>(key: string, defaultValue: T): T {
  const item = localStorage.getItem(key);
  return item ? JSON.parse(item) : defaultValue;
}

function setItem(key: string, value: any): void {
  localStorage.setItem(key, JSON.stringify(value));
}

function getNextId(counterKey: string): number {
  const currentId = getItem<number>(counterKey, 0);
  const nextId = currentId + 1;
  setItem(counterKey, nextId);
  return nextId;
}

// Baby methods
export function getBaby(id: number): Baby | undefined {
  const babies = getItem<Baby[]>(BABIES_STORAGE_KEY, []);
  return babies.find(baby => baby.id === id);
}

export function getAllBabies(): Baby[] {
  return getItem<Baby[]>(BABIES_STORAGE_KEY, []);
}

export function createBaby(insertBaby: InsertBaby): Baby {
  const id = getNextId(BABY_COUNTER_KEY);
  const baby: Baby = { ...insertBaby, id, userId: 1 }; // Default userId to 1
  
  const babies = getItem<Baby[]>(BABIES_STORAGE_KEY, []);
  babies.push(baby);
  setItem(BABIES_STORAGE_KEY, babies);
  
  // Create the birth weight entry
  createWeightEntry({
    babyId: baby.id,
    date: baby.birthDate,
    weight: baby.birthWeight,
    ageMonths: '0',
    percentile: '0' // Will be calculated later
  });
  
  return baby;
}

// Weight entry methods
export function getWeightEntry(id: number): WeightEntry | undefined {
  const entries = getItem<WeightEntry[]>(WEIGHT_ENTRIES_STORAGE_KEY, []);
  return entries.find(entry => entry.id === id);
}

export function getWeightEntriesByBabyId(babyId: number): WeightEntry[] {
  const entries = getItem<WeightEntry[]>(WEIGHT_ENTRIES_STORAGE_KEY, []);
  return entries
    .filter(entry => entry.babyId === babyId)
    .sort((a, b) => Number(a.ageMonths) - Number(b.ageMonths));
}

export function createWeightEntry(insertEntry: InsertWeightEntry): WeightEntry {
  const id = getNextId(ENTRY_COUNTER_KEY);
  
  if (!insertEntry.babyId) {
    throw new Error("Weight entry must have a babyId");
  }
  
  // Ensure we have all required fields
  const entry: WeightEntry = { 
    id, 
    babyId: insertEntry.babyId,
    date: insertEntry.date,
    weight: String(insertEntry.weight),
    ageMonths: String(insertEntry.ageMonths),
    percentile: insertEntry.percentile ? String(insertEntry.percentile) : null
  };
  
  const entries = getItem<WeightEntry[]>(WEIGHT_ENTRIES_STORAGE_KEY, []);
  entries.push(entry);
  setItem(WEIGHT_ENTRIES_STORAGE_KEY, entries);
  
  return entry;
}

export function updateWeightEntry(id: number, updatedData: Partial<WeightEntry>): WeightEntry {
  const entries = getItem<WeightEntry[]>(WEIGHT_ENTRIES_STORAGE_KEY, []);
  const entryIndex = entries.findIndex(entry => entry.id === id);
  
  if (entryIndex === -1) {
    throw new Error(`Weight entry with id ${id} not found`);
  }
  
  const updatedEntry: WeightEntry = { ...entries[entryIndex], ...updatedData };
  entries[entryIndex] = updatedEntry;
  setItem(WEIGHT_ENTRIES_STORAGE_KEY, entries);
  
  return updatedEntry;
}

export function deleteWeightEntry(id: number): void {
  const entries = getItem<WeightEntry[]>(WEIGHT_ENTRIES_STORAGE_KEY, []);
  const filteredEntries = entries.filter(entry => entry.id !== id);
  
  if (filteredEntries.length === entries.length) {
    throw new Error(`Weight entry with id ${id} not found`);
  }
  
  setItem(WEIGHT_ENTRIES_STORAGE_KEY, filteredEntries);
}