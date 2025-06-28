import React, { useState, useEffect, Suspense, lazy, useCallback, useMemo } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
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
  VolumeX,
  MapPin
} from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import { useSwipeable } from 'react-swipeable';
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
import { useWeatherOptimized } from './hooks/useWeatherOptimized';
import { usePerformanceMonitor } from './hooks/usePerformanceMonitor';
import ErrorBoundary from './components/ErrorBoundary';
import LoadingSkeleton from './components/LoadingSkeleton';

type TabType = 'dashboard' | 'forecast' | 'analytics' | 'map' | 'alerts' | 'gallery' | 'insights';

// Lazy load components for code splitting
const WeatherHero = lazy(() => import('./components/WeatherHero'));
const WeatherInsights = lazy(() => import('./components/WeatherInsights'));
const WeatherMap = lazy(() => import('./components/WeatherMap'));
const WelcomeScreen = lazy(() => import('./components/WelcomeScreen'));
const ParticleSystem = lazy(() => import('./components/ParticleSystem'));
const ErrorBoundary = lazy(() => import('./components/ErrorBoundary'));
const LoadingSkeleton = lazy(() => import('./components/LoadingSkeleton'));

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes
      retry: 3,
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
      refetchOnWindowFocus: false,
      refetchOnReconnect: true,
    },
  },
});

// PWA Service Worker Registration
const registerServiceWorker = async () => {
  if ('serviceWorker' in navigator) {
    try {
      const registration = await navigator.serviceWorker.register('/sw.js');
      console.log('Service Worker registered:', registration);
      
      // Handle updates
      registration.addEventListener('updatefound', () => {
        const newWorker = registration.installing;
        if (newWorker) {
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              // New content is available
              if (confirm('New version available! Reload to update?')) {
                window.location.reload();
              }
            }
          });
        }
      });
    } catch (error) {
      console.error('Service Worker registration failed:', error);
    }
  }
};

// Theme detection
const getSystemTheme = () => {
  if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    return 'dark';
  }
  return 'light';
};

function App() {
  const [location, setLocation] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');
  const [theme, setTheme] = useState<'light' | 'dark'>(getSystemTheme());
  const [showWelcome, setShowWelcome] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [manualThemeOverride, setManualThemeOverride] = useState(false);
  const [lastSearch, setLastSearch] = useState('');
  const [errorRetryCount, setErrorRetryCount] = useState(0);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  
  // Enhanced mobile responsiveness state
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);
  const [viewportHeight, setViewportHeight] = useState(window.innerHeight);
  
  const { weather, forecast, error } = useWeather(location);
  const weatherCondition = weather?.condition?.main || 'default';
  const { isPlaying: isSoundOn, toggle: toggleSound } = useWeatherSound(weatherCondition);

  // Performance monitoring
  const { trackInteraction, trackError, trackAPICall, getMetrics } = usePerformanceMonitor();

  // Swipe handlers for mobile
  const swipeHandlers = useSwipeable({
    onSwipedLeft: () => {
      if (activeTab === 'dashboard') setActiveTab('insights');
      else if (activeTab === 'insights') setActiveTab('map');
      trackInteraction('component_render', { direction: 'left', from: activeTab });
    },
    onSwipedRight: () => {
      if (activeTab === 'map') setActiveTab('insights');
      else if (activeTab === 'insights') setActiveTab('dashboard');
      trackInteraction('component_render', { direction: 'right', from: activeTab });
    },
    trackMouse: true,
  });

  // Initialize app
  useEffect(() => {
    // Register service worker
    registerServiceWorker();

    // Track app initialization
    trackInteraction('component_render', { timestamp: Date.now() });

    // Check for saved location
    const savedLocation = localStorage.getItem('weather-location');
    if (savedLocation) {
      setLocation(savedLocation);
      setShowWelcome(false);
    }

    // Listen for online/offline status
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Listen for theme changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleThemeChange = (e: MediaQueryListEvent) => {
      setTheme(e.matches ? 'dark' : 'light');
    };
    mediaQuery.addEventListener('change', handleThemeChange);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      mediaQuery.removeEventListener('change', handleThemeChange);
    };
  }, [trackInteraction]);

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

  // Handle location permission
  const handleLocationPermission = useCallback(async () => {
    trackInteraction('location_change');
    
    try {
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          timeout: 10000,
          enableHighAccuracy: true
        });
      });

      const { latitude, longitude } = position.coords;
      
      // Reverse geocoding to get location name
      const response = await fetch(
        `https://api.openweathermap.org/geo/1.0/reverse?lat=${latitude}&lon=${longitude}&limit=1&appid=${import.meta.env.VITE_WEATHER_API_KEY}`
      );
      
      if (response.ok) {
        const data = await response.json();
        const locationName = data[0]?.name || `${latitude}, ${longitude}`;
        setLocation(locationName);
        setShowWelcome(false);
        localStorage.setItem('weather-location', locationName);
      }
    } catch (error) {
      trackError(error as Error);
      alert('Unable to get your location. Please search for a city instead.');
    }
  }, [trackInteraction, trackError]);

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

  // Weather data with React Query
  const { weather: weatherQuery, forecast: forecastQuery, isLoading: isLoadingQuery, isError, error: queryError, refetch } = useWeatherOptimized(location);

  // Initialize app
  useEffect(() => {
    // Track app initialization
    trackInteraction('component_render', { timestamp: Date.now() });
  }, [trackInteraction]);

  // Error handling
  useEffect(() => {
    if (isError && queryError) {
      trackError(queryError as Error);
    }
  }, [isError, queryError, trackError]);

  // Performance monitoring
  useEffect(() => {
    const metrics = getMetrics();
    if (metrics.pageLoadTime > 3000) {
      console.warn('Slow page load detected:', metrics.pageLoadTime);
    }
  }, [getMetrics]);

  if (showWelcome) {
    return (
      <QueryClientProvider client={queryClient}>
        <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900">
          <Suspense fallback={<LoadingSkeleton type="hero" />}>
            <WelcomeScreen
              onSearch={handleSearch}
              onLocationPermission={handleLocationPermission}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              isSearching={isLoading}
            />
          </Suspense>
        </div>
        {import.meta.env.DEV && <ReactQueryDevtools initialIsOpen={false} />}
      </QueryClientProvider>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <ErrorBoundary>
        <div className={`min-h-screen transition-colors duration-300 ${
          theme === 'dark' 
            ? 'bg-gradient-to-br from-gray-900 via-blue-900 to-indigo-900' 
            : 'bg-gradient-to-br from-blue-50 via-purple-50 to-indigo-50'
        }`}>
          
          {/* Particle System Background */}
          <Suspense fallback={null}>
            <ParticleSystem weatherCondition={weather?.condition?.main} />
          </Suspense>

          {/* Header */}
          <header className="relative z-10 p-4">
            <div className="max-w-4xl mx-auto flex items-center justify-between">
              <motion.h1 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="text-2xl font-bold text-white"
              >
                Meteora
              </motion.h1>

              {/* Online/Offline Indicator */}
              <div className="flex items-center space-x-4">
                <div className={`flex items-center space-x-2 px-3 py-1 rounded-full text-sm ${
                  isOnline 
                    ? 'bg-green-500/20 text-green-300' 
                    : 'bg-red-500/20 text-red-300'
                }`}>
                  <div className={`w-2 h-2 rounded-full ${
                    isOnline ? 'bg-green-400' : 'bg-red-400'
                  }`} />
                  <span>{isOnline ? 'Online' : 'Offline'}</span>
                </div>

                {/* Theme Toggle */}
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => {
                    setTheme(theme === 'dark' ? 'light' : 'dark');
                    trackInteraction('component_render', { newTheme: theme === 'dark' ? 'light' : 'dark' });
                  }}
                  className="p-2 rounded-full bg-white/10 backdrop-blur-md text-white hover:bg-white/20 transition-all duration-300"
                >
                  {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                </motion.button>
              </div>
            </div>
          </header>

          {/* Main Content */}
          <main className="relative z-10 p-4" {...swipeHandlers}>
            <div className="max-w-4xl mx-auto">
              
              {/* Search Bar */}
              <motion.form 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSearch(searchQuery);
                }}
                className="mb-6"
              >
                <div className="relative">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search for a city..."
                    className="w-full px-4 py-3 pl-12 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                  />
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/60" />
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 px-4 py-1 bg-blue-500 hover:bg-blue-600 text-white rounded-xl text-sm font-medium transition-colors duration-300 disabled:opacity-50"
                  >
                    {isLoading ? 'Searching...' : 'Search'}
                  </button>
                </div>
              </motion.form>

              {/* Location Display */}
              {location && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex items-center justify-center mb-6"
                >
                  <MapPin className="w-5 h-5 text-white/80 mr-2" />
                  <span className="text-white/80 text-lg">{location}</span>
                </motion.div>
              )}

              {/* View Navigation */}
              <div className="flex justify-center mb-6">
                <div className="flex bg-white/10 backdrop-blur-md rounded-2xl p-1">
                  {tabs.map(({ id, label, icon: Icon }) => (
                    <motion.button
                      key={id}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => {
                        setActiveTab(id as TabType);
                        trackInteraction('component_render', { view: id });
                      }}
                      className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
                        activeTab === id
                          ? 'bg-blue-500 text-white shadow-lg'
                          : 'text-white/70 hover:text-white hover:bg-white/10'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span>{label}</span>
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Content Views */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <Suspense fallback={<LoadingSkeleton type="hero" />}>
                    {activeTab === 'dashboard' && weather && (
                      <WeatherHero weather={weather} forecast={forecast} />
                    )}
                    
                    {activeTab === 'forecast' && forecast && (
                      <WeatherForecast forecast={forecast} />
                    )}
                    
                    {activeTab === 'analytics' && weather && (
                      <WeatherAnalytics weather={weather} forecast={forecast} />
                    )}
                    
                    {activeTab === 'map' && weather && (
                      <WeatherMap weather={weather} />
                    )}
                  </Suspense>
                </motion.div>
              </AnimatePresence>

              {/* Error Display */}
              {isError && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-6 p-4 bg-red-500/20 backdrop-blur-md border border-red-500/30 rounded-2xl text-center"
                >
                  <p className="text-red-300 mb-2">Failed to load weather data</p>
                  <button
                    onClick={() => {
                      refetch();
                      trackInteraction('component_render');
                    }}
                    className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-xl text-sm font-medium transition-colors duration-300"
                  >
                    Try Again
                  </button>
                </motion.div>
              )}
            </div>
          </main>
        </div>
      </ErrorBoundary>
      
      {/* React Query DevTools (Development Only) */}
      {import.meta.env.DEV && <ReactQueryDevtools initialIsOpen={false} />}
    </QueryClientProvider>
  );
}

export default App;