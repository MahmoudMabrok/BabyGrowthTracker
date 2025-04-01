import { Baby, InsertBaby, WeightEntry, InsertWeightEntry, MeasurementEntry, InsertMeasurementEntry } from "@shared/schema";

// Local storage keys
const BABIES_STORAGE_KEY = 'babyTracker_babies';
const MEASUREMENT_ENTRIES_STORAGE_KEY = 'babyTracker_measurementEntries';
const ACTIVE_BABY_KEY = 'babyTracker_activeBaby';

// For backward compatibility
const WEIGHT_ENTRIES_STORAGE_KEY = MEASUREMENT_ENTRIES_STORAGE_KEY;

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
  createMeasurementEntry({
    babyId: baby.id,
    date: baby.birthDate,
    weight: baby.birthWeight,
    ageMonths: '0',
    weightPercentile: '0', // Will be calculated later
    height: null,
    heightPercentile: null
  });
  
  return baby;
}

// Multiple babies management
export function setActiveBaby(babyId: number | null): void {
  setItem(ACTIVE_BABY_KEY, babyId);
}

export function getActiveBaby(): number | null {
  return getItem<number | null>(ACTIVE_BABY_KEY, null);
}

export function deleteBaby(id: number): void {
  const babies = getItem<Baby[]>(BABIES_STORAGE_KEY, []);
  const filteredBabies = babies.filter(baby => baby.id !== id);
  
  if (filteredBabies.length === babies.length) {
    throw new Error(`Baby with id ${id} not found`);
  }
  
  setItem(BABIES_STORAGE_KEY, filteredBabies);
  
  // Delete all entries for this baby
  const entries = getItem<MeasurementEntry[]>(MEASUREMENT_ENTRIES_STORAGE_KEY, []);
  const remainingEntries = entries.filter(entry => entry.babyId !== id);
  setItem(MEASUREMENT_ENTRIES_STORAGE_KEY, remainingEntries);
  
  // If this was the active baby, clear the active baby
  if (getActiveBaby() === id) {
    setActiveBaby(null);
  }
}

// Measurement entry methods (includes both weight and height)
export function getMeasurementEntry(id: number): MeasurementEntry | undefined {
  const entries = getItem<MeasurementEntry[]>(MEASUREMENT_ENTRIES_STORAGE_KEY, []);
  return entries.find(entry => entry.id === id);
}

export function getMeasurementEntriesByBabyId(babyId: number): MeasurementEntry[] {
  const entries = getItem<MeasurementEntry[]>(MEASUREMENT_ENTRIES_STORAGE_KEY, []);
  return entries
    .filter(entry => entry.babyId === babyId)
    .sort((a, b) => Number(a.ageMonths) - Number(b.ageMonths));
}

export function createMeasurementEntry(insertEntry: InsertMeasurementEntry): MeasurementEntry {
  const id = getNextId(ENTRY_COUNTER_KEY);
  
  if (!insertEntry.babyId) {
    throw new Error("Measurement entry must have a babyId");
  }
  
  // Ensure we have all required fields
  const entry: MeasurementEntry = { 
    id, 
    babyId: insertEntry.babyId,
    date: insertEntry.date,
    ageMonths: String(insertEntry.ageMonths),
    weight: insertEntry.weight ? String(insertEntry.weight) : null,
    weightPercentile: insertEntry.weightPercentile ? String(insertEntry.weightPercentile) : null,
    height: insertEntry.height ? String(insertEntry.height) : null,
    heightPercentile: insertEntry.heightPercentile ? String(insertEntry.heightPercentile) : null,
    notes: insertEntry.notes || null
  };
  
  const entries = getItem<MeasurementEntry[]>(MEASUREMENT_ENTRIES_STORAGE_KEY, []);
  entries.push(entry);
  setItem(MEASUREMENT_ENTRIES_STORAGE_KEY, entries);
  
  return entry;
}

export function updateMeasurementEntry(id: number, updatedData: Partial<MeasurementEntry>): MeasurementEntry {
  const entries = getItem<MeasurementEntry[]>(MEASUREMENT_ENTRIES_STORAGE_KEY, []);
  const entryIndex = entries.findIndex(entry => entry.id === id);
  
  if (entryIndex === -1) {
    throw new Error(`Measurement entry with id ${id} not found`);
  }
  
  const updatedEntry: MeasurementEntry = { ...entries[entryIndex], ...updatedData };
  entries[entryIndex] = updatedEntry;
  setItem(MEASUREMENT_ENTRIES_STORAGE_KEY, entries);
  
  return updatedEntry;
}

export function deleteMeasurementEntry(id: number): void {
  const entries = getItem<MeasurementEntry[]>(MEASUREMENT_ENTRIES_STORAGE_KEY, []);
  const filteredEntries = entries.filter(entry => entry.id !== id);
  
  if (filteredEntries.length === entries.length) {
    throw new Error(`Measurement entry with id ${id} not found`);
  }
  
  setItem(MEASUREMENT_ENTRIES_STORAGE_KEY, filteredEntries);
}

// For backward compatibility
export function getWeightEntry(id: number): WeightEntry | undefined {
  return getMeasurementEntry(id);
}

export function getWeightEntriesByBabyId(babyId: number): WeightEntry[] {
  return getMeasurementEntriesByBabyId(babyId);
}

export function createWeightEntry(insertEntry: InsertWeightEntry): WeightEntry {
  // Create a new object with only the properties that are valid for MeasurementEntry
  const measurementEntry: InsertMeasurementEntry = {
    babyId: insertEntry.babyId,
    date: insertEntry.date,
    ageMonths: insertEntry.ageMonths,
    weight: insertEntry.weight,
    weightPercentile: insertEntry.percentile || null,
    height: null,
    heightPercentile: null,
    notes: null
  };
  
  return createMeasurementEntry(measurementEntry);
}

export function updateWeightEntry(id: number, updatedData: Partial<WeightEntry>): WeightEntry {
  // Create a new object with only the properties that are valid for MeasurementEntry
  const mappedData: Partial<MeasurementEntry> = {...updatedData};
  
  // If percentile exists, map it to weightPercentile and remove it
  if ('percentile' in updatedData) {
    mappedData.weightPercentile = updatedData.percentile;
    delete (mappedData as any).percentile;
  }
  
  return updateMeasurementEntry(id, mappedData);
}

export function deleteWeightEntry(id: number): void {
  deleteMeasurementEntry(id);
}