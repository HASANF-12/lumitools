import React, { useState, useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { Sidebar } from './components/Layout/Sidebar';
import { Home } from './pages/Home';
import { ToolView } from './pages/ToolView';
import { Menu, Moon, Sun } from 'lucide-react';
import { Button } from './components/ui/Button';
import { Tooltip } from './components/ui/Tooltip';
import { useLocalStorage } from './hooks/useLocalStorage';

const App: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [darkMode, setDarkMode] = useLocalStorage<boolean>('lumitools_theme', true);
  const location = useLocation();

  // Handle Theme
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // Close sidebar on route change
  useEffect(() => {
    setSidebarOpen(false);
  }, [location]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-bg text-slate-900 dark:text-gray-100 flex transition-colors duration-300">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      <main className="flex-1 min-w-0 flex flex-col min-h-screen">
        {/* Mobile Header */}
        <header className="lg:hidden h-16 border-b border-zinc-200 dark:border-dark-border flex items-center justify-between px-4 bg-white dark:bg-dark-card sticky top-0 z-30">
          <Tooltip content="Open menu">
            <button 
              onClick={() => setSidebarOpen(true)} 
              className="p-2 -ml-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors focus:outline-none focus:ring-2 focus:ring-brand-500"
              aria-label="Open navigation menu"
            >
              <Menu className="w-6 h-6" />
            </button>
          </Tooltip>
          <span className="font-bold text-lg">Lumitools</span>
          <Tooltip content={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}>
            <button 
              onClick={() => setDarkMode(!darkMode)} 
              className="p-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors focus:outline-none focus:ring-2 focus:ring-brand-500"
              aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
          </Tooltip>
        </header>

        {/* Desktop Header Actions */}
        <div className="hidden lg:flex absolute top-6 right-8 z-20 gap-4">
          <Tooltip content={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setDarkMode(!darkMode)} 
              className="rounded-full w-10 h-10 p-0 border border-zinc-200 dark:border-zinc-700 focus:outline-none focus:ring-2 focus:ring-brand-500"
              aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </Button>
          </Tooltip>
        </div>

        <div className="flex-1 p-4 md:p-8 lg:p-12 max-w-7xl mx-auto w-full">
           <Routes>
             <Route path="/" element={<Home />} />
             <Route path="/category/:cat" element={<Home />} /> 
             <Route path="/tool/:id" element={<ToolView />} />
             <Route path="/about" element={<div className="p-8 prose dark:prose-invert"><h1>About Lumitools</h1><p>Lumitools is a professional suite of online utilities designed for speed, privacy, and ease of use. All processing happens locally in your browser—your data never touches our servers.</p></div>} />
             <Route path="/privacy" element={<div className="p-8 prose dark:prose-invert"><h1>Privacy Policy</h1><p>Your privacy is our priority. Lumitools operates 100% client-side. We do not collect, store, or share any of the content you process using our tools.</p></div>} />
           </Routes>
        </div>

        <footer className="border-t border-zinc-200 dark:border-dark-border py-12 text-center text-sm text-zinc-500 dark:text-zinc-400 bg-white dark:bg-dark-card">
          <p>© {new Date().getFullYear()} Lumitools. Built for Privacy.</p>
        </footer>
      </main>
    </div>
  );
};

export default App;