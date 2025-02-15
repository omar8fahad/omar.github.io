import { pgTable, text, serial, integer, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const athkarData = {
  morning: [
    { id: 1, text: "أَعُوذُ بِاللهِ مِنَ الشَّيْطَانِ الرَّجِيمِ", count: 1 },
    { id: 2, text: "اللَّهُ لاَ إِلَهَ إِلاَّ هُوَ الْحَيُّ الْقَيُّومُ", count: 1 },
    { id: 3, text: "سُبْحَانَ اللهِ وَبِحَمْدِهِ", count: 3 },
    { id: 4, text: "أَسْتَغْفِرُ اللهَ وَأَتُوبُ إِلَيْهِ", count: 3 },
    // Add more morning athkar as needed
  ],
  evening: [
    { id: 1, text: "بِسْمِ اللهِ الرَّحْمَنِ الرَّحِيمِ", count: 1 },
    { id: 2, text: "قُلْ هُوَ اللَّهُ أَحَدٌ", count: 3 },
    { id: 3, text: "أَعُوذُ بِكَلِمَاتِ اللهِ التَّامَّاتِ مِنْ شَرِّ مَا خَلَقَ", count: 3 },
    // Add more evening athkar as needed
  ]
};

export const progressTable = pgTable("progress", {
  id: serial("id").primaryKey(),
  timeOfDay: text("time_of_day").notNull(),
  completedIds: text("completed_ids").array().notNull(),
});

export const insertProgressSchema = createInsertSchema(progressTable);

export type Progress = typeof progressTable.$inferSelect;
export type InsertProgress = z.infer<typeof insertProgressSchema>;
