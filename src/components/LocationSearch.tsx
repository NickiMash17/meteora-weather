import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, MapPin, Loader2, Clock, Globe } from 'lucide-react';

interface LocationSearchProps {
  value: string;
  onChange: (value: string) => void;
  onSearch: (query: string) => void;
  isLoading?: boolean;
}

const LocationSearch: React.FC<LocationSearchProps> = ({
  value,
  onChange,
  onSearch,
  isLoading = false
}) => {
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  // Popular cities for suggestions
  const popularCities = [
    'New York', 'London', 'Tokyo', 'Paris', 'Sydney', 'Mumbai',
    'Berlin', 'Rome', 'Madrid', 'Amsterdam', 'Vienna', 'Prague',
    'Budapest', 'Warsaw', 'Stockholm', 'Oslo', 'Copenhagen', 'Helsinki',
    'Toronto', 'Vancouver', 'Montreal', 'Chicago', 'Los Angeles', 'Miami',
    'San Francisco', 'Seattle', 'Boston', 'Washington DC', 'Atlanta', 'Denver'
  ];

  // Load recent searches from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('recent-searches');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setRecentSearches(parsed.slice(0, 5));
      } catch (error) {
        console.error('Error loading recent searches:', error);
      }
    }
  }, []);

  // Save search to recent searches
  const saveToRecent = useCallback((query: string) => {
    const trimmed = query.trim();
    if (!trimmed) return;
    
    const updated = [trimmed, ...recentSearches.filter(s => s !== trimmed)].slice(0, 5);
    setRecentSearches(updated);
    localStorage.setItem('recent-searches', JSON.stringify(updated));
  }, [recentSearches]);

  // Generate suggestions based on input
  useEffect(() => {
    if (value.trim()) {
      const filtered = popularCities.filter(city =>
        city.toLowerCase().includes(value.toLowerCase())
      );
      const recentFiltered = recentSearches.filter(search =>
        search.toLowerCase().includes(value.toLowerCase()) && 
        !filtered.includes(search)
      );
      
      setSuggestions([...recentFiltered, ...filtered].slice(0, 8));
      setShowSuggestions(true);
      setSelectedIndex(-1);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
      setSelectedIndex(-1);
    }
  }, [value, recentSearches]);

  // Handle form submission
  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (value.trim()) {
      saveToRecent(value);
      onSearch(value);
      setShowSuggestions(false);
      setSelectedIndex(-1);
    }
  }, [value, onSearch, saveToRecent]);

  // Handle suggestion click
  const handleSuggestionClick = useCallback((suggestion: string) => {
    onChange(suggestion);
    saveToRecent(suggestion);
    onSearch(suggestion);
    setShowSuggestions(false);
    setSelectedIndex(-1);
    inputRef.current?.blur();
  }, [onChange, onSearch, saveToRecent]);

  // Handle keyboard navigation
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (!showSuggestions) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev < suggestions.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => prev > 0 ? prev - 1 : -1);
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0 && suggestions[selectedIndex]) {
          handleSuggestionClick(suggestions[selectedIndex]);
        } else if (value.trim()) {
          handleSubmit(e);
        }
        break;
      case 'Escape':
        setShowSuggestions(false);
        setSelectedIndex(-1);
        inputRef.current?.blur();
        break;
    }
  }, [showSuggestions, selectedIndex, suggestions, value, handleSuggestionClick, handleSubmit]);

  // Handle input focus
  const handleFocus = useCallback(() => {
    setShowSuggestions(true);
  }, []);

  // Handle input blur with delay to allow for clicks
  const handleBlur = useCallback(() => {
    setTimeout(() => {
      setShowSuggestions(false);
      setSelectedIndex(-1);
    }, 200);
  }, []);

  // Clear recent searches
  const clearRecentSearches = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    setRecentSearches([]);
    localStorage.removeItem('recent-searches');
  }, []);

  return (
    <div className="relative" ref={suggestionsRef}>
      <form onSubmit={handleSubmit}>
        <div className="relative">
          <input
            ref={inputRef}
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onFocus={handleFocus}
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
            placeholder="Search for a city..."
            className="w-full px-4 py-3 pl-12 pr-12 bg-white/20 backdrop-blur-sm border border-white/30 rounded-full text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent transition-all"
            aria-label="Search for a city or location"
            aria-expanded={showSuggestions}
            aria-haspopup="listbox"
            role="combobox"
            aria-autocomplete="list"
          />
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/70" />
          
          {isLoading ? (
            <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
              <Loader2 className="w-5 h-5 text-white/70 animate-spin" />
            </div>
          ) : (
            <button
              type="submit"
              className="absolute right-2 top-1/2 transform -translate-y-1/2 px-4 py-1.5 bg-white/20 backdrop-blur-sm text-white rounded-full hover:bg-white/30 transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={!value.trim()}
              aria-label="Search"
            >
              Search
            </button>
          )}
        </div>
      </form>

      {/* Enhanced Suggestions Dropdown */}
      <AnimatePresence>
        {showSuggestions && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            className="absolute top-full left-0 right-0 mt-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl overflow-hidden z-50 max-h-80 overflow-y-auto"
            role="listbox"
          >
            {/* Recent Searches */}
            {!value.trim() && recentSearches.length > 0 && (
              <div className="p-3 border-b border-white/10">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <Clock className="w-4 h-4 text-white/60" />
                    <span className="text-white/80 text-sm font-medium">Recent Searches</span>
                  </div>
                  <button
                    onClick={clearRecentSearches}
                    className="text-white/40 hover:text-white/60 text-xs transition-colors"
                    title="Clear recent searches"
                  >
                    Clear
                  </button>
                </div>
                <div className="space-y-1">
                  {recentSearches.map((search, index) => (
                    <motion.button
                      key={`recent-${search}`}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      onClick={() => handleSuggestionClick(search)}
                      className="w-full px-3 py-2 text-left text-white hover:bg-white/20 transition-colors flex items-center space-x-3 rounded-lg"
                      role="option"
                    >
                      <Clock className="w-4 h-4 text-white/60" />
                      <span>{search}</span>
                    </motion.button>
                  ))}
                </div>
              </div>
            )}

            {/* Popular Cities */}
            {!value.trim() && (
              <div className="p-3 border-b border-white/10">
                <div className="flex items-center space-x-2 mb-2">
                  <Globe className="w-4 h-4 text-white/60" />
                  <span className="text-white/80 text-sm font-medium">Popular Cities</span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {popularCities.slice(0, 8).map((city, index) => (
                    <motion.button
                      key={`popular-${city}`}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.05 }}
                      onClick={() => handleSuggestionClick(city)}
                      className="px-3 py-2 text-left text-white hover:bg-white/20 transition-colors flex items-center space-x-2 rounded-lg text-sm"
                      role="option"
                    >
                      <MapPin className="w-3 h-3 text-white/60" />
                      <span>{city}</span>
                    </motion.button>
                  ))}
                </div>
              </div>
            )}

            {/* Search Suggestions */}
            {value.trim() && suggestions.length > 0 && (
              <div className="p-3">
                <div className="flex items-center space-x-2 mb-2">
                  <Search className="w-4 h-4 text-white/60" />
                  <span className="text-white/80 text-sm font-medium">Suggestions</span>
                </div>
                <div className="space-y-1">
                  {suggestions.map((suggestion, index) => (
                    <motion.button
                      key={suggestion}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      onClick={() => handleSuggestionClick(suggestion)}
                      className={`w-full px-3 py-2 text-left text-white transition-colors flex items-center space-x-3 rounded-lg ${
                        index === selectedIndex ? 'bg-white/30' : 'hover:bg-white/20'
                      }`}
                      role="option"
                      aria-selected={index === selectedIndex}
                    >
                      <MapPin className="w-4 h-4 text-white/70" />
                      <span>{suggestion}</span>
                    </motion.button>
                  ))}
                </div>
              </div>
            )}

            {/* No results */}
            {value.trim() && suggestions.length === 0 && (
              <div className="p-4 text-center">
                <p className="text-white/60 text-sm">No cities found matching "{value}"</p>
                <p className="text-white/40 text-xs mt-1">Try a different search term</p>
              </div>
            )}

            {/* Keyboard navigation hint */}
            <div className="p-2 bg-white/5 border-t border-white/10">
              <p className="text-white/40 text-xs text-center">
                Use ↑↓ to navigate, Enter to select, Esc to close
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default LocationSearch; 