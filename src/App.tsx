import React, { useState, useEffect, Suspense, lazy, useCallback, useMemo, startTransition, useRef } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sun, 
  Moon, 
  BarChart3,
  Calendar,
  AlertTriangle,
  Sparkles,
  Globe,
  Menu,
  X,
  RefreshCw,
  Image,
  ArrowUp,
  ArrowDown,
  Minus
} from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import Lottie from 'lottie-react';
import dashboardAnim from './lottie/dashboard.json';
import forecastAnim from './lottie/forecast.json';
import analyticsAnim from './lottie/analytics.json';
import mapAnim from './lottie/map.json';
import alertsAnim from './lottie/alerts.json';
import insightsAnim from './lottie/insights.json';
import galleryAnim from './lottie/gallery.json';

// Custom hooks
import { useWeatherOptimized } from './hooks/useWeatherOptimized';
import { usePerformanceMonitor } from './hooks/usePerformanceMonitor';

// Components
import SearchBar from './components/SearchBar';
import WeatherForecast from './components/WeatherForecast';

// Lazy load components for code splitting
const WeatherHero = lazy(() => import('./components/WeatherHero'));
const WelcomeScreen = lazy(() => import('./components/WelcomeScreen'));
const LoadingSkeleton = lazy(() => import('./components/LoadingSkeleton'));

type TabType = 'dashboard' | 'forecast' | 'analytics' | 'map' | 'alerts' | 'gallery' | 'insights';

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

// Tooltip descriptions and fun facts
const tabDescriptions = {
  dashboard: 'Your personalized weather dashboard',
  forecast: '7-day and hourly weather forecast',
  analytics: 'Weather analytics and trends',
  map: 'Interactive weather map',
  alerts: 'Live weather alerts and warnings',
  insights: 'AI-powered weather insights',
  gallery: 'Weather photo gallery'
};
const weatherFacts = [
  'The highest temperature ever recorded on Earth was 56.7°C (134°F) in Death Valley, USA.',
  'Raindrops can fall at speeds of about 22 miles per hour.',
  'Snowflakes always have six sides.',
  'A bolt of lightning is five times hotter than the surface of the sun.',
  'The coldest temperature ever recorded was -89.2°C (-128.6°F) in Antarctica.',
  'Clouds look white because they reflect sunlight.',
  'The fastest wind speed ever recorded was 253 mph during Cyclone Olivia.',
  'Fog is actually a cloud that touches the ground.',
  'Hurricanes can release the energy of 10,000 nuclear bombs.',
  'The wettest place on Earth is Mawsynram, India.'
];

const tabLottieMap = {
  dashboard: dashboardAnim,
  forecast: forecastAnim,
  analytics: analyticsAnim,
  map: mapAnim,
  alerts: alertsAnim,
  insights: insightsAnim,
  gallery: galleryAnim,
};

const accentColors = [
  { name: 'Blue', value: '#3b82f6' },
  { name: 'Purple', value: '#a21caf' },
  { name: 'Green', value: '#22c55e' },
  { name: 'Orange', value: '#f59e42' },
  { name: 'Pink', value: '#ec4899' },
];

function setAccentColor(color: string) {
  document.documentElement.style.setProperty('--primary-light', color);
  localStorage.setItem('meteora-accent', color);
}

function resetAccentColor() {
  document.documentElement.style.setProperty('--primary-light', '#3b82f6');
  localStorage.removeItem('meteora-accent');
}

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

  // Weather data with React Query
  const { weather, forecast, isLoading: isLoadingQuery, isError, error: queryError, refetch } = useWeatherOptimized(location);

  // Performance monitoring
  const { trackInteraction, trackError, trackAPICall, getMetrics } = usePerformanceMonitor();

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
  // useEffect(() => {
  //   const timer = setTimeout(() => {
  //     setShowWelcome(false);
  //   }, 3000);
  //   return () => clearTimeout(timer);
  // }, []);

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
    startTransition(() => {
      setIsLoading(true);
      setLocation(trimmedQuery);
      setSearchQuery('');
      setShowWelcome(false);
      setLastSearch(trimmedQuery);
      setErrorRetryCount(0);
      setIsMobileMenuOpen(false); // Close mobile menu after search
    });
    toast.success(`Searching for weather in ${trimmedQuery}...`);
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
    { id: 'gallery', label: 'Gallery', icon: Image, mobileLabel: 'Gallery' }
  ], []);

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

  // Debug logging for weather and error state
  useEffect(() => {
    console.log('Weather:', weather);
    console.log('Error:', queryError);
  }, [weather, queryError]);

  // On mount, load accent color from localStorage
  useEffect(() => {
    const savedAccent = localStorage.getItem('meteora-accent');
    if (savedAccent) {
      document.documentElement.style.setProperty('--primary-light', savedAccent);
    }
  }, []);

  // Inline alert generation logic for nav badge (move inside App)
  function getActiveAlerts(weather: any, forecast: any) {
    if (!weather) return [];
    const alerts = [];
    const { temperature, condition, wind, humidity, visibility } = weather;
    if (temperature?.current < 0) alerts.push('freezing');
    if (temperature?.current > 30) alerts.push('heat');
    if (condition?.main === 'Thunderstorm') alerts.push('thunderstorm');
    if (condition?.main === 'Rain') alerts.push('rain');
    if (condition?.main === 'Snow') alerts.push('snow');
    if (wind?.speed > 20) alerts.push('wind');
    if (visibility < 5000) alerts.push('visibility');
    if (humidity > 80) alerts.push('humidity');
    if (forecast?.daily) {
      const maxTemp = Math.max(...forecast.daily.map((day: any) => day.temperature.max));
      const minTemp = Math.min(...forecast.daily.map((day: any) => day.temperature.min));
      if (maxTemp > 35) alerts.push('heat-wave');
      if (minTemp < -10) alerts.push('cold-wave');
    }
    return alerts;
  }

  const tabList = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { id: 'forecast', label: 'Forecast', icon: Calendar },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'map', label: 'Map', icon: Globe },
    { id: 'alerts', label: 'Alerts', icon: AlertTriangle },
    { id: 'insights', label: 'Insights', icon: Sparkles },
    { id: 'gallery', label: 'Gallery', icon: Image }
  ];

  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  if (showWelcome) {
    return (
      <QueryClientProvider client={queryClient}>
        <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900">
          <Suspense fallback={<LoadingSkeleton type="hero" />}>
            <WelcomeScreen
              onSearch={handleSearch}
            />
          </Suspense>
        </div>
        {import.meta.env.DEV && <ReactQueryDevtools initialIsOpen={false} />}
      </QueryClientProvider>
    );
  }

  // Fallback UI if no weather data and not loading
  if (!weather && !isLoading) {
    return (
      <QueryClientProvider client={queryClient}>
        <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 text-white">
          <h2 className="text-2xl font-bold mb-4">No weather data</h2>
          <p className="mb-6">Please search for a city to see the weather.</p>
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
              <button
                type="submit"
                disabled={isLoading}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 px-4 py-1 bg-blue-500 hover:bg-blue-600 text-white rounded-xl text-sm font-medium transition-colors duration-300 disabled:opacity-50"
              >
                {isLoading ? 'Searching...' : 'Search'}
              </button>
            </div>
          </motion.form>
          {queryError && (
            <div className="text-red-300 mt-2">{String(queryError)}</div>
          )}
        </div>
        {import.meta.env.DEV && <ReactQueryDevtools initialIsOpen={false} />}
      </QueryClientProvider>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <div className={`app ${theme} min-h-screen min-h-dvh bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 transition-all duration-500`}>
        <Toaster 
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: theme === 'dark' ? '#1f2937' : '#ffffff',
              color: theme === 'dark' ? '#f9fafb' : '#1f2937',
              border: `1px solid ${theme === 'dark' ? '#374151' : '#e5e7eb'}`,
              borderRadius: '12px',
              boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
            },
          }}
        />

        {/* Welcome Screen */}
        <AnimatePresence>
          {showWelcome && (
            <Suspense fallback={<LoadingSkeleton />}>
              <WelcomeScreen 
                onSearch={handleSearch}
              />
            </Suspense>
          )}
        </AnimatePresence>

        {/* Main App Content */}
        {!showWelcome && (
          <div className="meteora-container relative z-10">
            {/* Enhanced Header */}
            <motion.header 
              className="app-header bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl border border-white/20 dark:border-gray-700/30 rounded-2xl shadow-lg"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 w-full">
                {/* Header Left */}
                <div className="flex items-center gap-4 w-full sm:w-auto">
                  <motion.h1 
                    className="app-title text-2xl sm:text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent"
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.2 }}
                  >
                    Meteora
                  </motion.h1>
                  
                  {/* Enhanced Search Bar */}
                  <div className="flex-1 sm:flex-none sm:w-96">
                    <SearchBar
                      value={searchQuery}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
                      onSearch={(query: string) => {
                        setLocation(query);
                        setLastSearch(query);
                        localStorage.setItem('weather-location', query);
                        trackInteraction('search', { query });
                      }}
                    />
                  </div>
                </div>

                {/* Header Right */}
                <div className="flex items-center gap-3 sm:gap-4">
                  {/* Theme Toggle */}
                  <motion.button
                    className="theme-toggle bg-white/20 dark:bg-gray-700/20 backdrop-blur-sm border border-white/30 dark:border-gray-600/30 rounded-full p-2 hover:scale-105 transition-all duration-300"
                    onClick={() => {
                      setTheme(theme === 'light' ? 'dark' : 'light');
                      setManualThemeOverride(true);
                      trackInteraction('component_render', { theme: theme === 'light' ? 'dark' : 'light' });
                    }}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    aria-label="Toggle theme"
                  >
                    {theme === 'light' ? (
                      <Moon className="w-5 h-5 text-gray-700" />
                    ) : (
                      <Sun className="w-5 h-5 text-yellow-300" />
                    )}
                  </motion.button>

                  {/* Accent Color Palette */}
                  <div className="flex items-center gap-1 ml-2">
                    {accentColors.map((c) => (
                      <button
                        key={c.value}
                        className="w-6 h-6 rounded-full border-2 border-white/70 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 transition-transform hover:scale-110"
                        style={{ background: c.value }}
                        aria-label={`Set accent color to ${c.name}`}
                        onClick={() => setAccentColor(c.value)}
                      />
                    ))}
                    <button
                      className="w-6 h-6 rounded-full border-2 border-gray-300 flex items-center justify-center bg-white text-gray-500 text-xs font-bold ml-1 focus:outline-none focus:ring-2 focus:ring-blue-400 hover:scale-110 transition-transform"
                      aria-label="Reset accent color"
                      onClick={resetAccentColor}
                      title="Reset accent color"
                    >
                      ×
                    </button>
                  </div>
                  {/* End Accent Color Palette */}

                  {/* Mobile Menu Button */}
                  <motion.button
                    className="sm:hidden bg-white/20 dark:bg-gray-700/20 backdrop-blur-sm border border-white/30 dark:border-gray-600/30 rounded-full p-2 hover:scale-105 transition-all duration-300"
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    aria-label="Toggle menu"
                  >
                    {isMobileMenuOpen ? (
                      <X className="w-5 h-5 text-gray-700 dark:text-gray-300" />
                    ) : (
                      <Menu className="w-5 h-5 text-gray-700 dark:text-gray-300" />
                    )}
                  </motion.button>
                </div>
              </div>
            </motion.header>

            {/* Enhanced Navigation Tabs */}
            <motion.nav
              className="weather-tabs flex flex-wrap gap-2 sm:gap-3 mt-6 mb-8"
              role="tablist"
              aria-label="Main navigation tabs"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              {tabList.map((tab, idx) => {
                const isActive = activeTab === tab.id;
                // Micro-stat logic
                let microStat = null;
                if (isActive && forecast && forecast.daily && forecast.daily.length >= 2) {
                  const today = forecast.daily[0];
                  const prev = forecast.daily[1];
                  const diff = Math.round(today.temperature.max - prev.temperature.max);
                  if (diff > 0) {
                    microStat = (
                      <motion.span
                        className="ml-2 flex items-center text-green-500 font-semibold text-xs"
                        initial={{ opacity: 0, x: 10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.4 }}
                      >
                        <ArrowUp className="w-3 h-3 mr-0.5" />
                        {`+${diff}°C warmer than yesterday`}
                      </motion.span>
                    );
                  } else if (diff < 0) {
                    microStat = (
                      <motion.span
                        className="ml-2 flex items-center text-blue-500 font-semibold text-xs"
                        initial={{ opacity: 0, x: 10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.4 }}
                      >
                        <ArrowDown className="w-3 h-3 mr-0.5" />
                        {`${diff}°C cooler than yesterday`}
                      </motion.span>
                    );
                  } else {
                    microStat = (
                      <motion.span
                        className="ml-2 flex items-center text-gray-500 font-semibold text-xs"
                        initial={{ opacity: 0, x: 10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.4 }}
                      >
                        <Minus className="w-3 h-3 mr-0.5" />
                        No change
                      </motion.span>
                    );
                  }
                }
                // Animated badge for Alerts tab
                let alertBadge = null;
                if (tab.id === 'alerts') {
                  const alerts = getActiveAlerts(weather, forecast);
                  if (alerts.length > 0) {
                    alertBadge = (
                      <motion.span
                        className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-red-500 shadow-lg border-2 border-white z-10"
                        initial={{ scale: 0.7, opacity: 0.7 }}
                        animate={{ scale: [1, 1.2, 1], opacity: [0.7, 1, 0.7] }}
                        transition={{ duration: 1.2, repeat: Infinity, repeatType: 'loop' }}
                      />
                    );
                  }
                }
                // Tooltip logic
                const [showTooltip, setShowTooltip] = React.useState(false);
                const tooltipContent = Math.random() < 0.5
                  ? tabDescriptions[tab.id as keyof typeof tabDescriptions]
                  : weatherFacts[Math.floor(Math.random() * weatherFacts.length)];
                return (
                  <motion.button
                    key={tab.id}
                    ref={el => tabRefs.current[idx] = el}
                    className={`tab-button flex items-center gap-2 px-4 sm:px-6 py-3 font-medium text-sm sm:text-base relative focus-visible:outline-4 focus-visible:outline-blue-500 focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:z-20`}
                    id={`tab-${tab.id}`}
                    role="tab"
                    tabIndex={0}
                    aria-selected={isActive}
                    aria-controls={`tabpanel-${tab.id}`}
                    onClick={() => {
                      setActiveTab(tab.id as TabType);
                      trackInteraction('component_render', { tab: tab.id });
                    }}
                    whileHover={{ scale: 1.06 }}
                    whileTap={{ scale: 0.98 }}
                    onMouseEnter={() => setShowTooltip(true)}
                    onMouseLeave={() => setShowTooltip(false)}
                    onFocus={() => setShowTooltip(true)}
                    onBlur={() => setShowTooltip(false)}
                    onKeyDown={e => {
                      if (e.key === 'ArrowRight') {
                        e.preventDefault();
                        const next = (idx + 1) % tabList.length;
                        tabRefs.current[next]?.focus();
                      } else if (e.key === 'ArrowLeft') {
                        e.preventDefault();
                        const prev = (idx - 1 + tabList.length) % tabList.length;
                        tabRefs.current[prev]?.focus();
                      } else if (e.key === 'Enter' || e.key === ' ') {
                        setActiveTab(tab.id as TabType);
                        trackInteraction('component_render', { tab: tab.id });
                      }
                    }}
                  >
                    <span className="relative">
                      <motion.span
                        className="inline-flex"
                        animate={isActive ? { scale: [1, 1.18, 0.95, 1.1, 1] } : { scale: 1 }}
                        transition={isActive ? { duration: 0.7, times: [0, 0.2, 0.5, 0.8, 1], repeat: Infinity, repeatType: 'loop' } : {}}
                      >
                        <Lottie
                          animationData={tabLottieMap[tab.id as keyof typeof tabLottieMap]}
                          loop={true}
                          autoplay={isActive}
                          style={{ width: 32, height: 32, marginRight: 4 }}
                          rendererSettings={{ preserveAspectRatio: 'xMidYMid slice' }}
                        />
                      </motion.span>
                      {alertBadge}
                    </span>
                    <span className="inline">{tab.label}</span>
                    {microStat}
                    {/* Tooltip */}
                    <AnimatePresence>
                      {showTooltip && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 10 }}
                          transition={{ duration: 0.25 }}
                          className="absolute left-1/2 -translate-x-1/2 -top-10 bg-gray-900 text-white text-xs px-3 py-2 rounded-lg shadow-lg z-50 whitespace-nowrap pointer-events-none"
                          role="tooltip"
                        >
                          {tooltipContent}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.button>
                );
              })}
            </motion.nav>

            {/* Main Content Area */}
            <main className="app-main flex-1">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="weather-content grid gap-6 lg:gap-8"
                >
                  {/* Dashboard Tab */}
                  {activeTab === 'dashboard' && (
                    <>
                      {/* Weather Hero */}
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="lg:col-span-2"
                      >
                        <Suspense fallback={<LoadingSkeleton />}>
                          <WeatherHero weather={weather} theme={theme} />
                        </Suspense>
                      </motion.div>

                      {/* Weather Forecast */}
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="lg:col-span-1"
                      >
                        <Suspense fallback={<LoadingSkeleton />}>
                          <WeatherForecast forecast={forecast} />
                        </Suspense>
                      </motion.div>
                    </>
                  )}

                  {/* Other tabs content... */}
                  {/* (Keep existing tab content but enhance with Tailwind classes) */}
                </motion.div>
              </AnimatePresence>
            </main>

            {/* Enhanced Footer */}
            <motion.footer 
              className="app-footer bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl border border-white/20 dark:border-gray-700/30 rounded-2xl shadow-lg mt-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-6">
                <div className="text-center sm:text-left">
                  <p className="text-gray-600 dark:text-gray-300 text-sm">
                    © 2024 Meteora Weather. Built with modern web technologies.
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-gray-500 dark:text-gray-400 text-xs">
                    {isOnline ? '🟢 Online' : '🔴 Offline'}
                  </span>
                  <button
                    className="text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300 text-sm font-medium transition-colors duration-200"
                    onClick={() => refetch()}
                  >
                    <RefreshCw className="w-4 h-4 inline mr-1" />
                    Refresh
                  </button>
                </div>
              </div>
            </motion.footer>
          </div>
        )}

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              className="mobile-menu fixed inset-0 z-50 bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl"
              initial={{ opacity: 0, x: '-100%' }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: '-100%' }}
              transition={{ duration: 0.3 }}
            >
              {/* Mobile menu content... */}
            </motion.div>
          )}
        </AnimatePresence>

        {/* React Query DevTools */}
        {import.meta.env.DEV && (
          <ReactQueryDevtools initialIsOpen={false} />
        )}
    </div>
    </QueryClientProvider>
  );
}

export default App;