import React from 'react';
import { NavLink } from 'react-router-dom';
import { CATEGORIES, TOOLS, APP_NAME } from '../../constants';
import { LayoutGrid, Info, Shield, FileText } from 'lucide-react';
import { cn } from '../../utils/cn';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  return (
    <>
      <div 
        className={cn(
          "fixed inset-0 bg-black/50 z-40 lg:hidden transition-opacity",
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
        onClick={onClose}
      />
      
      <aside 
        className={cn(
          "fixed lg:sticky top-0 left-0 h-screen w-64 bg-white dark:bg-dark-card border-r border-zinc-200 dark:border-dark-border z-50 transition-transform duration-300 lg:translate-x-0 flex flex-col",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
        role="navigation"
        aria-label="Main navigation"
      >
        <div className="p-6">
          <NavLink 
            to="/" 
            className="flex items-center gap-2 font-bold text-2xl text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500 rounded-lg" 
            onClick={onClose}
            aria-label="Home"
          >
            <div className="w-8 h-8 rounded-lg bg-brand-600 flex items-center justify-center text-white" aria-hidden="true">
              <LayoutGrid className="w-5 h-5" />
            </div>
            {APP_NAME}
          </NavLink>
        </div>

        <nav className="flex-1 px-4 py-2 space-y-8 overflow-y-auto" aria-label="Tool categories">
          <div>
            <div className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-3 px-2">Discover</div>
            <div className="space-y-1" role="list">
              <NavLink 
                to="/" 
                className={({isActive}) => cn(
                  "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-brand-500",
                  isActive ? "bg-brand-50 dark:bg-brand-900/20 text-brand-600 dark:text-brand-400" : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                )} 
                onClick={onClose}
                role="listitem"
              >
                <LayoutGrid className="w-4 h-4" aria-hidden="true" /> All Tools
              </NavLink>
              {CATEGORIES.map(cat => (
                <NavLink 
                  key={cat} 
                  to={`/category/${cat.toLowerCase().replace(/[ &]/g, '-').replace(/--+/g, '-')}`} 
                  className={({isActive}) => cn(
                    "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-brand-500",
                    isActive ? "bg-brand-50 dark:bg-brand-900/20 text-brand-600 dark:text-brand-400" : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                  )} 
                  onClick={onClose}
                  role="listitem"
                >
                  <span className="w-4 h-4 rounded-full bg-zinc-200 dark:bg-zinc-700 flex items-center justify-center text-[10px] text-zinc-500 dark:text-zinc-300" aria-hidden="true">
                    {cat.charAt(0)}
                  </span>
                  {cat}
                </NavLink>
              ))}
            </div>
          </div>

          <div>
             <div className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-3 px-2">Legal</div>
             <div className="space-y-1" role="list">
               <NavLink 
                 to="/about" 
                 className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-brand-500" 
                 onClick={onClose}
                 role="listitem"
               >
                 <Info className="w-4 h-4" aria-hidden="true" /> About
               </NavLink>
               <NavLink 
                 to="/privacy" 
                 className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-brand-500" 
                 onClick={onClose}
                 role="listitem"
               >
                 <Shield className="w-4 h-4" aria-hidden="true" /> Privacy Policy
               </NavLink>
             </div>
          </div>
        </nav>
      </aside>
    </>
  );
};