import React, { useState, useMemo, useRef, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { TOOLS, CATEGORIES } from '../constants';
import { ToolCategory } from '../types';
import { Search, Sparkles, Star, Clock, X, Command } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { useDebounce } from '../hooks/useDebounce';
import { useKeyboardShortcut } from '../hooks/useKeyboardShortcut';
import { useToast } from '../components/ui/Toast';
import { Tooltip } from '../components/ui/Tooltip';
import { storage } from '../utils/storage';
import { Button } from '../components/ui/Button';
import { SkeletonCard } from '../components/ui/Skeleton';

export const Home: React.FC = () => {
  const { cat } = useParams();
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const debouncedSearch = useDebounce(search, 300);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const toast = useToast();
  const [favorites, setFavorites] = useState<string[]>(() => 
    storage.getFavorites().map(f => f.id)
  );
  const [recentTools, setRecentTools] = useState(() => storage.getRecentTools());

  // Convert URL slug to ToolCategory enum value (e.g., "pdf-tools" -> "PDF Tools")
  const currentCategory = useMemo(() => {
    if (!cat) return null;
    
    // Find matching category from CATEGORIES array by comparing slugified versions
    const urlSlug = cat.toLowerCase();
    const matchingCategory = CATEGORIES.find(category => {
      const categorySlug = category.toLowerCase().replace(/[ &]/g, '-').replace(/--+/g, '-');
      return categorySlug === urlSlug;
    });
    
    return matchingCategory || null;
  }, [cat]);

  const filteredTools = useMemo(() => {
    return TOOLS.filter(t => {
      const matchesSearch = t.name.toLowerCase().includes(debouncedSearch.toLowerCase()) || 
                           t.description.toLowerCase().includes(debouncedSearch.toLowerCase());
      const matchesCategory = !currentCategory || t.category === currentCategory;
      return matchesSearch && matchesCategory;
    });
  }, [debouncedSearch, currentCategory]);

  // Keyboard shortcuts
  useKeyboardShortcut('/', (e) => {
    if (!isSearchFocused) {
      e.preventDefault();
      searchInputRef.current?.focus();
    }
  });

  useKeyboardShortcut('k', (e) => {
    if (e.ctrlKey || e.metaKey) {
      e.preventDefault();
      searchInputRef.current?.focus();
    }
  }, { ctrl: true });

  // Toggle favorite
  const toggleFavorite = (e: React.MouseEvent, toolId: string, toolName: string, toolPath: string) => {
    e.preventDefault();
    e.stopPropagation();
    
    const isFavorite = storage.toggleFavorite({ id: toolId, name: toolName, path: toolPath });
    setFavorites(prev => {
      if (isFavorite) {
        toast.success(`${toolName} added to favorites`);
        return [...prev, toolId];
      } else {
        toast.info(`${toolName} removed from favorites`);
        return prev.filter(id => id !== toolId);
      }
    });
  };

  // Get favorite tools
  const favoriteTools = useMemo(() => {
    return TOOLS.filter(t => favorites.includes(t.id));
  }, [favorites]);

  // Get recent tools
  const recentToolItems = useMemo(() => {
    return recentTools
      .map(rt => TOOLS.find(t => t.id === rt.id))
      .filter(Boolean) as typeof TOOLS;
  }, [recentTools]);

  return (
    <div className="space-y-12 animate-fade-in pb-12">
      {/* Hero */}
      <section className="text-center space-y-6 pt-8 pb-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/10 text-brand-600 dark:text-brand-400 text-xs font-bold uppercase tracking-widest mb-4">
          <Sparkles className="w-3 h-3" />
          Always Free & Private
        </div>
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-zinc-900 dark:text-white">
          {currentCategory ? currentCategory : (
            <>Utilities for <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-500 to-purple-600">Creators</span></>
          )}
        </h1>
        <p className="text-lg text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto">
          {currentCategory 
            ? `Specialized tools for ${currentCategory.toLowerCase()} management and processing.`
            : "Secure, client-side tools for your daily tasks. Blazing fast and 100% private."
          }
        </p>
        
        <div className="max-w-xl mx-auto relative group">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-zinc-400 group-focus-within:text-brand-500 transition-colors" />
          </div>
          <input
            ref={searchInputRef}
            type="text"
            className="block w-full pl-11 pr-20 py-4 bg-white dark:bg-dark-card border-2 border-zinc-200 dark:border-dark-border rounded-2xl text-zinc-900 dark:text-white placeholder-zinc-400 focus:outline-none focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 transition-all shadow-sm"
            placeholder={`Search ${TOOLS.length} tools...`}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onFocus={() => setIsSearchFocused(true)}
            onBlur={() => setIsSearchFocused(false)}
            aria-label="Search tools"
          />
          <div className="absolute inset-y-0 right-0 pr-4 flex items-center gap-2 pointer-events-none">
            {search && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setSearch('');
                  searchInputRef.current?.focus();
                }}
                className="pointer-events-auto p-1 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                aria-label="Clear search"
              >
                <X className="w-4 h-4 text-zinc-400" />
              </button>
            )}
            <kbd className="hidden sm:inline-flex items-center gap-1 px-2 py-1 text-xs font-mono text-zinc-400 bg-zinc-100 dark:bg-zinc-800 rounded border border-zinc-200 dark:border-zinc-700">
              <Command className="w-3 h-3" />K
            </kbd>
          </div>
        </div>
      </section>

      {/* Recently Used Tools */}
      {!currentCategory && !search && recentToolItems.length > 0 && (
        <section>
          <div className="flex items-center gap-2 mb-4">
            <Clock className="w-5 h-5 text-zinc-500 dark:text-zinc-400" />
            <h2 className="text-xl font-bold text-zinc-900 dark:text-white">Recently Used</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recentToolItems.slice(0, 6).map((tool) => {
              const Icon = tool.icon;
              const isFavorite = favorites.includes(tool.id);
              return (
                <Link key={tool.id} to={tool.path} className="group">
                  <Card className="h-full hover:shadow-xl hover:shadow-brand-500/5 hover:-translate-y-1 transition-all duration-300 border-zinc-200 dark:border-dark-border relative">
                    <div className="flex items-start justify-between mb-4">
                      <div className="p-3 rounded-xl bg-brand-50 dark:bg-brand-900/20 text-brand-600 dark:text-brand-400 group-hover:scale-110 transition-transform">
                        <Icon className="w-6 h-6" />
                      </div>
                      <button
                        onClick={(e) => toggleFavorite(e, tool.id, tool.name, tool.path)}
                        className="p-1.5 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors z-10"
                        aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
                      >
                        <Star className={`w-4 h-4 ${isFavorite ? 'fill-amber-400 text-amber-400' : 'text-zinc-400'}`} />
                      </button>
                    </div>
                    <h3 className="text-lg font-bold text-zinc-900 dark:text-white mb-2 group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">{tool.name}</h3>
                    <p className="text-sm text-zinc-500 dark:text-zinc-400">{tool.description}</p>
                  </Card>
                </Link>
              );
            })}
          </div>
        </section>
      )}

      {/* Favorite Tools */}
      {!currentCategory && !search && favoriteTools.length > 0 && (
        <section>
          <div className="flex items-center gap-2 mb-4">
            <Star className="w-5 h-5 text-amber-500 fill-amber-500" />
            <h2 className="text-xl font-bold text-zinc-900 dark:text-white">Favorites</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {favoriteTools.map((tool) => {
              const Icon = tool.icon;
              return (
                <Link key={tool.id} to={tool.path} className="group">
                  <Card className="h-full hover:shadow-xl hover:shadow-brand-500/5 hover:-translate-y-1 transition-all duration-300 border-zinc-200 dark:border-dark-border relative">
                    <div className="flex items-start justify-between mb-4">
                      <div className="p-3 rounded-xl bg-brand-50 dark:bg-brand-900/20 text-brand-600 dark:text-brand-400 group-hover:scale-110 transition-transform">
                        <Icon className="w-6 h-6" />
                      </div>
                      <button
                        onClick={(e) => toggleFavorite(e, tool.id, tool.name, tool.path)}
                        className="p-1.5 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors z-10"
                        aria-label="Remove from favorites"
                      >
                        <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                      </button>
                    </div>
                    <h3 className="text-lg font-bold text-zinc-900 dark:text-white mb-2 group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">{tool.name}</h3>
                    <p className="text-sm text-zinc-500 dark:text-zinc-400">{tool.description}</p>
                  </Card>
                </Link>
              );
            })}
          </div>
        </section>
      )}

      {/* All Tools Grid */}
      <section>
        {currentCategory && !search && (
          <h2 className="text-xl font-bold text-zinc-900 dark:text-white mb-4">{currentCategory}</h2>
        )}
        {!currentCategory && !search && (
          <h2 className="text-xl font-bold text-zinc-900 dark:text-white mb-4">All Tools</h2>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTools.map((tool) => {
            const Icon = tool.icon;
            const isFavorite = favorites.includes(tool.id);

            return (
              <Link key={tool.id} to={tool.path} className="group">
                <Card className="h-full hover:shadow-xl hover:shadow-brand-500/5 hover:-translate-y-1 transition-all duration-300 border-zinc-200 dark:border-dark-border relative">
                  <div className="flex items-start justify-between mb-4">
                    <div className="p-3 rounded-xl bg-brand-50 dark:bg-brand-900/20 text-brand-600 dark:text-brand-400 group-hover:scale-110 transition-transform">
                      <Icon className="w-6 h-6" />
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <button
                        onClick={(e) => toggleFavorite(e, tool.id, tool.name, tool.path)}
                        className="p-1.5 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors z-10"
                        aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
                      >
                        <Star className={`w-4 h-4 ${isFavorite ? 'fill-amber-400 text-amber-400' : 'text-zinc-400'}`} />
                      </button>
                      <div className="flex gap-1">
                        {tool.popular && (
                          <Tooltip content="Popular tool">
                            <span className="px-2 py-0.5 bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 text-[9px] font-bold uppercase tracking-wider rounded-full">Popular</span>
                          </Tooltip>
                        )}
                        {tool.new && (
                          <Tooltip content="Newly added">
                            <span className="px-2 py-0.5 bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 text-[9px] font-bold uppercase tracking-wider rounded-full">New</span>
                          </Tooltip>
                        )}
                      </div>
                    </div>
                  </div>
                  <h3 className="text-lg font-bold text-zinc-900 dark:text-white mb-2 group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">{tool.name}</h3>
                  <p className="text-sm text-zinc-500 dark:text-zinc-400">{tool.description}</p>
                </Card>
              </Link>
            );
          })}
        </div>
        
        {filteredTools.length === 0 && (
          <div className="col-span-full text-center py-24 text-zinc-500 border-2 border-dashed border-zinc-200 dark:border-zinc-800 rounded-2xl bg-zinc-50 dark:bg-zinc-900/20">
            <Search className="w-16 h-16 mx-auto mb-4 opacity-20" />
            <h3 className="text-xl font-semibold text-zinc-700 dark:text-zinc-300 mb-2">No tools found</h3>
            <p className="text-zinc-500 dark:text-zinc-400 mb-4">
              {search ? `No tools match "${search}"` : 'Try adjusting your search or filters'}
            </p>
            {search && (
              <Button onClick={() => setSearch('')} variant="outline" size="sm">
                Clear search
              </Button>
            )}
          </div>
        )}
      </section>
    </div>
  );
};
