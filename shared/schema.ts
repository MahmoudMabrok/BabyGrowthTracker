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

// Measurement entries schema (both weight and height)
export const measurementEntries = pgTable("measurementEntries", {
  id: serial("id").primaryKey(),
  babyId: serial("babyId").references(() => babies.id),
  date: text("date").notNull(),
  ageMonths: numeric("ageMonths").notNull(),
  weight: numeric("weight"),
  weightPercentile: numeric("weightPercentile"),
  height: numeric("height"),
  heightPercentile: numeric("heightPercentile"),
  notes: text("notes"),
});

export const insertMeasurementEntrySchema = createInsertSchema(measurementEntries).omit({
  id: true,
});

export type InsertMeasurementEntry = z.infer<typeof insertMeasurementEntrySchema>;
export type MeasurementEntry = typeof measurementEntries.$inferSelect;

// For backward compatibility
export const weightEntries = measurementEntries;

// Extended WeightEntry types for backward compatibility
export type WeightEntry = MeasurementEntry & {
  percentile?: string;
};

export type InsertWeightEntry = Omit<InsertMeasurementEntry, 'id'> & {
  percentile?: string;
};

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

export const measurementEntryFormSchema = z.object({
  date: z.string().min(1, "Date is required"),
  weight: z.coerce.number()
    .min(0.5, "Weight must be at least 0.5 kg")
    .max(30, "Weight must be less than 30 kg")
    .optional(),
  height: z.coerce.number()
    .min(30, "Height must be at least 30 cm")
    .max(200, "Height must be less than 200 cm")
    .optional(),
  notes: z.string().optional()
});

// For backward compatibility
export const weightEntryFormSchema = measurementEntryFormSchema;

export type BabyFormValues = z.infer<typeof babyFormSchema>;
export type MeasurementEntryFormValues = z.infer<typeof measurementEntryFormSchema>;
export type WeightEntryFormValues = MeasurementEntryFormValues;
