import express, { type Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertBabySchema, insertWeightEntrySchema, babyFormSchema, weightEntryFormSchema } from "@shared/schema";
import { calculatePercentile } from "../client/src/lib/utils";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // API routes for baby information
  app.post("/api/baby", async (req: Request, res: Response) => {
    try {
      const babyData = babyFormSchema.parse(req.body);
      const baby = await storage.createBaby(babyData);
      
      // Create initial birth weight entry
      await storage.createWeightEntry({
        babyId: baby.id,
        date: baby.birthDate,
        ageMonths: 0,
        weight: Number(baby.birthWeight),
        percentile: calculatePercentile(0, Number(baby.birthWeight), baby.gender)
      });
      
      res.status(201).json(baby);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid baby data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Failed to create baby" });
      }
    }
  });

  app.get("/api/baby/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const baby = await storage.getBaby(id);
      
      if (!baby) {
        return res.status(404).json({ message: "Baby not found" });
      }
      
      res.json(baby);
    } catch (error) {
      res.status(500).json({ message: "Failed to get baby" });
    }
  });

  // API routes for weight entries
  app.post("/api/weight-entries", async (req: Request, res: Response) => {
    try {
      const data = weightEntryFormSchema.parse(req.body);
      const { babyId, ageMonths } = req.body;
      
      if (!babyId || typeof babyId !== 'number') {
        return res.status(400).json({ message: "Baby ID is required" });
      }

      if (typeof ageMonths !== 'number') {
        return res.status(400).json({ message: "Age in months is required" });
      }
      
      const baby = await storage.getBaby(babyId);
      if (!baby) {
        return res.status(404).json({ message: "Baby not found" });
      }
      
      const percentile = calculatePercentile(ageMonths, data.weight, baby.gender);
      
      const entry = await storage.createWeightEntry({
        babyId,
        date: data.date,
        ageMonths,
        weight: data.weight,
        percentile
      });
      
      res.status(201).json(entry);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid weight entry data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Failed to create weight entry" });
      }
    }
  });

  app.get("/api/weight-entries/:babyId", async (req: Request, res: Response) => {
    try {
      const babyId = parseInt(req.params.babyId);
      const entries = await storage.getWeightEntriesByBabyId(babyId);
      res.json(entries);
    } catch (error) {
      res.status(500).json({ message: "Failed to get weight entries" });
    }
  });

  app.put("/api/weight-entries/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const data = weightEntryFormSchema.parse(req.body);
      const { ageMonths } = req.body;
      
      if (typeof ageMonths !== 'number') {
        return res.status(400).json({ message: "Age in months is required" });
      }
      
      const entry = await storage.getWeightEntry(id);
      if (!entry) {
        return res.status(404).json({ message: "Weight entry not found" });
      }
      
      const baby = await storage.getBaby(entry.babyId);
      if (!baby) {
        return res.status(404).json({ message: "Baby not found" });
      }
      
      // Calculate new percentile
      const percentile = calculatePercentile(ageMonths, data.weight, baby.gender);
      
      const updatedEntry = await storage.updateWeightEntry(id, {
        date: data.date,
        ageMonths,
        weight: data.weight,
        percentile
      });
      
      res.json(updatedEntry);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid weight entry data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Failed to update weight entry" });
      }
    }
  });

  app.delete("/api/weight-entries/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      
      const entry = await storage.getWeightEntry(id);
      if (!entry) {
        return res.status(404).json({ message: "Weight entry not found" });
      }
      
      // Don't allow deleting birth weight entry
      const baby = await storage.getBaby(entry.babyId);
      if (!baby) {
        return res.status(404).json({ message: "Baby not found" });
      }
      
      if (entry.date === baby.birthDate && Number(entry.ageMonths) === 0) {
        return res.status(400).json({ message: "Cannot delete birth weight entry" });
      }
      
      await storage.deleteWeightEntry(id);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete weight entry" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
