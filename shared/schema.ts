import { pgTable, text, serial, timestamp, numeric, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// Baby information schema
export const babies = pgTable("babies", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  birthDate: text("birthDate").notNull(),
  birthWeight: numeric("birthWeight").notNull(),
  gender: text("gender").notNull(),
  userId: serial("userId").references(() => users.id),
});

export const insertBabySchema = createInsertSchema(babies).omit({
  id: true,
  userId: true,
});

export type InsertBaby = z.infer<typeof insertBabySchema>;
export type Baby = typeof babies.$inferSelect;

// Weight entries schema
export const weightEntries = pgTable("weightEntries", {
  id: serial("id").primaryKey(),
  babyId: serial("babyId").references(() => babies.id),
  date: text("date").notNull(),
  ageMonths: numeric("ageMonths").notNull(),
  weight: numeric("weight").notNull(),
  percentile: numeric("percentile"),
});

export const insertWeightEntrySchema = createInsertSchema(weightEntries).omit({
  id: true,
});

export type InsertWeightEntry = z.infer<typeof insertWeightEntrySchema>;
export type WeightEntry = typeof weightEntries.$inferSelect;

// Extended validation schemas for frontend forms
export const babyFormSchema = insertBabySchema.extend({
  name: z.string().min(1, "Baby's name is required"),
  birthDate: z.string().min(1, "Birth date is required"),
  birthWeight: z.coerce.number()
    .min(0.5, "Weight must be at least 0.5 kg")
    .max(6, "Weight must be less than 6 kg"),
  gender: z.enum(["male", "female"], {
    required_error: "Please select gender",
  }),
});

export const weightEntryFormSchema = z.object({
  date: z.string().min(1, "Date is required"),
  weight: z.coerce.number()
    .min(0.5, "Weight must be at least 0.5 kg")
    .max(30, "Weight must be less than 30 kg"),
});

export type BabyFormValues = z.infer<typeof babyFormSchema>;
export type WeightEntryFormValues = z.infer<typeof weightEntryFormSchema>;
