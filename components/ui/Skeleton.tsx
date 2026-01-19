import React from 'react';
import { cn } from '../../utils/cn';

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'text' | 'circular' | 'rectangular';
  width?: string | number;
  height?: string | number;
}

export const Skeleton: React.FC<SkeletonProps> = ({
  className,
  variant = 'rectangular',
  width,
  height,
  style,
  ...props
}) => {
  const baseStyles = 'animate-pulse bg-zinc-200 dark:bg-zinc-800';
  
  const variantStyles = {
    text: 'rounded h-4',
    circular: 'rounded-full',
    rectangular: 'rounded-lg',
  };

  return (
    <div
      className={cn(baseStyles, variantStyles[variant], className)}
      style={{
        width: width || '100%',
        height: height || '1rem',
        ...style,
      }}
      aria-busy="true"
      aria-label="Loading"
      {...props}
    />
  );
};

export const SkeletonCard: React.FC = () => {
  return (
    <div className="bg-white dark:bg-dark-card border border-zinc-200 dark:border-dark-border rounded-2xl p-6 space-y-4">
      <div className="flex items-start justify-between">
        <Skeleton variant="circular" width={48} height={48} />
        <Skeleton width={60} height={20} />
      </div>
      <Skeleton variant="text" width="80%" height={24} />
      <Skeleton variant="text" width="100%" />
      <Skeleton variant="text" width="60%" />
    </div>
  );
};


