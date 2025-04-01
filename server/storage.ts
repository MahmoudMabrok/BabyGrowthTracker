import { Baby, InsertBaby, WeightEntry, InsertWeightEntry } from "@shared/schema";

// Modified storage interface with CRUD methods for baby growth tracker
export interface IStorage {
  // User methods
  getUser(id: number): Promise<any | undefined>;
  getUserByUsername(username: string): Promise<any | undefined>;
  createUser(user: any): Promise<any>;

  // Baby methods
  getBaby(id: number): Promise<Baby | undefined>;
  createBaby(baby: InsertBaby): Promise<Baby>;

  // Weight entry methods
  getWeightEntry(id: number): Promise<WeightEntry | undefined>;
  getWeightEntriesByBabyId(babyId: number): Promise<WeightEntry[]>;
  createWeightEntry(entry: InsertWeightEntry): Promise<WeightEntry>;
  updateWeightEntry(id: number, updatedData: Partial<WeightEntry>): Promise<WeightEntry>;
  deleteWeightEntry(id: number): Promise<void>;
}

export class MemStorage implements IStorage {
  private users: Map<number, any>;
  private babies: Map<number, Baby>;
  private weightEntries: Map<number, WeightEntry>;
  private currentUserId: number;
  private currentBabyId: number;
  private currentEntryId: number;

  constructor() {
    this.users = new Map();
    this.babies = new Map();
    this.weightEntries = new Map();
    this.currentUserId = 1;
    this.currentBabyId = 1;
    this.currentEntryId = 1;
  }

  // User methods
  async getUser(id: number): Promise<any | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<any | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: any): Promise<any> {
    const id = this.currentUserId++;
    const user = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  // Baby methods
  async getBaby(id: number): Promise<Baby | undefined> {
    return this.babies.get(id);
  }

  async createBaby(insertBaby: InsertBaby): Promise<Baby> {
    const id = this.currentBabyId++;
    const baby: Baby = { ...insertBaby, id, userId: 1 }; // default userId to 1 for now
    this.babies.set(id, baby);
    return baby;
  }

  // Weight entry methods
  async getWeightEntry(id: number): Promise<WeightEntry | undefined> {
    return this.weightEntries.get(id);
  }

  async getWeightEntriesByBabyId(babyId: number): Promise<WeightEntry[]> {
    return Array.from(this.weightEntries.values())
      .filter(entry => entry.babyId === babyId)
      .sort((a, b) => {
        // Sort by age in months (ascending)
        return Number(a.ageMonths) - Number(b.ageMonths);
      });
  }

  async createWeightEntry(insertEntry: InsertWeightEntry): Promise<WeightEntry> {
    const id = this.currentEntryId++;
    const entry: WeightEntry = { ...insertEntry, id };
    this.weightEntries.set(id, entry);
    return entry;
  }

  async updateWeightEntry(id: number, updatedData: Partial<WeightEntry>): Promise<WeightEntry> {
    const existingEntry = this.weightEntries.get(id);
    if (!existingEntry) {
      throw new Error(`Weight entry with id ${id} not found`);
    }

    const updatedEntry: WeightEntry = { ...existingEntry, ...updatedData };
    this.weightEntries.set(id, updatedEntry);
    return updatedEntry;
  }

  async deleteWeightEntry(id: number): Promise<void> {
    if (!this.weightEntries.has(id)) {
      throw new Error(`Weight entry with id ${id} not found`);
    }

    this.weightEntries.delete(id);
  }
}

export const storage = new MemStorage();
