import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useState, useEffect, useRef } from "react";
import { SkipForward } from "lucide-react";

interface ThikrCardProps {
  text: string;
  count: number;
  onComplete: () => void;
}

export default function ThikrCard({ text, count, onComplete }: ThikrCardProps) {
  const [remaining, setRemaining] = useState(count);
  const audioContextRef = useRef<AudioContext | null>(null);

  const playClickSound = () => {
    if (!audioContextRef.current) {
      audioContextRef.current = new AudioContext();
    }

    const oscillator = audioContextRef.current.createOscillator();
    const gainNode = audioContextRef.current.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContextRef.current.destination);

    oscillator.frequency.value = 2000;
    gainNode.gain.value = 0.1;

    oscillator.start();
    gainNode.gain.exponentialRampToValueAtTime(
      0.00001, 
      audioContextRef.current.currentTime + 0.1
    );

    setTimeout(() => oscillator.stop(), 100);
  };

  const handleClick = () => {
    if (remaining > 0) {
      playClickSound();
      if ('vibrate' in navigator) {
        navigator.vibrate(50);
      }
      setRemaining(prev => prev - 1);
    }
    if (remaining === 1) {
      onComplete();
    }
  };

  return (
    <motion.div
      initial={{ scale: 0.95, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.95, opacity: 0 }}
      className="w-full relative"
    >
      <Card className="p-6 shadow-lg transform-gpu hover:translate-y-[-2px] transition-transform">
        <div className="flex flex-col items-center gap-4">
          <p className="text-2xl text-center font-arabic leading-loose">{text}</p>
          <Button
            onClick={handleClick}
            className="w-20 h-20 rounded-full text-3xl relative overflow-hidden"
            disabled={remaining === 0}
          >
            <motion.span
              key={remaining}
              initial={{ y: 20 }}
              animate={{ y: 0 }}
              className="absolute"
            >
              {remaining}
            </motion.span>
          </Button>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-2 left-2"
          onClick={onComplete}
          title="تخطي"
        >
          <SkipForward className="h-4 w-4" />
        </Button>
      </Card>
    </motion.div>
  );
}