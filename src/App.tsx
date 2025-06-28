import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  Sun, 
  Moon, 
  Cloud, 
  CloudRain, 
  CloudLightning, 
  Snowflake,
  Wind,
  Thermometer,
  Droplets,
  Eye,
  Share2,
  Settings,
  BarChart3,
  Calendar,
  AlertTriangle,
  Sparkles,
  Zap,
  Globe,
  Menu,
  X,
  RefreshCw,
  Info,
  Volume2,
  VolumeX
} from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import useWeather from './hooks/useWeather';
import WeatherDashboard from './components/WeatherDashboard';
import WeatherForecast from './components/WeatherForecast';
import WeatherAnalytics from './components/WeatherAnalytics';
import WeatherAlerts from './components/WeatherAlerts';
import LocationSearch from './components/LocationSearch';
import WeatherMap from './components/WeatherMap';
import LoadingScreen from './components/LoadingScreen';
import WelcomeScreen from './components/WelcomeScreen';
import WeatherInsights from './components/WeatherInsights';
import WeatherHero from './components/WeatherHero';
import ParticleSystem from './components/ParticleSystem';
import ImageSlider from './components/ImageSlider';
import AuroraParallaxStars from './components/AuroraParallaxStars';
import useWeatherSound from './hooks/useWeatherSound';

type TabType = 'dashboard' | 'forecast' | 'analytics' | 'map' | 'alerts' | 'gallery' | 'insights';

function App() {
  const [location, setLocation] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [showWelcome, setShowWelcome] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [manualThemeOverride, setManualThemeOverride] = useState(false);
  const [lastSearch, setLastSearch] = useState('');
  const [errorRetryCount, setErrorRetryCount] = useState(0);
  
  // Enhanced mobile responsiveness state
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);
  const [viewportHeight, setViewportHeight] = useState(window.innerHeight);
  
  const { weather, forecast, error } = useWeather(location);
  const weatherCondition = weather?.condition?.main || 'default';
  const { isPlaying: isSoundOn, toggle: toggleSound } = useWeatherSound(weatherCondition);

  // Enhanced device detection and viewport management
  useEffect(() => {
    const checkDevice = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      setIsMobile(width < 768);
      setIsTablet(width >= 768 && width < 1024);
      setViewportHeight(height);
    };

    checkDevice();
    window.addEventListener('resize', checkDevice);
    window.addEventListener('orientationchange', checkDevice);
    
    return () => {
      window.removeEventListener('resize', checkDevice);
      window.removeEventListener('orientationchange', checkDevice);
    };
  }, []);

  // Set viewport height for mobile browsers
  useEffect(() => {
    const setVH = () => {
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty('--vh', `${vh}px`);
    };
    
    setVH();
    window.addEventListener('resize', setVH);
    window.addEventListener('orientationchange', setVH);
    
    return () => {
      window.removeEventListener('resize', setVH);
      window.removeEventListener('orientationchange', setVH);
    };
  }, []);

  // Load theme from localStorage on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('meteora-theme') as 'light' | 'dark';
    if (savedTheme) {
      setTheme(savedTheme);
      setManualThemeOverride(true);
    }
  }, []);

  // Apply theme to document body
  useEffect(() => {
    document.documentElement.classList.remove('light', 'dark');
    document.documentElement.classList.add(theme);
    localStorage.setItem('meteora-theme', theme);
  }, [theme]);

  // Auto-detect theme based on weather and time (only if not manually overridden)
  useEffect(() => {
    if (weather && !manualThemeOverride) {
      const hour = new Date().getHours();
      const isDaytime = hour >= 6 && hour < 18;
      const isStormy = ['Thunderstorm', 'Rain', 'Drizzle'].includes(weather.condition.main);
      
      if (!isDaytime || isStormy) {
        setTheme('dark');
      } else {
        setTheme('light');
      }
    }
  }, [weather, manualThemeOverride]);

  // Welcome screen timer
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowWelcome(false);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  // Enhanced theme toggle with better UX
  const handleThemeToggle = useCallback(() => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    setManualThemeOverride(true);
    toast.success(`Switched to ${newTheme} mode`, {
      icon: newTheme === 'dark' ? '🌙' : '☀️',
      style: {
        background: newTheme === 'dark' ? '#1f2937' : '#ffffff',
        color: newTheme === 'dark' ? '#ffffff' : '#1f2937',
        border: `1px solid ${newTheme === 'dark' ? '#374151' : '#e5e7eb'}`,
      },
    });
  }, [theme]);

  // Enhanced search handler with better error handling
  const handleSearch = useCallback(async (query: string) => {
    if (!query.trim()) {
      toast.error('Please enter a valid location');
      return;
    }
    
    const trimmedQuery = query.trim();
    if (trimmedQuery === lastSearch && weather) {
      toast.success('Weather data is already up to date!');
      return;
    }
    
    setIsLoading(true);
    setLocation(trimmedQuery);
    setSearchQuery('');
    setShowWelcome(false);
    setLastSearch(trimmedQuery);
    setErrorRetryCount(0);
    setIsMobileMenuOpen(false); // Close mobile menu after search
    
    toast.success(`Searching for weather in ${trimmedQuery}...`);
    
    // Simulate loading delay for better UX
    setTimeout(() => setIsLoading(false), 1000);
  }, [lastSearch, weather]);

  // Retry functionality for errors
  const handleRetry = useCallback(() => {
    if (lastSearch && errorRetryCount < 3) {
      setErrorRetryCount(prev => prev + 1);
      handleSearch(lastSearch);
      toast.success('Retrying...');
    } else {
      setLocation('');
      setLastSearch('');
      setErrorRetryCount(0);
      toast.error('Please try a different location');
    }
  }, [lastSearch, errorRetryCount, handleSearch]);

  // Enhanced share functionality
  const handleShare = useCallback(() => {
    if (weather && navigator.share) {
      navigator.share({
        title: `Weather in ${weather.location}`,
        text: `${weather.temperature.current}°C and ${weather.condition.description} in ${weather.location}`,
        url: window.location.href
      }).catch(() => {
        // Fallback to clipboard
        navigator.clipboard.writeText(
          `🌤️ ${weather.temperature.current}°C and ${weather.condition.description} in ${weather.location}`
        );
        toast.success('Weather info copied to clipboard!');
      });
    } else if (weather) {
      navigator.clipboard.writeText(
        `🌤️ ${weather.temperature.current}°C and ${weather.condition.description} in ${weather.location}`
      );
      toast.success('Weather info copied to clipboard!');
    }
  }, [weather]);

  // Enhanced weather gradient with mobile optimization
  const weatherGradient = useMemo(() => {
    if (!weather) return 'weather-gradient';
    
    const condition = weather.condition.main.toLowerCase();
    const hour = new Date().getHours();
    const isDaytime = hour >= 6 && hour < 18;
    
    // Mobile-optimized gradients (simpler, better performance)
    if (isMobile) {
      if (theme === 'dark' || !isDaytime) {
        if (condition.includes('clear')) return 'night-sunny-gradient';
        if (condition.includes('cloud')) return 'night-cloudy-gradient';
        if (condition.includes('rain') || condition.includes('drizzle')) return 'night-rainy-gradient';
        if (condition.includes('thunderstorm')) return 'night-gradient';
        if (condition.includes('snow')) return 'night-gradient';
        return 'night-gradient';
      }
      
      if (condition.includes('clear')) return 'sunny-gradient';
      if (condition.includes('cloud')) return 'cloudy-gradient';
      if (condition.includes('rain') || condition.includes('drizzle')) return 'rainy-gradient';
      if (condition.includes('thunderstorm')) return 'stormy-gradient';
      if (condition.includes('snow')) return 'snowy-gradient';
      return 'weather-gradient';
    }
    
    // Desktop/tablet enhanced gradients
    if (theme === 'dark' || !isDaytime) {
      if (condition.includes('clear')) return 'night-sunny-gradient';
      if (condition.includes('cloud')) return 'night-cloudy-gradient';
      if (condition.includes('rain') || condition.includes('drizzle')) return 'night-rainy-gradient';
      if (condition.includes('thunderstorm')) return 'night-gradient';
      if (condition.includes('snow')) return 'night-gradient';
      return 'night-gradient';
    }
    
    if (condition.includes('clear')) return 'sunny-gradient';
    if (condition.includes('cloud')) return 'cloudy-gradient';
    if (condition.includes('rain') || condition.includes('drizzle')) return 'rainy-gradient';
    if (condition.includes('thunderstorm')) return 'stormy-gradient';
    if (condition.includes('snow')) return 'snowy-gradient';
    return 'weather-gradient';
  }, [weather, theme, isMobile]);

  // Enhanced tab configuration with mobile optimization
  const tabs = useMemo(() => [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3, mobileLabel: 'Home' },
    { id: 'forecast', label: 'Forecast', icon: Calendar, mobileLabel: 'Forecast' },
    { id: 'analytics', label: 'Analytics', icon: BarChart3, mobileLabel: 'Stats' },
    { id: 'map', label: 'Map', icon: Globe, mobileLabel: 'Map' },
    { id: 'alerts', label: 'Alerts', icon: AlertTriangle, mobileLabel: 'Alerts' },
    { id: 'insights', label: 'Insights', icon: Sparkles, mobileLabel: 'AI' },
    { id: 'gallery', label: 'Gallery', icon: Sparkles, mobileLabel: 'Gallery' }
  ], []);

  if (showWelcome) {
    return <WelcomeScreen onSearch={handleSearch} />;
  }

  return (
    <div className={`app ${theme} theme-transition`} style={{ minHeight: 'calc(var(--vh, 1vh) * 100)' }}>
      {/* Enhanced Mobile-Responsive Background */}
      <div className={`fixed inset-0 ${weatherGradient} transition-all duration-1000 ease-in-out`}>
        {/* Desktop/Tablet Enhanced Background Effects */}
        {!isMobile && (
          <>
            <div className="pro-aurora" />
            <div className="pro-bokeh">
              {[...Array(8)].map((_, i) => (
                <div
                  key={i}
                  className="pro-bokeh-circle"
                  style={{
                    width: `${Math.random() * 60 + 20}px`,
                    height: `${Math.random() * 60 + 20}px`,
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                    animationDelay: `${Math.random() * 12}s`,
                    animationDuration: `${Math.random() * 8 + 8}s`
                  }}
                />
              ))}
            </div>
            <div className="pro-particles">
              {[...Array(12)].map((_, i) => (
                <div
                  key={i}
                  className="pro-particle"
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                    animationDelay: `${Math.random() * 14}s`,
                    animationDuration: `${Math.random() * 6 + 10}s`
                  }}
                />
              ))}
            </div>
          </>
        )}
        
        {/* Mobile-Optimized Background Effects */}
        {isMobile && (
          <>
            <div className="aurora-enhanced opacity-30" />
            <div className="floating-particles">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="particle"
                  style={{
                    left: `${Math.random() * 100}%`,
                    animationDelay: `${Math.random() * 20}s`,
                    animationDuration: `${Math.random() * 10 + 15}s`
                  }}
                />
              ))}
            </div>
          </>
        )}
        
        {/* Aurora and Stars - Performance optimized for mobile */}
        <AuroraParallaxStars />
      </div>

      {/* Enhanced Main Content */}
      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Enhanced Professional Header */}
        <header className="app-header glass-card rounded-b-3xl p-4 sm:p-6 mx-4 sm:mx-6 mt-4 sm:mt-6">
          <div className="header-content">
            <motion.h1 
              className="app-title text-2xl sm:text-3xl lg:text-4xl"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <span className="title-gradient">Meteora</span>
              <span className="weather-emoji ml-2">🌤️</span>
            </motion.h1>

            <div className="header-controls flex items-center gap-2 sm:gap-3">
              {/* Mobile Menu Button */}
              {isMobile && (
                <button
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  className="btn-primary p-3 min-h-[44px] min-w-[44px] flex items-center justify-center"
                  aria-label="Toggle menu"
                >
                  {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                </button>
              )}

              {/* Desktop Controls */}
              {!isMobile && (
                <>
                  <button
                    onClick={toggleSound}
                    className="btn-primary p-3 min-h-[44px] min-w-[44px] flex items-center justify-center"
                    aria-label="Toggle sound"
                  >
                    {isSoundOn ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
                  </button>
                  <button
                    onClick={handleThemeToggle}
                    className="btn-primary p-3 min-h-[44px] min-w-[44px] flex items-center justify-center"
                    aria-label="Toggle theme"
                  >
                    {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                  </button>
                  <button
                    onClick={handleShare}
                    className="btn-primary p-3 min-h-[44px] min-w-[44px] flex items-center justify-center"
                    aria-label="Share weather"
                  >
                    <Share2 className="w-5 h-5" />
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Enhanced Mobile Menu */}
          <AnimatePresence>
            {isMobileMenuOpen && isMobile && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-4 space-y-3"
              >
                <button
                  onClick={toggleSound}
                  className="btn-primary w-full justify-center py-3 min-h-[44px]"
                >
                  {isSoundOn ? <Volume2 className="w-4 h-4 mr-2" /> : <VolumeX className="w-4 h-4 mr-2" />}
                  {isSoundOn ? 'Disable Sound' : 'Enable Sound'}
                </button>
                <button
                  onClick={handleThemeToggle}
                  className="btn-primary w-full justify-center py-3 min-h-[44px]"
                >
                  {theme === 'dark' ? <Sun className="w-4 h-4 mr-2" /> : <Moon className="w-4 h-4 mr-2" />}
                  {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
                </button>
                <button
                  onClick={handleShare}
                  className="btn-primary w-full justify-center py-3 min-h-[44px]"
                >
                  <Share2 className="w-4 h-4 mr-2" />
                  Share Weather
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </header>

        {/* Enhanced Search Bar */}
        <div className="px-4 sm:px-6 py-4">
          <LocationSearch 
            value={searchQuery}
            onChange={setSearchQuery}
            onSearch={handleSearch}
            isLoading={isLoading}
          />
        </div>

        {/* Enhanced Main Container */}
        <main className="meteora-container flex-1 px-4 sm:px-6 pb-4">
          {/* Enhanced Mobile-Optimized Tab Navigation */}
          <div className="weather-tabs custom-scrollbar mb-6 overflow-x-auto">
            <div className="flex gap-2 min-w-max">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as TabType)}
                    className={`tab-button flex items-center px-4 py-3 min-h-[44px] whitespace-nowrap ${
                      activeTab === tab.id ? 'active' : ''
                    }`}
                  >
                    <Icon className="w-4 h-4 mr-2 flex-shrink-0" />
                    <span className="hidden sm:inline">{tab.label}</span>
                    <span className="sm:hidden">{tab.mobileLabel}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Enhanced Tab Content */}
          <div className="tab-content flex-1">
            <AnimatePresence mode="wait">
              {activeTab === 'dashboard' && weather && (
                <motion.div
                  key="dashboard"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-6"
                >
                  <WeatherHero weather={weather} theme={theme} />
                  <WeatherDashboard weather={weather} forecast={forecast} />
                </motion.div>
              )}

              {activeTab === 'forecast' && forecast && (
                <motion.div
                  key="forecast"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <WeatherForecast forecast={forecast} />
                </motion.div>
              )}

              {activeTab === 'analytics' && weather && (
                <motion.div
                  key="analytics"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <WeatherAnalytics weather={weather} forecast={forecast} />
                </motion.div>
              )}

              {activeTab === 'map' && (
                <motion.div
                  key="map"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <WeatherMap weather={weather} forecast={forecast} />
                </motion.div>
              )}

              {activeTab === 'alerts' && (
                <motion.div
                  key="alerts"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="glass-card p-6 sm:p-8 text-center">
                    <AlertTriangle className="w-16 h-16 text-yellow-400 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold mb-2">Weather Alerts</h3>
                    <p className="text-white/70">No active alerts for your area.</p>
                  </div>
                </motion.div>
              )}

              {activeTab === 'insights' && weather && (
                <motion.div
                  key="insights"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <WeatherInsights weather={weather} forecast={forecast} />
                </motion.div>
              )}

              {activeTab === 'gallery' && (
                <motion.div
                  key="gallery"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="glass-card p-6 sm:p-8 text-center">
                    <Sparkles className="w-16 h-16 text-purple-400 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold mb-2">Weather Gallery</h3>
                    <p className="text-white/70">Beautiful weather images coming soon...</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Enhanced Error State */}
            {error && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="glass-card p-6 sm:p-8 text-center"
              >
                <AlertTriangle className="w-16 h-16 text-red-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Oops! Something went wrong</h3>
                <p className="text-white/70 mb-4">{error}</p>
                <button
                  onClick={handleRetry}
                  className="btn-primary py-3 px-6 min-h-[44px]"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Try Again
                </button>
              </motion.div>
            )}

            {/* Enhanced Loading State */}
            {isLoading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="glass-card p-6 sm:p-8 text-center"
              >
                <div className="loading-spin w-16 h-16 border-4 border-white/20 border-t-white rounded-full mx-auto mb-4" />
                <p className="text-white/70">Loading weather data...</p>
              </motion.div>
            )}

            {/* Enhanced No Location State */}
            {!location && !isLoading && !error && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-card p-6 sm:p-8 text-center"
              >
                <Search className="w-16 h-16 text-blue-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Search for a Location</h3>
                <p className="text-white/70 mb-4">Enter a city name above to get started</p>
              </motion.div>
            )}
          </div>
        </main>

        {/* Enhanced Professional Footer */}
        <footer className="app-footer px-4 sm:px-6 py-6">
          <div className="footer-links flex justify-center gap-4 sm:gap-6">
            <a href="#" className="footer-link text-sm sm:text-base">About</a>
            <a href="#" className="footer-link text-sm sm:text-base">Privacy</a>
            <a href="#" className="footer-link text-sm sm:text-base">Terms</a>
          </div>
        </footer>
      </div>

      {/* Enhanced Toast Notifications */}
      <Toaster
        position={isMobile ? "top-center" : "top-right"}
        toastOptions={{
          duration: 4000,
          style: {
            background: theme === 'dark' ? '#1f2937' : '#ffffff',
            color: theme === 'dark' ? '#ffffff' : '#1f2937',
            border: `1px solid ${theme === 'dark' ? '#374151' : '#e5e7eb'}`,
            fontSize: isMobile ? '14px' : '16px',
            padding: isMobile ? '12px 16px' : '16px 20px',
          },
        }}
      />
    </div>
  );
}

export default App;