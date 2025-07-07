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
  Minus,
  Settings
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
import './i18n';
import { useTranslation } from 'react-i18next';

// Custom hooks
import { useWeatherOptimized } from './hooks/useWeatherOptimized';
import { usePerformanceMonitor } from './hooks/usePerformanceMonitor';

// Components
import SearchBar from './components/SearchBar';
import WeatherForecast from './components/WeatherForecast';
import WeatherOverlay from './components/WeatherOverlay';
import SettingsModal from './components/SettingsModal';

// Lazy load components for code splitting
const WeatherHero = lazy(() => import('./components/WeatherHero'));
import type { FC } from 'react';
import type { WelcomeScreenProps } from './components/WelcomeScreen';
const WelcomeScreen = lazy(() => import('./components/WelcomeScreen')) as React.LazyExoticComponent<FC<WelcomeScreenProps>>;
const LoadingSkeleton = lazy(() => import('./components/LoadingSkeleton'));

// New components
import WeatherDashboard from './components/WeatherDashboard';
import WeatherAnalytics from './components/WeatherAnalytics';
import WeatherMap from './components/WeatherMap';
import WeatherAlerts from './components/WeatherAlerts';
import WeatherInsights from './components/WeatherInsights';
import ImageSlider from './components/ImageSlider';
import WeatherBackground from './components/WeatherBackground';

type TabType = 'dashboard' | 'forecast' | 'analytics' | 'map' | 'alerts' | 'gallery' | 'insights';

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes
      retry: 3,
      retryDelay: (attemptIndex: number) => Math.min(1000 * 2 ** attemptIndex, 30000),
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
  forecast: '5-day and hourly weather forecast',
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
  const { t } = useTranslation();
  const tabList = [
    { id: 'dashboard', label: t('Dashboard'), icon: BarChart3, mobileLabel: 'Home' },
    { id: 'forecast', label: t('Forecast'), icon: Calendar, mobileLabel: 'Forecast' },
    { id: 'analytics', label: t('Analytics'), icon: BarChart3, mobileLabel: 'Stats' },
    { id: 'map', label: t('Map'), icon: Globe, mobileLabel: 'Map' },
    { id: 'alerts', label: t('Alerts'), icon: AlertTriangle, mobileLabel: 'Alerts' },
    { id: 'insights', label: t('Insights'), icon: Sparkles, mobileLabel: 'AI' },
    { id: 'gallery', label: t('Gallery'), icon: Image, mobileLabel: 'Gallery' }
  ];
  const [location, setLocation] = useState('Paris');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');
  const [theme, setThemeState] = useState<'light' | 'dark' | 'system'>(() => {
    const saved = localStorage.getItem('meteora-theme');
    if (saved === 'light' || saved === 'dark' || saved === 'system') return saved;
    return 'system';
  });
  const [resolvedTheme, setResolvedTheme] = useState<'light' | 'dark'>(getSystemTheme());
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
  // Fix: showTooltip state for each tab, not inside map
  const [showTooltips, setShowTooltips] = useState(() => Array(tabList.length).fill(false));
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [accentColor, setAccentColorState] = useState(() => localStorage.getItem('meteora-accent') || '#3b82f6');

  // Add state for time format
  const [timeFormat, setTimeFormat] = useState<'12' | '24'>(() => {
    const saved = localStorage.getItem('meteora-time-format');
    return saved === '24' ? '24' : '12';
  });

  // Weather data with React Query
  const { weather, forecast, isLoading: isLoadingQuery, isError, error: queryError, refetch } = useWeatherOptimized(location);

  // Performance monitoring
  const { trackInteraction, trackError, trackAPICall, getMetrics } = usePerformanceMonitor();

  // Add state for favorites
  const [favorites, setFavorites] = useState<string[]>(() => {
    const saved = localStorage.getItem('meteora-favorites');
    return saved ? JSON.parse(saved) : [];
  });

  // Add state for home city
  const [homeCity, setHomeCity] = useState(() => localStorage.getItem('meteora-home-city') || '');

  // Add/remove favorite handlers
  const addFavorite = (loc: string) => {
    if (!favorites.includes(loc)) {
      const updated = [loc, ...favorites].slice(0, 5);
      setFavorites(updated);
      localStorage.setItem('meteora-favorites', JSON.stringify(updated));
      toast.success(`${loc} added to favorites!`);
    }
  };
  const removeFavorite = (loc: string) => {
    const updated = favorites.filter(f => f !== loc);
    setFavorites(updated);
    localStorage.setItem('meteora-favorites', JSON.stringify(updated));
    toast((t) => (
      <span>
        {`${loc} removed from favorites.`}
        <button
          className="ml-2 underline text-blue-500 hover:text-blue-700 focus:outline-none"
          onClick={() => {
            addFavorite(loc);
            toast.dismiss(t.id);
          }}
        >Undo</button>
      </span>
    ), { duration: 5000 });
  };

  // Initialize app
  useEffect(() => {
    // Register service worker
    registerServiceWorker();

    // Track app initialization
    trackInteraction('component_render', { timestamp: Date.now() });

    // Listen for online/offline status
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Listen for theme changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleThemeChange = (e: MediaQueryListEvent) => {
      setThemeState(e.matches ? 'dark' : 'light');
    };
    mediaQuery.addEventListener('change', handleThemeChange);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      mediaQuery.removeEventListener('change', handleThemeChange);
    };
  }, [trackInteraction]);

  // After Welcome screen, load saved location if any (only if not set by search)
  useEffect(() => {
    if (!showWelcome && !location) {
      const savedLocation = localStorage.getItem('weather-location');
      if (savedLocation) {
        setLocation(savedLocation);
      } else {
        setLocation('Paris');
      }
    }
  }, [showWelcome, location]);

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
      setThemeState(savedTheme);
      setManualThemeOverride(true);
    }
  }, []);

  // Theme effect: apply theme to document
  useEffect(() => {
    let appliedTheme = theme;
    if (theme === 'system') {
      appliedTheme = getSystemTheme();
    }
    setResolvedTheme(appliedTheme as 'light' | 'dark');
    document.documentElement.classList.remove('light', 'dark');
    document.documentElement.classList.add(appliedTheme);
    localStorage.setItem('meteora-theme', theme);
  }, [theme]);

  // Listen for system theme changes if 'system' is selected
  useEffect(() => {
    if (theme !== 'system') return;
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = (e: MediaQueryListEvent) => {
      setResolvedTheme(e.matches ? 'dark' : 'light');
      document.documentElement.classList.remove('light', 'dark');
      document.documentElement.classList.add(e.matches ? 'dark' : 'light');
    };
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, [theme]);

  // Accent color effect
  useEffect(() => {
    document.documentElement.style.setProperty('--primary-light', accentColor);
    localStorage.setItem('meteora-accent', accentColor);
  }, [accentColor]);

  // Auto-detect theme based on weather and time (only if not manually overridden)
  useEffect(() => {
    if (weather && !manualThemeOverride) {
      const hour = new Date().getHours();
      const isDaytime = hour >= 6 && hour < 18;
      const isStormy = ['Thunderstorm', 'Rain', 'Drizzle'].includes(weather.condition.main);
      
      if (!isDaytime || isStormy) {
        setThemeState('dark');
      } else {
        setThemeState('light');
      }
    }
  }, [weather, manualThemeOverride]);

  // Welcome screen timer
  useEffect(() => {
    // Register service worker
    registerServiceWorker();

    // Track app initialization
    trackInteraction('component_render', { timestamp: Date.now() });

    // Listen for online/offline status
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Listen for theme changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleThemeChange = (e: MediaQueryListEvent) => {
      setThemeState(e.matches ? 'dark' : 'light');
    };
    mediaQuery.addEventListener('change', handleThemeChange);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      mediaQuery.removeEventListener('change', handleThemeChange);
    };
  }, [trackInteraction]);

  // Enhanced theme toggle with better UX
  const handleThemeToggle = useCallback(() => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setThemeState(newTheme);
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
      setShowWelcome(false); // Only hide Welcome after search
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
    { id: 'dashboard', label: t('Dashboard'), icon: BarChart3, mobileLabel: 'Home' },
    { id: 'forecast', label: t('Forecast'), icon: Calendar, mobileLabel: 'Forecast' },
    { id: 'analytics', label: t('Analytics'), icon: BarChart3, mobileLabel: 'Stats' },
    { id: 'map', label: t('Map'), icon: Globe, mobileLabel: 'Map' },
    { id: 'alerts', label: t('Alerts'), icon: AlertTriangle, mobileLabel: 'Alerts' },
    { id: 'insights', label: t('Insights'), icon: Sparkles, mobileLabel: 'AI' },
    { id: 'gallery', label: t('Gallery'), icon: Image, mobileLabel: 'Gallery' }
  ], [t]);

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
    // Removed debugging logs for cleaner console
  }, [weather, queryError, location, isLoadingQuery]);

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

  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const setAsHomeCity = (city: string) => {
    setHomeCity(city);
    localStorage.setItem('meteora-home-city', city);
  };

  if (showWelcome) {
    return (
      <QueryClientProvider client={queryClient}>
        <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900">
          <Suspense fallback={<LoadingSkeleton />}>
            <WelcomeScreen onSearch={handleSearch} />
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
                placeholder={t('Search for a city')}
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
      <div className={`app ${resolvedTheme} ${weatherGradient} min-h-screen min-h-dvh bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 dark:from-gray-900 dark:to-gray-800 transition-all duration-500`}>
        {/* Animated Weather Background Overlay */}
        <WeatherBackground weather={weather} theme={resolvedTheme} />
        {/* Global Loading Overlay */}
        {(isLoading || isLoadingQuery) && (
          <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 backdrop-blur-sm">
            <Suspense fallback={<div className="text-white text-lg">Loading...</div>}>
              <LoadingSkeleton />
            </Suspense>
          </div>
        )}
        <div className="glass-overlay" aria-hidden="true" />
        <WeatherOverlay weather={weather} theme={resolvedTheme} />
        <Toaster 
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: resolvedTheme === 'dark' ? '#1f2937' : '#ffffff',
              color: resolvedTheme === 'dark' ? '#f9fafb' : '#1e2937',
              border: `1px solid ${resolvedTheme === 'dark' ? '#374151' : '#e5e7eb'}`,
              borderRadius: '12px',
              boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
            },
          }}
        />

        {/* Welcome Screen */}
        <AnimatePresence>
          {showWelcome && (
            <Suspense fallback={<LoadingSkeleton />}>
              <WelcomeScreen onSearch={handleSearch} />
            </Suspense>
          )}
        </AnimatePresence>

        {/* Main App Content */}
        {!showWelcome && (
          <div className="meteora-container relative z-10 max-w-full sm:max-w-[1600px] px-2 pb-2 sm:px-4 sm:pb-4 md:px-8 md:pb-8 lg:px-12 lg:pb-12 xl:px-16 xl:pb-16 mx-auto">
            {/* Enhanced Header */}
            <motion.header 
              className="app-header flex flex-col sm:flex-row items-center justify-between gap-4 w-full bg-transparent shadow-none border-none px-2 sm:px-6 lg:px-8 py-2 sm:py-3"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              {/* Header Left: Logo and Search Bar */}
              <div className="flex flex-col sm:flex-row items-center gap-3 w-full">
                <motion.h1 
                  className="app-title text-2xl sm:text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent"
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.2 }}
                >
                  Meteora
                </motion.h1>
                {/* Glassmorphism Search Bar */}
                <div className="flex-1 min-w-[220px] max-w-xl">
                  <SearchBar
                    value={searchQuery}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
                    onSearch={(query: string) => {
                      setLocation(query);
                      setLastSearch(query);
                      localStorage.setItem('weather-location', query);
                      trackInteraction('search', { query });
                    }}
                    aria-label={t('Search for a city')}
                  />
                </div>
              </div>
              {/* Header Right: Controls */}
              <div className="flex items-center gap-2 sm:gap-4 mt-2 sm:mt-0">
                <motion.button
                  className="theme-toggle bg-white/20 dark:bg-gray-700/20 backdrop-blur-sm border border-white/30 dark:border-gray-600/30 rounded-full p-2 hover:scale-105 transition-all duration-300"
                  onClick={() => {
                    setThemeState(resolvedTheme === 'light' ? 'dark' : 'light');
                  }}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  aria-label={t('Toggle theme')}
                  role="button"
                  title={resolvedTheme === 'light' ? t('Switch to dark mode') : t('Switch to light mode')}
                >
                  {resolvedTheme === 'light' ? (
                    <Moon className="w-5 h-5 text-gray-700" />
                  ) : (
                    <Sun className="w-5 h-5 text-yellow-300" />
                  )}
                </motion.button>
                <div className="flex items-center gap-1 ml-2">
                  {accentColors.map((c) => (
                    <button
                      key={c.value}
                      className="w-6 h-6 rounded-full border-2 border-white/70 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 transition-transform hover:scale-110"
                      style={{ background: c.value }}
                      aria-label={`Set accent color to ${c.name}`}
                      role="button"
                      onClick={() => setAccentColorState(c.value)}
                      title={`Set accent color to ${c.name}`}
                    ></button>
                  ))}
                  <button
                    className="w-6 h-6 rounded-full border-2 border-gray-300 flex items-center justify-center bg-white text-gray-500 text-xs font-bold ml-1 focus:outline-none focus:ring-2 focus:ring-blue-400 hover:scale-110 transition-transform"
                    aria-label={t('Reset accent color')}
                    role="button"
                    onClick={() => setAccentColorState('#3b82f6')}
                    title={t('Reset accent color')}
                  >
                    ×
                  </button>
                </div>
                <button
                  className="ml-2 p-2 rounded-full bg-white/20 dark:bg-gray-700/20 hover:bg-white/40 dark:hover:bg-gray-700/40 transition"
                  onClick={() => setSettingsOpen(true)}
                  aria-label={t('Open settings')}
                  role="button"
                  style={{ minWidth: 44, minHeight: 44 }}
                  title={t('Open settings')}
                >
                  <Settings className="w-5 h-5 text-gray-700 dark:text-gray-200" />
                </button>
              </div>
            </motion.header>

            {/* Quick Actions Bar (mobile: above tab bar, desktop: in header area) */}
            {isMobile ? (
              <div className="fixed left-1/2 -translate-x-1/2 bottom-24 z-40 w-[95vw] max-w-lg flex gap-2 items-center justify-center bg-white/30 dark:bg-gray-900/40 backdrop-blur-xl rounded-full shadow-lg px-3 py-2 border border-white/20 dark:border-gray-700/30 glassy-nav-glow">
                {homeCity && (
                  <button
                    className="px-4 py-2 rounded-full font-semibold text-sm bg-yellow-100 dark:bg-yellow-900/40 text-yellow-700 dark:text-yellow-200 shadow-sm hover:bg-yellow-200 dark:hover:bg-yellow-800/60 transition relative group border-2 border-yellow-400"
                    onClick={() => setLocation(homeCity)}
                    aria-label={`Go to home city: ${homeCity}`}
                    role="button"
                    style={{ minWidth: 44, minHeight: 44 }}
                    title={t('Go to your home city')}
                  >
                    <span className="mr-1">🏠</span>{homeCity}
                  </button>
                )}
                {favorites.map(fav => (
                  <button
                    key={fav}
                    className={`px-4 py-2 rounded-full font-semibold text-sm bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-200 shadow-sm hover:bg-blue-200 dark:hover:bg-blue-800/60 transition relative group${fav === homeCity ? ' border-2 border-yellow-400' : ''}`}
                    onClick={() => setLocation(fav)}
                    aria-label={`Switch to ${fav}`}
                    role="button"
                    style={{ minWidth: 44, minHeight: 44 }}
                    title={`Switch to ${fav}`}
                  >
                    {fav}
                    <span
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition"
                      onClick={e => { e.stopPropagation(); removeFavorite(fav); }}
                      role="button"
                      tabIndex={0}
                      aria-label={`Remove ${fav} from favorites`}
                      title={`Remove ${fav} from favorites`}
                    >×</span>
                  </button>
                ))}
                <button
                  className="px-3 py-2 rounded-full bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-200 font-semibold text-sm shadow-sm hover:bg-green-200 dark:hover:bg-green-800/60 transition"
                  onClick={() => addFavorite(location)}
                  aria-label={t('Add current location to favorites')}
                  disabled={favorites.includes(location)}
                  role="button"
                  style={{ minWidth: 44, minHeight: 44 }}
                  title={t('Add current location to favorites')}
                >
                  + Add
                </button>
                <button
                  className="px-3 py-2 rounded-full bg-yellow-100 dark:bg-yellow-900/40 text-yellow-700 dark:text-yellow-200 font-semibold text-sm shadow-sm hover:bg-yellow-200 dark:hover:bg-yellow-800/60 transition border-2 border-yellow-400"
                  onClick={() => setAsHomeCity(location)}
                  aria-label={t('Set current location as home city')}
                  disabled={homeCity === location}
                  role="button"
                  style={{ minWidth: 44, minHeight: 44 }}
                  title={t('Set current location as home city')}
                >
                  <span className="mr-1">🏠</span>{t('Set as Home')}
                </button>
              </div>
            ) : (
              <div className="flex gap-2 items-center ml-4 mt-4 mb-2">
                {homeCity && (
                  <button
                    className="px-3 py-1.5 rounded-full font-semibold text-xs bg-yellow-100 dark:bg-yellow-900/40 text-yellow-700 dark:text-yellow-200 shadow-sm hover:bg-yellow-200 dark:hover:bg-yellow-800/60 transition relative group border-2 border-yellow-400"
                    onClick={() => setLocation(homeCity)}
                    aria-label={`Go to home city: ${homeCity}`}
                    role="button"
                    style={{ minWidth: 44, minHeight: 44 }}
                    title={t('Go to your home city')}
                  >
                    <span className="mr-1">🏠</span>{homeCity}
                  </button>
                )}
                {favorites.map(fav => (
                  <button
                    key={fav}
                    className={`px-3 py-1.5 rounded-full font-semibold text-xs bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-200 shadow-sm hover:bg-blue-200 dark:hover:bg-blue-800/60 transition relative group${fav === homeCity ? ' border-2 border-yellow-400' : ''}`}
                    onClick={() => setLocation(fav)}
                    aria-label={`Switch to ${fav}`}
                    role="button"
                    style={{ minWidth: 44, minHeight: 44 }}
                    title={`Switch to ${fav}`}
                  >
                    {fav}
                    <span
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-4 h-4 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition"
                      onClick={e => { e.stopPropagation(); removeFavorite(fav); }}
                      role="button"
                      tabIndex={0}
                      aria-label={`Remove ${fav} from favorites`}
                      title={`Remove ${fav} from favorites`}
                    >×</span>
                  </button>
                ))}
                <button
                  className="px-2 py-1.5 rounded-full bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-200 font-semibold text-xs shadow-sm hover:bg-green-200 dark:hover:bg-green-800/60 transition"
                  onClick={() => addFavorite(location)}
                  aria-label={t('Add current location to favorites')}
                  disabled={favorites.includes(location)}
                  role="button"
                  style={{ minWidth: 44, minHeight: 44 }}
                  title={t('Add current location to favorites')}
                >
                  + Add
                </button>
                <button
                  className="px-2 py-1.5 rounded-full bg-yellow-100 dark:bg-yellow-900/40 text-yellow-700 dark:text-yellow-200 font-semibold text-xs shadow-sm hover:bg-yellow-200 dark:hover:bg-yellow-800/60 transition border-2 border-yellow-400"
                  onClick={() => setAsHomeCity(location)}
                  aria-label={t('Set current location as home city')}
                  disabled={homeCity === location}
                  role="button"
                  style={{ minWidth: 44, minHeight: 44 }}
                  title={t('Set current location as home city')}
                >
                  <span className="mr-1">🏠</span>{t('Set as Home')}
                </button>
              </div>
            )}

            {/* Enhanced Navigation Tabs - Premium Glassy Pill Nav */}
            <motion.nav
              className={`weather-tabs-nav ${isMobile ? 'fixed left-1/2 -translate-x-1/2 bottom-0 z-50 w-full max-w-lg px-1 py-2 bg-white/90 dark:bg-gray-900/90 backdrop-blur-2xl rounded-t-2xl shadow-2xl border-t border-white/30 dark:border-gray-700/40 flex gap-1 items-center justify-center glassy-nav-glow overflow-x-auto scrollbar-hide' : 'mt-8 mb-4 flex gap-3 items-center justify-center'} ${isMobile ? '' : 'relative'}`}
              style={isMobile ? { pointerEvents: 'auto' } : {}}
              role="tablist"
              aria-label={t('Main navigation tabs')}
              initial={{ opacity: 0, y: isMobile ? 40 : 0 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
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
                // Tooltip logic (moved out of map)
                const tooltipContent = Math.random() < 0.5
                  ? tabDescriptions[tab.id as keyof typeof tabDescriptions]
                  : weatherFacts[Math.floor(Math.random() * weatherFacts.length)];
                return (
                  <motion.button
                    key={tab.id}
                    ref={el => tabRefs.current[idx] = el}
                    className={`tab-button flex flex-col items-center gap-0.5 px-2 sm:px-4 py-1.5 sm:py-2 font-semibold text-xs sm:text-base relative focus-visible:outline-4 focus-visible:outline-blue-500 focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:z-20 transition-all duration-300 rounded-full group ${isActive ? 'text-white dark:text-blue-200' : 'text-blue-900 dark:text-blue-200/80'} min-w-[44px] min-h-[44px]`}
                    id={`tab-${tab.id}`}
                    role="tab"
                    tabIndex={0}
                    aria-selected={isActive}
                    aria-controls={`tabpanel-${tab.id}`}
                    onClick={() => {
                      setActiveTab(tab.id as TabType);
                      trackInteraction('component_render', { tab: tab.id });
                    }}
                    whileHover={{ scale: 1.09 }}
                    whileTap={{ scale: 0.97 }}
                    onMouseEnter={() => setShowTooltips(tips => tips.map((v, i) => i === idx ? true : v))}
                    onMouseLeave={() => setShowTooltips(tips => tips.map((v, i) => i === idx ? false : v))}
                    onFocus={() => setShowTooltips(tips => tips.map((v, i) => i === idx ? true : v))}
                    onBlur={() => setShowTooltips(tips => tips.map((v, i) => i === idx ? false : v))}
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
                    <span className="relative flex flex-col items-center">
                      <motion.span
                        className={`inline-flex shadow-lg ${isActive ? 'glow-icon' : ''}`}
                        animate={isActive ? { scale: [1, 1.18, 0.95, 1.1, 1] } : { scale: 1 }}
                        transition={isActive ? { duration: 0.7, times: [0, 0.2, 0.5, 0.8, 1], repeat: Infinity, repeatType: 'loop' } : {}}
                      >
                        <Lottie
                          animationData={tabLottieMap[tab.id as keyof typeof tabLottieMap]}
                          loop={true}
                          autoplay={isActive}
                          style={{ width: isMobile ? 24 : 32, height: isMobile ? 24 : 32, marginRight: 0 }}
                          rendererSettings={{ preserveAspectRatio: 'xMidYMid slice' }}
                        />
                      </motion.span>
                      {alertBadge}
                      {/* Glowing animated underline for active tab */}
                      {isActive && (
                        <motion.span
                          layoutId="nav-underline"
                          className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-7 sm:w-10 h-1.5 sm:h-2 rounded-full bg-gradient-to-r from-blue-400 via-purple-500 to-teal-400 blur-sm opacity-80 shadow-xl animate-pulse"
                          initial={{ scaleX: 0.7, opacity: 0 }}
                          animate={{ scaleX: 1, opacity: 1 }}
                          exit={{ scaleX: 0.7, opacity: 0 }}
                          transition={{ duration: 0.4 }}
                        />
                      )}
                    </span>
                    <span className={`inline mt-0.5 drop-shadow-sm ${isMobile ? 'hidden xs:inline text-xs' : ''}`}>
                      {isMobile ? (tab.mobileLabel || tab.label) : tab.label}
                    </span>
                    {microStat}
                    {/* Tooltip */}
                    <AnimatePresence>
                      {showTooltips[idx] && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 10 }}
                          transition={{ duration: 0.25 }}
                          className="absolute left-1/2 -translate-x-1/2 -top-12 bg-gray-900 text-white text-xs px-3 py-2 rounded-lg shadow-lg z-50 whitespace-nowrap pointer-events-none"
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
            <main className="app-main flex-1 px-0 sm:px-2 md:px-4 lg:px-8 xl:px-12">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="weather-content grid gap-4 sm:gap-8 lg:gap-12 xl:gap-16 grid-cols-1 lg:grid-cols-3 px-1 sm:px-4 md:px-8 xl:px-16 py-3 sm:py-6"
                >
                  {activeTab === 'dashboard' && (
                    <>
                      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="lg:col-span-2">
                        <Suspense fallback={<LoadingSkeleton />}>
                          <WeatherHero weather={weather} theme={resolvedTheme} />
                        </Suspense>
                      </motion.div>
                      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }} className="lg:col-span-1">
                        <div className="col-span-full flex justify-center">
                          <div className="w-full max-w-5xl">
                            <Suspense fallback={<LoadingSkeleton />}>
                              <WeatherForecast forecast={forecast} weather={weather} timeFormat={timeFormat} />
                            </Suspense>
                          </div>
                        </div>
                      </motion.div>
                    </>
                  )}
                  {activeTab === 'forecast' && (
                    <div className="col-span-full flex justify-center">
                      <div className="w-full max-w-5xl">
                        <Suspense fallback={<LoadingSkeleton />}>
                          <WeatherForecast forecast={forecast} weather={weather} timeFormat={timeFormat} />
                        </Suspense>
                      </div>
                    </div>
                  )}
                  {activeTab === 'analytics' && (
                    <div className="col-span-full flex justify-center">
                      <div className="w-full max-w-5xl">
                        <Suspense fallback={<LoadingSkeleton />}>
                          <WeatherAnalytics weather={weather} forecast={forecast} />
                        </Suspense>
                      </div>
                    </div>
                  )}
                  {activeTab === 'map' && (
                    <div className="col-span-full flex justify-center">
                      <div className="w-full max-w-6xl">
                        <Suspense fallback={<LoadingSkeleton />}>
                          <WeatherMap weather={weather} forecast={forecast} />
                        </Suspense>
                      </div>
                    </div>
                  )}
                  {activeTab === 'alerts' && (
                    <div className="col-span-full flex justify-center">
                      <div className="w-full max-w-5xl">
                        <Suspense fallback={<LoadingSkeleton />}>
                          <WeatherAlerts weather={weather} forecast={forecast} />
                        </Suspense>
                      </div>
                    </div>
                  )}
                  {activeTab === 'insights' && (
                    <>
                      {(!weather || !forecast) ? (
                        <div className="col-span-full flex justify-center items-center min-h-[400px]">
                          <LoadingSkeleton type="insights" />
                        </div>
                      ) : (
                        <div className="col-span-full flex justify-center">
                          <div className="w-full max-w-5xl">
                            <WeatherInsights weather={weather} forecast={forecast} />
                          </div>
                        </div>
                      )}
                    </>
                  )}
                  {activeTab === 'gallery' && (
                    <div className="col-span-full flex justify-center">
                      <div className="w-full max-w-6xl">
                        <Suspense fallback={<LoadingSkeleton />}>
                          <ImageSlider />
                        </Suspense>
                      </div>
                    </div>
                  )}
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
                    aria-label={t('Refresh weather data')}
                    role="button"
                    style={{ minWidth: 44, minHeight: 44 }}
                    title={t('Refresh weather data')}
                  >
                    <RefreshCw className="w-4 h-4 inline mr-1" />
                    {t('Refresh')}
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

        {/* Settings Modal */}
        <SettingsModal
          isOpen={settingsOpen}
          onClose={() => setSettingsOpen(false)}
          theme={theme}
          setTheme={setThemeState}
          accentColor={accentColor}
          setAccentColor={setAccentColorState}
          accentColors={accentColors}
          timeFormat={timeFormat}
          setTimeFormat={setTimeFormat}
        />

        {/* React Query DevTools */}
        {import.meta.env.DEV && (
          <ReactQueryDevtools initialIsOpen={false} />
        )}
      </div>
    </QueryClientProvider>
  );
}

export default App;