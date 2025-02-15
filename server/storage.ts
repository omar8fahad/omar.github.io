import { Progress, InsertProgress } from "@shared/schema";

export interface IStorage {
  getProgress(timeOfDay: string): Promise<Progress | undefined>;
  saveProgress(progress: InsertProgress): Promise<Progress>;
}

export class MemStorage implements IStorage {
  private progress: Map<string, Progress>;
  private currentId: number;

  constructor() {
    this.progress = new Map();
    this.currentId = 1;
  }

  async getProgress(timeOfDay: string): Promise<Progress | undefined> {
    return Array.from(this.progress.values()).find(
      (p) => p.timeOfDay === timeOfDay
    );
  }

  async saveProgress(progress: InsertProgress): Promise<Progress> {
    const id = this.currentId++;
    const newProgress: Progress = { ...progress, id };
    this.progress.set(timeOfDay, newProgress);
    return newProgress;
  }
}

export const storage = new MemStorage();
