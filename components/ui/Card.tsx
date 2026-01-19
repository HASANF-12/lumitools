import React from 'react';
import { cn } from '../../utils/cn';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  description?: string;
}

export const Card: React.FC<CardProps> = ({ className, title, description, children, ...props }) => {
  return (
    <div 
      className={cn(
        "bg-white dark:bg-dark-card border border-zinc-200 dark:border-dark-border rounded-2xl shadow-sm overflow-hidden",
        className
      )}
      {...props}
    >
      {(title || description) && (
        <div className="px-6 py-4 border-b border-zinc-100 dark:border-dark-border/50">
          {title && <h3 className="text-lg font-semibold text-zinc-900 dark:text-white">{title}</h3>}
          {description && <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">{description}</p>}
        </div>
      )}
      <div className="p-6">
        {children}
      </div>
    </div>
  );
};
