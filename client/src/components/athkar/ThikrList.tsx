import { motion, AnimatePresence } from "framer-motion";
import ThikrCard from "./ThikrCard";
import { athkarData } from "@shared/schema";
import { useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";

interface ThikrListProps {
  timeOfDay: "morning" | "evening";
}

export default function ThikrList({ timeOfDay }: ThikrListProps) {
  const [completedIds, setCompletedIds] = useState<number[]>([]);
  const athkar = athkarData[timeOfDay];
  
  const currentThikr = athkar.find(t => !completedIds.includes(t.id));

  const handleComplete = (id: number) => {
    setCompletedIds(prev => [...prev, id]);
  };

  return (
    <ScrollArea className="h-[calc(100vh-12rem)] w-full max-w-2xl mx-auto px-4">
      <AnimatePresence mode="wait">
        {currentThikr && (
          <ThikrCard
            key={currentThikr.id}
            text={currentThikr.text}
            count={currentThikr.count}
            onComplete={() => handleComplete(currentThikr.id)}
          />
        )}
      </AnimatePresence>
      {!currentThikr && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-8"
        >
          <h2 className="text-2xl font-semibold">أحسنت! لقد أكملت جميع الأذكار</h2>
        </motion.div>
      )}
    </ScrollArea>
  );
}
