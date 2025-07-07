import { useState, useEffect, FormEvent, ChangeEvent, useRef, KeyboardEvent } from 'react';
import '../styles/SearchBar.css';
import { useTranslation } from 'react-i18next';

interface SearchBarProps {
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onSearch: (query: string) => void;
}

type Suggestion = {
  name: string;
  lat: number;
  lon: number;
  country?: string;
  state?: string;
};

const SearchBar: React.FC<SearchBarProps> = ({ value, onChange, onSearch }) => {
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const { t } = useTranslation();
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);
  
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

  const fetchSuggestions = async (query: string) => {
    if (!query) {
      setSuggestions([]);
      setIsLoadingSuggestions(false);
      return;
    }
    setIsLoadingSuggestions(true);
    try {
      const res = await fetch(`https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(query)}&limit=5&appid=${import.meta.env.VITE_WEATHER_API_KEY}`);
      if (res.ok) {
        const data: Suggestion[] = await res.json();
        setSuggestions(data);
      }
    } catch (e) {
      setSuggestions([]);
    } finally {
      setIsLoadingSuggestions(false);
    }
  };

  const handleInput = (e: ChangeEvent<HTMLInputElement>) => {
    onChange(e);
    fetchSuggestions(e.target.value);
    setShowSuggestions(true);
    setHighlightedIndex(-1);
  };

  const handleSelect = (suggestion: Suggestion) => {
    onSearch(suggestion.name + (suggestion.country ? ', ' + suggestion.country : ''));
    setShowSuggestions(false);
    setSuggestions([]);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (!showSuggestions || suggestions.length === 0) return;
    if (e.key === 'ArrowDown') {
      setHighlightedIndex((prev) => (prev + 1) % suggestions.length);
    } else if (e.key === 'ArrowUp') {
      setHighlightedIndex((prev) => (prev - 1 + suggestions.length) % suggestions.length);
    } else if (e.key === 'Enter' && highlightedIndex >= 0) {
      handleSelect(suggestions[highlightedIndex]);
    } else if (e.key === 'Escape') {
      setShowSuggestions(false);
    }
  };

  return (
    <div className="search-container-glass">
      <form className={`search-form-glass${isFocused ? ' focused' : ''}`} onSubmit={handleSubmit} autoComplete="off">
        <div className="search-input-glass-wrapper">
          <input
            ref={inputRef}
            type="text"
            className="search-input-glass"
            placeholder={t('Search for a city or location...')}
            value={value}
            onChange={handleInput}
            onFocus={() => {
              setIsFocused(true);
              setShowSuggestions(true);
            }}
            onBlur={() => setTimeout(() => {
              setIsFocused(false);
              setShowSuggestions(false);
            }, 200)}
            onKeyDown={handleKeyDown}
            aria-label={t('Search for a location')}
          />
          {value && (
            <button
              type="button"
              className="clear-input-glass"
              aria-label={t('Clear search')}
              onClick={() => {
                onChange({ target: { value: '' } } as any);
                inputRef.current?.focus();
              }}
            >
              ×
            </button>
          )}
          <button 
            type="submit" 
            className="search-button-glass"
            aria-label={t('Search')}
          >
            {isLoadingSuggestions ? (
              <span className="loader-spinner w-6 h-6 border-2 border-blue-200 border-t-blue-600 rounded-full animate-spin inline-block"></span>
            ) : (
              <svg className="search-icon w-6 h-6 fill-white" viewBox="0 0 24 24">
                <path d="M15.5 14h-.79l-.28-.27a6.5 6.5 0 0 0 1.48-5.34c-.47-2.78-2.79-5-5.59-5.34a6.505 6.505 0 0 0-7.27 7.27c.34 2.8 2.56 5.12 5.34 5.59a6.5 6.5 0 0 0 5.34-1.48l.27.28v.79l4.25 4.25c.41.41 1.08.41 1.49 0 .41-.41.41-1.08 0-1.49L15.5 14zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
              </svg>
            )}
          </button>
        </div>
        <div className={`search-suggestions-anim-wrapper${showSuggestions && suggestions.length > 0 ? ' open' : ''}`} style={{ position: 'relative' }}>
          <div className={`search-suggestions-glass absolute top-full left-0 right-0 mt-2 z-50 max-h-80 overflow-y-auto transition-all duration-200${showSuggestions && suggestions.length > 0 ? ' opacity-100 translate-y-0' : ' opacity-0 -translate-y-2 pointer-events-none'}`}
            role="listbox"
            aria-label={t('Suggestions')}
          >
            <div className="suggestion-section p-2 border-b border-gray-100 dark:border-gray-700">
              <h4 className="suggestion-title px-4 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">{t('Recent Searches')}</h4>
              {suggestions.map((s, idx) => (
                <button
                  key={s.lat + '-' + s.lon}
                  className={`suggestion-item-glass${idx === highlightedIndex ? ' bg-blue-100 dark:bg-blue-900 border-l-4 border-blue-500' : ''}`}
                  onClick={() => handleSelect(s)}
                  onMouseEnter={() => setHighlightedIndex(idx)}
                  onMouseDown={(e) => {
                    e.preventDefault();
                    handleSelect(s);
                  }}
                  type="button"
                  role="option"
                  aria-selected={idx === highlightedIndex}
                  tabIndex={0}
                >
                  <span className="suggestion-icon mr-3 text-lg opacity-70">🕒</span> 
                  <span className="suggestion-text text-gray-700 dark:text-gray-300 font-medium">{s.name}{s.state ? ', ' + s.state : ''}{s.country ? ', ' + s.country : ''}</span>
                </button>
              ))}
            </div>
            {value && value.length >= 2 && (
              <button
                className="suggestion-item-glass direct-search"
                onClick={() => handleSuggestionClick(value)}
                type="button"
              >
                <span className="suggestion-icon mr-3 text-lg opacity-70">🔍</span>
                <span className="suggestion-text text-blue-600 dark:text-blue-400 font-semibold">{t('Search for "{{value}}"', { value })}</span>
              </button>
            )}
          </div>
        </div>
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