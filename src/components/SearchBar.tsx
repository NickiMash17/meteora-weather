import { useState, useEffect, FormEvent, ChangeEvent } from 'react';
import '../styles/SearchBar.css';
import { useTranslation } from 'react-i18next';

interface SearchBarProps {
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onSearch: (query: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ value, onChange, onSearch }) => {
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const { t } = useTranslation();
  
  useEffect(() => {
    const savedSearches = localStorage.getItem('recentSearches');
    if (savedSearches) {
      setRecentSearches(JSON.parse(savedSearches).slice(0, 5));
    }
  }, []);
  
  const saveSearch = (query: string) => {
    const updatedSearches = [query, ...recentSearches.filter(s => s !== query)].slice(0, 5);
    setRecentSearches(updatedSearches);
    localStorage.setItem('recentSearches', JSON.stringify(updatedSearches));
  };
  
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (value.trim()) {
      onSearch(value);
      saveSearch(value);
    }
    setShowSuggestions(false);
  };
  
  const handleSuggestionClick = (suggestion: string) => {
    saveSearch(suggestion);
    onSearch(suggestion);
    setShowSuggestions(false);
  };
  
  return (
    <div className="search-container w-full max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
      <form className={`search-form ${isFocused ? 'focused' : ''} w-full`} onSubmit={handleSubmit}>
        <div className="search-input-wrapper relative flex flex-col sm:flex-row items-stretch rounded-2xl overflow-hidden shadow-lg transition-all duration-300 hover:shadow-xl">
          <input
            type="text"
            className="search-input flex-1 px-4 py-3 sm:px-6 sm:py-4 text-base sm:text-lg bg-white/95 dark:bg-gray-800/95 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all duration-300"
            placeholder={t('Search for a city or location...')}
            value={value}
            onChange={onChange}
            onFocus={() => {
              setIsFocused(true);
              setShowSuggestions(true);
            }}
            onBlur={() => setTimeout(() => {
              setIsFocused(false);
              setShowSuggestions(false);
            }, 200)}
            aria-label={t('Search for a location')}
          />
          <button 
            type="submit" 
            className="search-button w-full sm:w-16 h-12 sm:h-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 flex items-center justify-center transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-base sm:text-lg"
            aria-label={t('Search')}
          >
            <svg className="search-icon w-6 h-6 fill-white" viewBox="0 0 24 24">
              <path d="M15.5 14h-.79l-.28-.27a6.5 6.5 0 0 0 1.48-5.34c-.47-2.78-2.79-5-5.59-5.34a6.505 6.505 0 0 0-7.27 7.27c.34 2.8 2.56 5.12 5.34 5.59a6.5 6.5 0 0 0 5.34-1.48l.27.28v.79l4.25 4.25c.41.41 1.08.41 1.49 0 .41-.41.41-1.08 0-1.49L15.5 14zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
            </svg>
          </button>
        </div>
        
        {showSuggestions && (
          <div className="search-suggestions absolute top-full left-0 right-0 mt-2 bg-white/95 dark:bg-gray-800/95 backdrop-blur-md rounded-xl shadow-2xl border border-gray-200/50 dark:border-gray-700/50 z-50 max-h-80 overflow-y-auto">
            {value && recentSearches.filter(s => 
              s.toLowerCase().includes(value.toLowerCase())).length > 0 && (
              <div className="suggestion-section p-2 border-b border-gray-100 dark:border-gray-700">
                <h4 className="suggestion-title px-4 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">{t('Recent Searches')}</h4>
                {recentSearches
                  .filter(s => s.toLowerCase().includes(value.toLowerCase()))
                  .map((search, index) => (
                    <button
                      key={`recent-${index}`}
                      className="suggestion-item w-full flex items-center px-4 py-3 text-left hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-200 rounded-lg mx-2"
                      onClick={() => handleSuggestionClick(search)}
                      type="button"
                    >
                      <span className="suggestion-icon mr-3 text-lg opacity-70">🕒</span> 
                      <span className="suggestion-text text-gray-700 dark:text-gray-300 font-medium">{search}</span>
                    </button>
                  ))}
              </div>
            )}
            
            {value && value.length >= 2 && (
              <button
                className="suggestion-item direct-search w-full flex items-center px-4 py-3 text-left hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors duration-200 rounded-lg mx-2 mb-2"
                onClick={() => handleSuggestionClick(value)}
                type="button"
              >
                <span className="suggestion-icon mr-3 text-lg opacity-70">🔍</span>
                <span className="suggestion-text text-blue-600 dark:text-blue-400 font-semibold">{t('Search for "{{value}}"', { value })}</span>
              </button>
            )}
          </div>
        )}
      </form>
      
      {recentSearches.length > 0 && (
        <div className="quick-access flex items-center gap-3 mt-4 flex-wrap">
          <span className="quick-access-label text-sm text-gray-500 dark:text-gray-400 font-medium">{t('Quick access:')}</span>
          <div className="quick-access-buttons flex gap-2 flex-wrap">
            {recentSearches.slice(0, 3).map((search, index) => (
              <button
                key={`quick-${index}`}
                className="quick-access-button px-3 py-1.5 text-sm bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200 font-medium"
                onClick={() => onSearch(search)}
                type="button"
              >
                {search}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchBar;