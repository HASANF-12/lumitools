import { LucideIcon } from 'lucide-react';

export enum ToolCategory {
  PDF = 'PDF Tools',
  IMAGE = 'Image Tools',
  TEXT = 'Text Tools',
  DATA = 'Data & Converter',
  DEV = 'Developer Tools',
}

export interface ToolDefinition {
  id: string;
  name: string;
  description: string;
  category: ToolCategory;
  path: string;
  icon: LucideIcon;
  popular?: boolean;
  new?: boolean;
}

export interface AdProps {
  slot: 'header' | 'sidebar' | 'content' | 'footer';
  className?: string;
}
