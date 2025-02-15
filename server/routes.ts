import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertProgressSchema } from "@shared/schema";

export function registerRoutes(app: Express): Server {
  app.get("/api/progress/:timeOfDay", async (req, res) => {
    const { timeOfDay } = req.params;
    const progress = await storage.getProgress(timeOfDay);
    res.json(progress || { timeOfDay, completedIds: [] });
  });

  app.post("/api/progress", async (req, res) => {
    const data = insertProgressSchema.parse(req.body);
    const progress = await storage.saveProgress(data);
    res.json(progress);
  });

  const httpServer = createServer(app);
  return httpServer;
}
