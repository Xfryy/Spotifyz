// D:\Spotifyz\frontend\src\pages\search\components\SearchHeader.tsx
import { useRef, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Search, Sparkles } from "lucide-react";

interface SearchHeaderProps {
  query: string;
  setQuery: (query: string) => void;
  hasResults: boolean;
  isEnchanted: boolean;
}

const SearchHeader = ({ query, setQuery, hasResults, isEnchanted }: SearchHeaderProps) => {
  const searchInputRef = useRef<HTMLInputElement>(null);
  
  // Focus search input when component mounts
  useEffect(() => {
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, []);

  return (
    <div 
      className={`relative flex flex-col items-center justify-center overflow-hidden transition-all duration-500 ${
        hasResults ? 'h-24' : 'h-64'
      }`}
    >
      {/* Enchanted Background with magical aura */}
      <div className="absolute inset-0 w-full h-full rounded-lg overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/30 to-purple-900/30 rounded-lg"></div>
        <img 
          src="/mikubeam.gif" 
          alt="Miku Beam" 
          className="w-full h-full object-cover rounded-lg opacity-90"
        />
        {/* Magical overlay with glow effect */}
        <div className="absolute inset-0 bg-black/20 rounded-lg enchanted-overlay"></div>
      </div>
      
      {/* Search title with magical animation */}
      <h1 
        className={`text-4xl sm:text-5xl font-bold mb-8 text-white relative z-10 text-center enchanted-text transition-opacity duration-300 ${
          hasResults ? 'opacity-0 absolute' : 'opacity-100'
        } ${isEnchanted ? 'enchanted-active' : ''}`}
      >
        Search
      </h1>
      
      {/* Enhanced search bar with magical styling */}
      <div 
        className={`relative z-10 w-full max-w-2xl px-5 transition-all duration-300 ${
          hasResults ? 'transform -translate-y-7' : 'transform-none'
        }`}
      >
        <div className={`rounded-full overflow-hidden group relative ${isEnchanted ? 'enchanted-searchbar' : ''}`}>
          {/* Magical search input with animated glow */}
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/30 via-purple-500/30 to-pink-500/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500 enchanted-glow"></div>
          
          <div className="relative z-10 flex items-center">
            <Search 
              className="absolute left-4 top-1/2 transform -translate-y-1/2 text-indigo-300 group-hover:text-white transition-colors duration-300" 
              size={20} 
            />
            <Input
              ref={searchInputRef}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="What songs you want to search?"
              className={`pl-12 pr-4 py-3 ${hasResults ? 'h-10' : 'h-14'} rounded-full text-white bg-zinc-800/80 border-none focus-visible:ring-2 focus-visible:ring-indigo-500/70 text-base focus:bg-zinc-700/80 transition-all duration-300 shadow-lg enchanted-input`}
            />
            
            {query && (
              <button 
                onClick={() => setQuery('')}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-zinc-400 hover:text-white transition-colors duration-200 bg-zinc-600/60 hover:bg-indigo-600/60 rounded-full p-1"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            )}
            
            {/* Magical sparkles indicator */}
            <Sparkles 
              className={`absolute right-12 top-1/2 transform -translate-y-1/2 text-yellow-400 transition-opacity duration-300 ${query ? 'opacity-100' : 'opacity-0'}`} 
              size={18} 
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchHeader;