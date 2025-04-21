import { useState, useEffect } from 'react';
import SearchBar from './components/SearchBar';
import CurrentWeather from './components/CurrentWeather';
import Forecast from './components/Forecast';
import ErrorBoundary from './components/ErrorBoundary';
import useWeather from './hooks/useWeather';

import './styles/App.css';

function App() {
  const [location, setLocation] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const { weather, forecast, isLoading, error } = useWeather(location);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [showIntro, setShowIntro] = useState(true);

  const handleSearch = (query: string) => {
    if (query.trim()) {
      setLocation(query);
      setSearchQuery('');
      setShowIntro(false);
    }
  };

  useEffect(() => {
    if (weather) {
      const currentHour = new Date().getHours();
      const isDaytime = currentHour >= 6 && currentHour < 18;
      
      if (!isDaytime || ['Thunderstorm', 'Rain', 'Drizzle'].includes(weather.condition.main)) {
        setTheme('dark');
      } else {
        setTheme('light');
      }
    }
  }, [weather]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowIntro(false);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className={`app ${theme}`}>
      {showIntro && (
        <div className="intro-animation">
          <div className="meteor-shower">
            {[...Array(15)].map((_, i) => (
              <div key={i} className="meteor" style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 50}%`,
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${1 + Math.random() * 3}s`
              }} />
            ))}
          </div>
          <h1 className="intro-title">Meteora</h1>
          <p className="intro-subtitle">Atmospheric Insights</p>
        </div>
      )}
      
      <div className={`meteora-container ${showIntro ? 'hidden' : ''}`}>
        <header className="app-header">
          <div className="header-content">
            <h1 className="app-title">
              <span className="title-gradient">Meteora</span>
              <span className="weather-emoji">
                {weather ? (
                  <WeatherEmoji condition={weather.condition.main} />
                ) : '🌎'}
              </span>
            </h1>
            <div 
              className="theme-toggle" 
              onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
              aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
            >
              <div className="toggle-circle"></div>
            </div>
          </div>
        </header>

        <ErrorBoundary>
          <main className="app-main">
            <SearchBar 
              value={searchQuery} 
              onChange={(e) => setSearchQuery(e.target.value)}
              onSearch={handleSearch}
            />
            
            {isLoading && (
              <div className="loading-container">
                <div className="loading-spinner">
                  <div className="spinner-particle"></div>
                  <div className="spinner-particle"></div>
                  <div className="spinner-particle"></div>
                </div>
                <p>Scanning the atmosphere...</p>
              </div>
            )}

            {error && (
              <div className="error-container">
                <div className="error-icon">⚠️</div>
                <p className="error-message">{error}</p>
                <button 
                  className="error-retry" 
                  onClick={() => setLocation('')}
                >
                  Try Again
                </button>
              </div>
            )}

            {weather && !isLoading && (
              <div className="weather-content">
                <CurrentWeather weather={weather} />
                {forecast && <Forecast forecast={forecast} />}
              </div>
            )}

            {!location && !isLoading && !error && (
              <div className="welcome-screen">
                <div className="welcome-illustration">
                  <div className="planet"></div>
                  <div className="ring"></div>
                  <div className="stars">
                    {[...Array(20)].map((_, i) => (
                      <div key={i} className="star" style={{
                        top: `${Math.random() * 100}%`,
                        left: `${Math.random() * 100}%`,
                        animationDelay: `${Math.random() * 2}s`
                      }} />
                    ))}
                  </div>
                </div>
                <h2>Welcome to Meteora</h2>
                <p>Discover weather patterns across the globe</p>
                <div className="welcome-hint">
                  <span>↑</span>
                  <p>Search for a location to begin</p>
                </div>
              </div>
            )}
          </main>
        </ErrorBoundary>

        <footer className="app-footer">
          <p>© {new Date().getFullYear()} Meteora Weather</p>
          <div className="footer-links">
            <a href="#" className="footer-link">Privacy</a>
            <a href="#" className="footer-link">Terms</a>
            <a href="#" className="footer-link">API</a>
          </div>
        </footer>
      </div>
    </div>
  );
}

const WeatherEmoji = ({ condition }: { condition: string }) => {
  const emojiMap: Record<string, string> = {
    Thunderstorm: '⛈️',
    Drizzle: '🌧️',
    Rain: '🌧️',
    Snow: '❄️',
    Clear: '☀️',
    Clouds: '☁️',
    Mist: '🌫️',
    Smoke: '💨',
    Haze: '🌫️',
    Dust: '💨',
    Fog: '🌫️',
    Sand: '💨',
    Ash: '🌋',
    Squall: '💨',
    Tornado: '🌪️'
  };
  
  return <span>{emojiMap[condition] || '🌎'}</span>;
};

export default App;