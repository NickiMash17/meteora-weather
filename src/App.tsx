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
import ParticleSystem from './components/ParticleSystem';
import ImageSlider from './components/ImageSlider';
import AuroraParallaxStars from './components/AuroraParallaxStars';
import useWeatherSound from './hooks/useWeatherSound';

type TabType = 'dashboard' | 'forecast' | 'analytics' | 'map' | 'alerts' | 'gallery';

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
  
  const { weather, forecast, error } = useWeather(location);
  const weatherCondition = weather?.condition?.main || 'default';
  const { isPlaying: isSoundOn, toggle: toggleSound } = useWeatherSound(weatherCondition);

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

  // Optimized theme toggle with debouncing
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

  // Optimized search handler with better error handling
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

  // Optimized share functionality
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

  // Memoized weather gradient for better performance
  const weatherGradient = useMemo(() => {
    if (!weather) return 'weather-gradient';
    
    const condition = weather.condition.main.toLowerCase();
    const hour = new Date().getHours();
    const isDaytime = hour >= 6 && hour < 18;
    
    // Night mode gradients
    if (theme === 'dark' || !isDaytime) {
      if (condition.includes('clear')) return 'night-sunny-gradient';
      if (condition.includes('cloud')) return 'night-cloudy-gradient';
      if (condition.includes('rain') || condition.includes('drizzle')) return 'night-rainy-gradient';
      if (condition.includes('thunderstorm')) return 'night-gradient';
      if (condition.includes('snow')) return 'night-gradient';
      return 'night-gradient';
    }
    
    // Day mode gradients
    if (condition.includes('clear')) return 'sunny-gradient';
    if (condition.includes('cloud')) return 'cloudy-gradient';
    if (condition.includes('rain') || condition.includes('drizzle')) return 'rainy-gradient';
    if (condition.includes('thunderstorm')) return 'stormy-gradient';
    if (condition.includes('snow')) return 'snowy-gradient';
    
    return 'sunny-gradient';
  }, [weather, theme]);

  // Memoized tabs configuration
  const tabs = useMemo(() => [
    { id: 'dashboard', label: 'Dashboard', icon: Thermometer },
    { id: 'forecast', label: 'Forecast', icon: Calendar },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'map', label: 'Map', icon: Globe },
    { id: 'alerts', label: 'Alerts', icon: AlertTriangle },
    { id: 'gallery', label: 'Gallery', icon: Info },
  ] as const, []);

  // Handle mobile menu toggle
  const toggleMobileMenu = useCallback(() => {
    setIsMobileMenuOpen(prev => !prev);
  }, []);

  // Handle tab change
  const handleTabChange = useCallback((tab: TabType) => {
    setActiveTab(tab);
    setIsMobileMenuOpen(false);
  }, []);

  if (showWelcome) {
    return <WelcomeScreen onSearch={handleSearch} />;
  }

  return (
    <div className={`min-h-screen transition-all duration-500 theme-transition ${weatherGradient}`}>
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: theme === 'dark' ? '#1f2937' : '#ffffff',
            color: theme === 'dark' ? '#ffffff' : '#1f2937',
            border: `1px solid ${theme === 'dark' ? '#374151' : '#e5e7eb'}`,
          },
        }}
      />
      
      {/* Background Weather Effects */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <AnimatePresence mode="wait">
          {weather && (
            <motion.div
              key={weatherGradient + theme}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.2, ease: 'easeInOut' }}
              className="absolute inset-0"
            >
              {/* Aurora + Parallax Stars */}
              <AuroraParallaxStars />
              {/* Energy Waves */}
              <div className="energy-waves transition-all duration-1000">
                <div className="energy-wave" />
                <div className="energy-wave" />
                <div className="energy-wave" />
              </div>
              {/* Floating Particles */}
              <div className="floating-particles transition-all duration-1000">
                {Array.from({ length: 15 }).map((_, i) => (
                  <div
                    key={i}
                    className="particle"
                    style={{
                      left: `${Math.random() * 100}%`,
                      animationDelay: `${Math.random() * 20}s`,
                      animationDuration: `${15 + Math.random() * 10}s`
                    }}
                  />
                ))}
              </div>
              {/* Particle System */}
              <ParticleSystem weather={weather} />
              {/* Weather Particles */}
              {weather.condition.main === 'Rain' && (
                <motion.div
                  key="rain"
                  initial={{ opacity: 0, y: -30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 30 }}
                  transition={{ duration: 0.8 }}
                  className="rain-container"
                >
                  {Array.from({ length: 50 }).map((_, i) => (
                    <div
                      key={i}
                      className="rain-particle"
                      style={{
                        left: `${Math.random() * 100}%`,
                        animationDelay: `${Math.random() * 2}s`,
                        animationDuration: `${1 + Math.random() * 2}s`
                      }}
                    />
                  ))}
                </motion.div>
              )}
              {weather.condition.main === 'Snow' && (
                <motion.div
                  key="snow"
                  initial={{ opacity: 0, y: -30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 30 }}
                  transition={{ duration: 0.8 }}
                  className="snow-container"
                >
                  {Array.from({ length: 30 }).map((_, i) => (
                    <div
                      key={i}
                      className="snow-particle"
                      style={{
                        left: `${Math.random() * 100}%`,
                        animationDelay: `${Math.random() * 3}s`,
                        animationDuration: `${2 + Math.random() * 3}s`
                      }}
                    />
                  ))}
                </motion.div>
              )}
              {/* Floating Clouds */}
              {['Clouds', 'Rain', 'Thunderstorm'].includes(weather.condition.main) && (
                <>
                  <motion.div
                    key="cloud1"
                    initial={{ opacity: 0, x: -60 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 60 }}
                    transition={{ duration: 1 }}
                    className="cloud"
                    style={{ top: '20%', left: '-100px', width: '80px', height: '40px', animationDelay: '0s' }}
                  />
                  <motion.div
                    key="cloud2"
                    initial={{ opacity: 0, x: -60 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 60 }}
                    transition={{ duration: 1.2 }}
                    className="cloud"
                    style={{ top: '40%', left: '-100px', width: '60px', height: '30px', animationDelay: '5s' }}
                  />
                  <motion.div
                    key="cloud3"
                    initial={{ opacity: 0, x: -60 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 60 }}
                    transition={{ duration: 1.4 }}
                    className="cloud"
                    style={{ top: '60%', left: '-100px', width: '100px', height: '50px', animationDelay: '10s' }}
                  />
                </>
              )}
              {/* Sun/Moon */}
              <motion.div
                key={weather.isDay ? 'sun' : 'moon'}
                initial={{ opacity: 0, scale: 0.8, y: -40 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.8, y: 40 }}
                transition={{ duration: 1 }}
                className="absolute top-20 right-20"
              >
                {weather.isDay ? (
                  <div className="sun transition-all duration-1000" />
                ) : (
                  <div className="moon transition-all duration-1000" />
                )}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Main Content */}
      <div className="relative z-10 min-h-screen">
        {/* Header */}
        <motion.header 
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="sticky top-0 z-50 backdrop-blur-md bg-white/10 border-b border-white/20"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              {/* Logo */}
              <motion.div 
                className="flex items-center space-x-3 cursor-pointer"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  setLocation('');
                  setShowWelcome(true);
                }}
                title="Go to home"
              >
                <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <h1 className="text-xl sm:text-2xl font-bold text-white font-display">
                  Meteora
                </h1>
              </motion.div>

              {/* Search Bar - Hidden on mobile */}
              <div className="hidden md:flex flex-1 max-w-md mx-8">
                <LocationSearch
                  value={searchQuery}
                  onChange={setSearchQuery}
                  onSearch={handleSearch}
                  isLoading={isLoading}
                />
              </div>

              {/* Header Actions */}
              <div className="flex items-center space-x-2 sm:space-x-4">
                {weather && (
                  <motion.button
                    whileHover={{ scale: 1.08, boxShadow: '0 4px 16px rgba(59,130,246,0.15)' }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleShare}
                    className="p-2 rounded-full bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 transition-colors"
                    title="Share the current weather (copy to clipboard if sharing is unavailable)"
                    aria-label="Share weather information"
                  >
                    <Share2 className="w-5 h-5" />
                  </motion.button>
                )}
                {/* Sound Toggle */}
                {weather && (
                  <motion.button
                    whileHover={{ scale: 1.08, rotate: [0, 10, -10, 0] }}
                    whileTap={{ scale: 0.95 }}
                    onClick={toggleSound}
                    className={`p-2 rounded-full bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 transition-colors relative ${isSoundOn ? 'ring-2 ring-blue-400/40' : ''}`}
                    title={isSoundOn ? 'Mute weather soundscape' : 'Unmute weather soundscape'}
                    aria-label={isSoundOn ? 'Mute weather soundscape' : 'Unmute weather soundscape'}
                  >
                    {isSoundOn ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
                    <span className="sr-only">{isSoundOn ? 'Mute sound' : 'Unmute sound'}</span>
                  </motion.button>
                )}
                <motion.button
                  whileHover={{ scale: 1.08, boxShadow: '0 4px 16px rgba(253,224,71,0.15)' }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleThemeToggle}
                  className="p-2 rounded-full bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 transition-colors relative"
                  title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
                  aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
                >
                  {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
                  {manualThemeOverride && (
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full animate-pulse" />
                  )}
                </motion.button>

                {/* Mobile Menu Button */}
                <motion.button
                  whileHover={{ scale: 1.08, boxShadow: '0 4px 16px rgba(255,255,255,0.12)' }}
                  whileTap={{ scale: 0.95 }}
                  onClick={toggleMobileMenu}
                  className="md:hidden p-2 rounded-full bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 transition-colors"
                  title="Open navigation menu"
                  aria-label="Toggle mobile menu"
                >
                  {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                </motion.button>
              </div>
            </div>

            {/* Mobile Search Bar */}
            <div className="md:hidden pb-4">
              <LocationSearch
                value={searchQuery}
                onChange={setSearchQuery}
                onSearch={handleSearch}
                isLoading={isLoading}
              />
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
              {isMobileMenuOpen && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="md:hidden border-t border-white/20 pt-4 pb-4"
                >
                  <div className="space-y-2">
                    {tabs.map((tab) => {
                      const Icon = tab.icon;
                      return (
                        <motion.button
                          key={tab.id}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => handleTabChange(tab.id)}
                          className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg backdrop-blur-sm transition-all duration-300 ${
                            activeTab === tab.id
                              ? 'bg-white/30 text-white shadow-lg'
                              : 'bg-white/10 text-white/80 hover:bg-white/20'
                          }`}
                        >
                          <Icon className="w-5 h-5" />
                          <span className="font-medium">{tab.label}</span>
                        </motion.button>
                      );
                    })}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.header>

        {/* Loading Screen */}
        <AnimatePresence>
          {isLoading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
            >
              <LoadingScreen />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Error State */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8"
          >
            <div className="glass-card rounded-2xl p-8 text-center">
              <AlertTriangle className="w-16 h-16 text-red-400 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-white mb-2">Oops! Something went wrong</h2>
              <p className="text-white/80 mb-6">{error}</p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={handleRetry}
                  className="px-6 py-3 bg-white/20 backdrop-blur-sm text-white rounded-full hover:bg-white/30 transition-colors flex items-center justify-center space-x-2"
                >
                  <RefreshCw className="w-4 h-4" />
                  <span>Try Again</span>
                </button>
                <button
                  onClick={() => {
                    setLocation('');
                    setErrorRetryCount(0);
                  }}
                  className="px-6 py-3 bg-white/10 backdrop-blur-sm text-white/80 rounded-full hover:bg-white/20 transition-colors"
                >
                  Search Different Location
                </button>
              </div>
              {errorRetryCount > 0 && (
                <p className="text-white/60 text-sm mt-4">
                  Retry attempt {errorRetryCount} of 3
                </p>
              )}
            </div>
          </motion.div>
        )}

        {/* Main Content */}
        {weather && !isLoading && !error && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Weather Alerts */}
            <AnimatePresence>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <WeatherAlerts weather={weather} forecast={forecast} />
              </motion.div>
            </AnimatePresence>

            {/* Weather Insights */}
            <AnimatePresence>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="mt-8"
              >
                <WeatherInsights weather={weather} forecast={forecast} />
              </motion.div>
            </AnimatePresence>

            {/* Navigation Tabs */}
            <motion.nav
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="flex items-center justify-center space-x-2 my-8"
            >
              <div className="flex space-x-2 overflow-x-auto pb-2 custom-scrollbar max-w-full">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <motion.button
                      key={tab.id}
                      whileHover={{ scale: 1.08, boxShadow: '0 4px 16px rgba(59,130,246,0.10)' }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleTabChange(tab.id)}
                      className={`flex items-center space-x-2 px-4 sm:px-6 py-3 rounded-full backdrop-blur-sm transition-all duration-300 flex-shrink-0 ${
                        activeTab === tab.id
                          ? 'bg-white/30 text-white shadow-lg'
                          : 'bg-white/10 text-white/80 hover:bg-white/20'
                      }`}
                      aria-label={`Switch to ${tab.label} tab`}
                      title={tab.label}
                    >
                      <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
                      <span className="font-medium text-sm sm:text-base">{tab.label}</span>
                    </motion.button>
                  );
                })}
              </div>
            </motion.nav>

            {/* Tab Content */}
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="min-h-[600px]"
              >
                {activeTab === 'dashboard' && (
                  <WeatherDashboard weather={weather} forecast={forecast} />
                )}
                {activeTab === 'forecast' && (
                  <WeatherForecast forecast={forecast} />
                )}
                {activeTab === 'analytics' && (
                  <WeatherAnalytics weather={weather} forecast={forecast} />
                )}
                {activeTab === 'map' && (
                  <WeatherMap weather={weather} />
                )}
                {activeTab === 'alerts' && (
                  <WeatherAlerts weather={weather} forecast={forecast} />
                )}
                {activeTab === 'gallery' && (
                  <ImageSlider />
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        )}

        {/* Welcome State */}
        {!location && !isLoading && !error && (
          <WelcomeScreen onSearch={handleSearch} />
        )}

        {/* Footer */}
        <footer className="mt-auto py-6 text-center text-white/60 text-sm">
          <p>© 2024 Meteora Weather. Built with ❤️ and modern web technologies.</p>
        </footer>
      </div>
    </div>
  );
}

export default App;