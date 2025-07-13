import { useState, useEffect, FormEvent, ChangeEvent, useRef, KeyboardEvent } from 'react';
import '../styles/SearchBar.css';
import { useTranslation } from 'react-i18next';
import { Search, MapPin, Clock, Globe } from 'lucide-react';

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
    <div className="search-container-modern">
      <form className="search-form-modern" onSubmit={handleSubmit} autoComplete="off">
        <div className="search-input-wrapper">
          <div className="search-icon-wrapper">
            <Search className="search-icon" size={20} />
          </div>
          <input
            ref={inputRef}
            type="text"
            className="search-input-modern"
            placeholder={t('Search city or location...')}
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
          <button 
            type="submit" 
            className="search-button-modern"
            aria-label={t('Search')}
          >
            {isLoadingSuggestions ? (
              <div className="loading-spinner"></div>
            ) : (
              <Search size={18} />
            )}
          </button>
        </div>
        
        {/* Modern Suggestions Dropdown */}
        {showSuggestions && (suggestions.length > 0 || value.length >= 2) && (
          <div className="suggestions-container-modern">
            <div className="suggestions-content">
              {/* Recent Searches */}
              {recentSearches.length > 0 && (
                <div className="suggestion-section">
                  <div className="suggestion-header">
                    <Clock size={16} />
                    <span>{t('Recent Searches')}</span>
                  </div>
                  <div className="suggestion-list">
                    {recentSearches.slice(0, 3).map((search, index) => (
                      <button
                        key={`recent-${index}`}
                        className="suggestion-item-modern"
                        onClick={() => handleSuggestionClick(search)}
                        type="button"
                      >
                        <MapPin size={16} />
                        <span>{search}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
              
              {/* API Suggestions */}
              {suggestions.length > 0 && (
                <div className="suggestion-section">
                  <div className="suggestion-header">
                    <Globe size={16} />
                    <span>{t('Locations')}</span>
                  </div>
                  <div className="suggestion-list">
                    {suggestions.map((suggestion, index) => (
                      <button
                        key={`suggestion-${index}`}
                        className={`suggestion-item-modern ${index === highlightedIndex ? 'highlighted' : ''}`}
                        onClick={() => handleSelect(suggestion)}
                        onMouseEnter={() => setHighlightedIndex(index)}
                        type="button"
                      >
                        <MapPin size={16} />
                        <div className="suggestion-text">
                          <span className="suggestion-name">{suggestion.name}</span>
                          {(suggestion.state || suggestion.country) && (
                            <span className="suggestion-details">
                              {suggestion.state && `${suggestion.state}, `}{suggestion.country}
                            </span>
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Direct Search Option */}
              {value && value.length >= 2 && (
                <div className="suggestion-section">
                  <button
                    className="suggestion-item-modern direct-search"
                    onClick={() => handleSuggestionClick(value)}
                    type="button"
                  >
                    <Search size={16} />
                    <span>{t('Search for "{{value}}"', { value })}</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </form>
      
      {/* Quick Access Tags */}
      {recentSearches.length > 0 && !isFocused && (
        <div className="quick-access-modern">
          <div className="quick-access-tags">
            {recentSearches.slice(0, 3).map((search, index) => (
              <button
                key={`quick-${index}`}
                className="quick-access-tag"
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