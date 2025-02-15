import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Settings } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetDescription,
} from "@/components/ui/sheet";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

function hexToHSL(hex: string) {
  // Remove the # if present
  hex = hex.replace('#', '');

  // Convert hex to RGB
  const r = parseInt(hex.substring(0, 2), 16) / 255;
  const g = parseInt(hex.substring(2, 4), 16) / 255;
  const b = parseInt(hex.substring(4, 6), 16) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0, s, l = (max + min) / 2;

  if (max === min) {
    h = s = 0;
  } else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }

    h /= 6;
  }

  // Convert to degrees and percentages
  h = Math.round(h * 360);
  s = Math.round(s * 100);
  l = Math.round(l * 100);

  return `${h} ${s}% ${l}%`;
}

export default function ColorCustomizer() {
  const [primaryColor, setPrimaryColor] = useState("#22c55e"); // Default green color

  useEffect(() => {
    const savedColor = localStorage.getItem('athkar-primary-color');
    if (savedColor) {
      setPrimaryColor(savedColor);
      updateThemeColor(savedColor);
    }
  }, []);

  const updateThemeColor = (color: string) => {
    const hsl = hexToHSL(color);
    document.documentElement.style.setProperty('--primary', hsl);
  };

  const handleColorChange = (color: string) => {
    setPrimaryColor(color);
    updateThemeColor(color);
    localStorage.setItem('athkar-primary-color', color);
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" className="rounded-full">
          <Settings className="h-[1.2rem] w-[1.2rem]" />
          <span className="sr-only">تخصيص المظهر</span>
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle className="text-right">تخصيص المظهر</SheetTitle>
          <SheetDescription className="text-right">
            قم بتخصيص ألوان التطبيق حسب تفضيلاتك الشخصية
          </SheetDescription>
        </SheetHeader>
        <div className="mt-6 space-y-4">
          <div className="space-y-2">
            <Label className="text-right block">اللون الرئيسي</Label>
            <div className="flex gap-4">
              <Input
                type="color"
                value={primaryColor}
                onChange={(e) => handleColorChange(e.target.value)}
                className="w-full h-10"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label className="text-right block">الألوان المقترحة</Label>
            <div className="grid grid-cols-5 gap-2">
              {[
                "#22c55e", // Green
                "#3b82f6", // Blue
                "#8b5cf6", // Purple
                "#ec4899", // Pink
                "#f59e0b", // Yellow
              ].map((color) => (
                <button
                  key={color}
                  className="w-8 h-8 rounded-full border-2 border-gray-200"
                  style={{ backgroundColor: color }}
                  onClick={() => handleColorChange(color)}
                  aria-label={`اختيار اللون ${color}`}
                />
              ))}
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}