import { useState } from "react";
import { motion } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ThikrList from "@/components/athkar/ThikrList";

export default function Home() {
  const [timeOfDay, setTimeOfDay] = useState<"morning" | "evening">("morning");

  return (
    <div className="container mx-auto py-8">
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="text-center mb-8"
      >
        <h1 className="text-4xl font-bold mb-4">أذكار المسلم</h1>
        <p className="text-muted-foreground">اختر الوقت المناسب للأذكار</p>
      </motion.div>

      <Tabs
        defaultValue="morning"
        className="w-full max-w-2xl mx-auto"
        onValueChange={(v) => setTimeOfDay(v as "morning" | "evening")}
      >
        <TabsList className="grid w-full grid-cols-2 mb-8">
          <TabsTrigger value="morning">أذكار الصباح</TabsTrigger>
          <TabsTrigger value="evening">أذكار المساء</TabsTrigger>
        </TabsList>
        <TabsContent value="morning">
          <ThikrList timeOfDay="morning" />
        </TabsContent>
        <TabsContent value="evening">
          <ThikrList timeOfDay="evening" />
        </TabsContent>
      </Tabs>
    </div>
  );
}
