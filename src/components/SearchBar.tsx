import { useState, useEffect, FormEvent, ChangeEvent } from 'react';
import '../styles/SearchBar.css';

interface SearchBarProps {
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onSearch: (query: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ value, onChange, onSearch }) => {
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  
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
    onSearch(suggestion);
    saveSearch(suggestion);
    setShowSuggestions(false);
  };
  
  const popularCities = [
    { name: 'New York', emoji: '🏙️' },
    { name: 'London', emoji: '🇬🇧' },
    { name: 'Tokyo', emoji: '🗼' },
    { name: 'Paris', emoji: '🇫🇷' },
    { name: 'Sydney', emoji: '🇦🇺' }
  ];
  
  return (
    <div className="search-container">
      <form className={`search-form ${isFocused ? 'focused' : ''}`} onSubmit={handleSubmit}>
        <div className="search-input-wrapper">
          <input
            type="text"
            className="search-input"
            placeholder="Search for a city or location..."
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
            aria-label="Search for a location"
          />
          <button 
            type="submit" 
            className="search-button"
            aria-label="Search"
          >
            <svg className="search-icon" viewBox="0 0 24 24">
              <path d="M15.5 14h-.79l-.28-.27a6.5 6.5 0 0 0 1.48-5.34c-.47-2.78-2.79-5-5.59-5.34a6.505 6.505 0 0 0-7.27 7.27c.34 2.8 2.56 5.12 5.34 5.59a6.5 6.5 0 0 0 5.34-1.48l.27.28v.79l4.25 4.25c.41.41 1.08.41 1.49 0 .41-.41.41-1.08 0-1.49L15.5 14zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
            </svg>
          </button>
        </div>
        
        {showSuggestions && (
          <div className="search-suggestions">
            {value && recentSearches.filter(s => 
              s.toLowerCase().includes(value.toLowerCase())).length > 0 && (
              <div className="suggestion-section">
                <h4 className="suggestion-title">Recent Searches</h4>
                {recentSearches
                  .filter(s => s.toLowerCase().includes(value.toLowerCase()))
                  .map((search, index) => (
                    <button
                      key={`recent-${index}`}
                      className="suggestion-item"
                      onClick={() => handleSuggestionClick(search)}
                      type="button"
                    >
                      <span className="suggestion-icon">🕒</span> 
                      <span className="suggestion-text">{search}</span>
                    </button>
                  ))}
              </div>
            )}
            
            {(!value || value.length < 2) && (
              <div className="suggestion-section">
                <h4 className="suggestion-title">Popular Cities</h4>
                {popularCities.map((city, index) => (
                  <button
                    key={`popular-${index}`}
                    className="suggestion-item"
                    onClick={() => handleSuggestionClick(city.name)}
                    type="button"
                  >
                    <span className="suggestion-icon">{city.emoji}</span> 
                    <span className="suggestion-text">{city.name}</span>
                  </button>
                ))}
              </div>
            )}
            
            {value && value.length >= 2 && (
              <button
                className="suggestion-item direct-search"
                onClick={() => handleSuggestionClick(value)}
                type="button"
              >
                <span className="suggestion-icon">🔍</span>
                <span className="suggestion-text">Search for "{value}"</span>
              </button>
            )}
          </div>
        )}
      </form>
      
      {recentSearches.length > 0 && (
        <div className="quick-access">
          <span className="quick-access-label">Quick access:</span>
          <div className="quick-access-buttons">
            {recentSearches.slice(0, 3).map((search, index) => (
              <button
                key={`quick-${index}`}
                className="quick-access-button"
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