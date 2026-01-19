import React, { useState, useEffect } from 'react';
import { Button } from '../components/ui/Button';
import { Copy } from 'lucide-react';
import { useToast } from '../components/ui/Toast';
import { copyToClipboard } from '../utils/copyToClipboard';

// Helper to convert HEX to RGB
function hexToRgb(hex: string) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
}

// Helper to convert RGB to HSL
function rgbToHsl(r: number, g: number, b: number) {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h = 0, s, l = (max + min) / 2;

  if (max === min) {
    h = s = 0; // achromatic
  } else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }

  return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) };
}

// Helper to convert RGB to HEX
function rgbToHex(r: number, g: number, b: number) {
  return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}

export const ColorConverter: React.FC = () => {
  const [hex, setHex] = useState('#6366f1');
  const [rgb, setRgb] = useState({ r: 99, g: 102, b: 241 });
  const [hsl, setHsl] = useState({ h: 239, s: 84, l: 67 });
  const toast = useToast();

  const handleCopy = async (text: string, label: string) => {
    const success = await copyToClipboard(text);
    if (success) {
      toast.success(`${label} copied to clipboard!`);
    } else {
      toast.error('Failed to copy to clipboard');
    }
  };

  // Update from HEX input
  const handleHexChange = (val: string) => {
    setHex(val);
    if (/^#?([0-9A-F]{3}){1,2}$/i.test(val)) {
       // Normalize hex
       const fullHex = val.length === 4 ? '#' + val[1]+val[1]+val[2]+val[2]+val[3]+val[3] : val;
       const rgbVal = hexToRgb(fullHex);
       if (rgbVal) {
          setRgb(rgbVal);
          setHsl(rgbToHsl(rgbVal.r, rgbVal.g, rgbVal.b));
       }
    }
  };

  return (
    <div className="grid md:grid-cols-2 gap-8">
       {/* Preview Block */}
       <div 
         className="w-full h-64 md:h-auto rounded-2xl shadow-inner border border-zinc-200 dark:border-zinc-800 transition-colors duration-300"
         style={{ backgroundColor: hex }}
       ></div>

       <div className="space-y-6">
          <div className="space-y-2">
             <label className="text-sm font-bold text-zinc-500 uppercase">HEX</label>
             <div className="flex gap-2">
               <input 
                 className="flex-1 p-3 rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 outline-none focus:border-brand-500 font-mono"
                 value={hex}
                 onChange={(e) => handleHexChange(e.target.value)}
                 maxLength={7}
               />
               <Button variant="ghost" onClick={() => handleCopy(hex, 'HEX')} aria-label="Copy HEX"><Copy className="w-5 h-5" /></Button>
             </div>
          </div>

          <div className="space-y-2">
             <label className="text-sm font-bold text-zinc-500 uppercase">RGB</label>
             <div className="flex gap-2 bg-zinc-50 dark:bg-zinc-900 p-3 rounded-xl border border-zinc-200 dark:border-zinc-700">
                <span className="flex-1 font-mono flex items-center">rgb({rgb.r}, {rgb.g}, {rgb.b})</span>
                <Button variant="ghost" size="sm" onClick={() => handleCopy(`rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`, 'RGB')} aria-label="Copy RGB"><Copy className="w-4 h-4" /></Button>
             </div>
          </div>

          <div className="space-y-2">
             <label className="text-sm font-bold text-zinc-500 uppercase">HSL</label>
             <div className="flex gap-2 bg-zinc-50 dark:bg-zinc-900 p-3 rounded-xl border border-zinc-200 dark:border-zinc-700">
                <span className="flex-1 font-mono flex items-center">hsl({hsl.h}, {hsl.s}%, {hsl.l}%)</span>
                <Button variant="ghost" size="sm" onClick={() => handleCopy(`hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`, 'HSL')} aria-label="Copy HSL"><Copy className="w-4 h-4" /></Button>
             </div>
          </div>
       </div>
    </div>
  );
};
