const STORAGE_KEYS = {
  RECENT_TOOLS: 'lumitools_recent_tools',
  FAVORITES: 'lumitools_favorites',
  THEME: 'lumitools_theme',
} as const;

export interface RecentTool {
  id: string;
  name: string;
  path: string;
  timestamp: number;
}

export interface FavoriteTool {
  id: string;
  name: string;
  path: string;
}

export const storage = {
  getRecentTools: (): RecentTool[] => {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.RECENT_TOOLS);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  addRecentTool: (tool: Omit<RecentTool, 'timestamp'>) => {
    try {
      const recent = storage.getRecentTools();
      const updated = recent.filter(t => t.id !== tool.id);
      updated.unshift({ ...tool, timestamp: Date.now() });
      const limited = updated.slice(0, 10); // Keep only last 10
      localStorage.setItem(STORAGE_KEYS.RECENT_TOOLS, JSON.stringify(limited));
    } catch (error) {
      console.error('Error saving recent tool:', error);
    }
  },

  getFavorites: (): FavoriteTool[] => {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.FAVORITES);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  toggleFavorite: (tool: FavoriteTool): boolean => {
    try {
      const favorites = storage.getFavorites();
      const exists = favorites.some(t => t.id === tool.id);
      
      if (exists) {
        const updated = favorites.filter(t => t.id !== tool.id);
        localStorage.setItem(STORAGE_KEYS.FAVORITES, JSON.stringify(updated));
        return false;
      } else {
        favorites.push(tool);
        localStorage.setItem(STORAGE_KEYS.FAVORITES, JSON.stringify(favorites));
        return true;
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
      return false;
    }
  },

  isFavorite: (toolId: string): boolean => {
    try {
      const favorites = storage.getFavorites();
      return favorites.some(t => t.id === toolId);
    } catch {
      return false;
    }
  },
};


