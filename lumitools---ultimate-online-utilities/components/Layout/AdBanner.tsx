import React, { useState, useEffect } from 'react';
import { cn } from '../../utils/cn';
import { AdProps } from '../../types';

export const AdBanner: React.FC<AdProps & { label?: boolean }> = ({ slot, className, label = true }) => {
  const [adBlocked, setAdBlocked] = useState(false);

  useEffect(() => {
    // Detect if ads might be blocked (simple heuristic)
    const checkAdBlock = () => {
      
      // This is a placeholder - in production, you'd check if your ad script loaded
      // For now, we'll assume ads are available
      setAdBlocked(false);
    };
    checkAdBlock();
  }, []);

  const getSlotStyles = () => {
    switch (slot) {
      case 'header': return 'h-[90px] w-full max-w-[728px] mx-auto';
      case 'sidebar': return 'h-[600px] w-full max-w-[160px] mx-auto';
      case 'content': return 'min-h-[250px] w-full max-w-[300px] mx-auto md:max-w-full';
      case 'footer': return 'h-[90px] w-full md:h-[250px]';
      default: return 'h-[100px]';
    }
  };

  // If ad is blocked, show a subtle message instead of empty space
  if (adBlocked) {
    return (
      <div className={cn("flex flex-col items-center justify-center text-xs text-zinc-400", className)}>
        {label && (
          <span className="text-[10px] uppercase tracking-widest text-zinc-400 dark:text-zinc-600 mb-1 font-bold">
            Advertisement
          </span>
        )}
        <div className={cn("bg-zinc-50 dark:bg-zinc-900/30 border border-dashed border-zinc-200 dark:border-zinc-800 rounded-lg flex items-center justify-center text-xs text-zinc-400 select-none", getSlotStyles())}>
          <span className="font-mono opacity-50">Ad space</span>
        </div>
      </div>
    );
  }

  return (
    <div className={cn(
      "relative group flex flex-col items-center",
      className
    )}>
      {label && (
        <span className="text-[10px] uppercase tracking-widest text-zinc-400 dark:text-zinc-600 mb-1 font-bold">
          Advertisement
        </span>
      )}
      <div className={cn(
        "bg-zinc-100 dark:bg-zinc-900/50 border border-dashed border-zinc-300 dark:border-zinc-800 rounded-lg flex items-center justify-center text-xs text-zinc-400 select-none overflow-hidden",
        getSlotStyles()
      )}>
        <div className="flex flex-col items-center gap-2 opacity-40">
          <div className="w-8 h-8 rounded bg-zinc-200 dark:bg-zinc-800 animate-pulse" />
          <span className="font-mono">{slot.toUpperCase()} AD UNIT</span>
        </div>
      </div>
    </div>
  );
};