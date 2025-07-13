import React, { useState, useEffect, Suspense, lazy, useCallback, useMemo, startTransition, useRef } from 'react';
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
import ErrorBoundary from './components/ErrorBoundary';

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

// QueryClient is now provided by main.tsx

// PWA Service Worker Registration - REMOVED (already registered in main.tsx)
// const registerServiceWorker = async () => {
//   if ('serviceWorker' in navigator && !navigator.serviceWorker.controller) {
//     try {
//       const registration = await navigator.serviceWorker.register('/sw.js');
//       console.log('Service Worker registered:', registration);
//       
//       // Handle updates
//       registration.addEventListener('updatefound', () => {
//         const newWorker = registration.installing;
//         if (newWorker) {
//           newWorker.addEventListener('statechange', () => {
//             if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
//               // New content is available
//               if (confirm('New version available! Reload to update?')) {
//                 window.location.reload();
//               }
//             }
//           });
//         }
//       });
//     } catch (error) {
//       console.error('Service Worker registration failed:', error);
//     }
//   }
// };

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
  { name: 'Pink', value: '#ec4899' },
  { name: 'Cyan', value: '#06b6d4' },
  { name: 'Indigo', value: '#6366f1' },
  { name: 'Yellow', value: '#fbbf24' },
  { name: 'Rose', value: '#f472b6' }
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
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [accentColor, setAccentColorState] = useState(() => localStorage.getItem('meteora-accent') || '#3b82f6');

  // Add state for time format
  const [timeFormat, setTimeFormat] = useState<'12' | '24'>(() => {
    const saved = localStorage.getItem('meteora-time-format');
    return (saved === '12' || saved === '24') ? saved : '12';
  });

  // Favorites and home city management
  const [favorites, setFavorites] = useState<string[]>(() => {
    const saved = localStorage.getItem('meteora-favorites');
    return saved ? JSON.parse(saved) : [];
  });

  const [homeCity, setHomeCity] = useState<string>(() => {
    return localStorage.getItem('meteora-home-city') || '';
  });

  // Navigation refs for indicator
  const navRef = useRef<HTMLDivElement>(null);
  const [indicatorLeft, setIndicatorLeft] = useState(0);
  const [indicatorWidth, setIndicatorWidth] = useState(0);

  // Weather data
  const { 
    weather, 
    forecast,
    isLoading: isLoadingQuery, 
    error: queryError, 
    refetch 
  } = useWeatherOptimized(location);

  // Simplified tab list with notification badges
  const tabList = [
    { id: 'dashboard', label: t('Dashboard'), icon: BarChart3, mobileLabel: 'Home', badge: null },
    { id: 'forecast', label: t('Forecast'), icon: Calendar, mobileLabel: 'Forecast', badge: null },
    { id: 'analytics', label: t('Analytics'), icon: BarChart3, mobileLabel: 'Stats', badge: null },
    { id: 'map', label: t('Map'), icon: Globe, mobileLabel: 'Map', badge: null },
    { id: 'alerts', label: t('Alerts'), icon: AlertTriangle, mobileLabel: 'Alerts', badge: getActiveAlerts(weather, forecast)?.length || null }
  ];

  // Performance monitoring - disabled for better performance
  // usePerformanceMonitor();

  // Track user interactions
  const trackInteraction = useCallback((action: string, data?: any) => {
    // Analytics tracking placeholder
  }, []);

  // Handle search
  const handleSearch = useCallback((query: string) => {
    if (query.trim()) {
      startTransition(() => {
        setLocation(query.trim());
        setLastSearch(query.trim());
        localStorage.setItem('weather-location', query.trim());
        trackInteraction('search', { query: query.trim() });
        setShowWelcome(false);
      });
    }
  }, [trackInteraction]);

  // Favorites management
  const addFavorite = (loc: string) => {
    if (!favorites.includes(loc)) {
      const updatedFavorites = [...favorites, loc];
      setFavorites(updatedFavorites);
      localStorage.setItem('meteora-favorites', JSON.stringify(updatedFavorites));
      toast.success(`${loc} added to favorites`);
    }
  };

  const removeFavorite = (loc: string) => {
    const updatedFavorites = favorites.filter(f => f !== loc);
    setFavorites(updatedFavorites);
    localStorage.setItem('meteora-favorites', JSON.stringify(updatedFavorites));
    toast.success(`${loc} removed from favorites`);
  };

  // Update indicator position
  useEffect(() => {
    if (navRef.current) {
      const activeButton = navRef.current.querySelector('.tab-button.active') as HTMLElement;
      if (activeButton) {
        setIndicatorLeft(activeButton.offsetLeft);
        setIndicatorWidth(activeButton.offsetWidth);
      }
    }
  }, [activeTab]);

  // Theme management
  useEffect(() => {
    const savedTheme = localStorage.getItem('meteora-theme');
    if (savedTheme === 'light' || savedTheme === 'dark' || savedTheme === 'system') {
      setThemeState(savedTheme);
    }

    const savedAccent = localStorage.getItem('meteora-accent');
    if (savedAccent) {
      setAccentColorState(savedAccent);
      document.documentElement.style.setProperty('--primary-light', savedAccent);
    } else {
      document.documentElement.style.setProperty('--primary-light', '#3b82f6');
    }

    const savedTimeFormat = localStorage.getItem('meteora-time-format');
    if (savedTimeFormat === '12' || savedTimeFormat === '24') {
      setTimeFormat(savedTimeFormat);
    }

    // registerServiceWorker(); // REMOVED
  }, []);

  // Theme resolution
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    const handleThemeChange = (e: MediaQueryListEvent) => {
      if (!manualThemeOverride) {
        setResolvedTheme(e.matches ? 'dark' : 'light');
      }
    };
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    mediaQuery.addEventListener('change', handleThemeChange);
    
    if (theme === 'system') {
      setResolvedTheme(getSystemTheme());
    } else {
      setResolvedTheme(theme);
      setManualThemeOverride(true);
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      mediaQuery.removeEventListener('change', handleThemeChange);
    };
  }, [theme, manualThemeOverride]);

  // Device detection and responsive behavior
  useEffect(() => {
    const checkDevice = () => {
      const width = window.innerWidth;
      setIsMobile(width < 768);
      setIsTablet(width >= 768 && width < 1024);
    };

    const setVH = () => {
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty('--vh', `${vh}px`);
      setViewportHeight(window.innerHeight);
    };
    
    checkDevice();
    setVH();

    window.addEventListener('resize', () => {
      checkDevice();
      setVH();
    });
    
    return () => {
      window.removeEventListener('resize', () => {
        checkDevice();
        setVH();
      });
    };
  }, []);

  // Theme persistence
  useEffect(() => {
    localStorage.setItem('meteora-theme', theme);
    document.documentElement.classList.toggle('dark', resolvedTheme === 'dark');
  }, [theme, resolvedTheme]);

  // Accent color persistence
  useEffect(() => {
    localStorage.setItem('meteora-accent', accentColor);
    document.documentElement.style.setProperty('--primary-light', accentColor);
  }, [accentColor]);

  // Time format persistence
  useEffect(() => {
    localStorage.setItem('meteora-time-format', timeFormat);
  }, [timeFormat]);

  // Welcome screen management
  useEffect(() => {
    const hasSeenWelcome = localStorage.getItem('meteora-welcome-seen');
    if (hasSeenWelcome) {
      setShowWelcome(false);
    }
  }, []);

  // Error handling
  useEffect(() => {
    if (queryError && errorRetryCount < 3) {
      const timer = setTimeout(() => {
        setErrorRetryCount(prev => prev + 1);
        refetch();
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [queryError, errorRetryCount, refetch]);

  // Network status
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    const handleThemeChange = (e: MediaQueryListEvent) => {
      if (!manualThemeOverride) {
        setResolvedTheme(e.matches ? 'dark' : 'light');
      }
    };
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    mediaQuery.addEventListener('change', handleThemeChange);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      mediaQuery.removeEventListener('change', handleThemeChange);
    };
  }, [manualThemeOverride]);

  // Weather gradient based on conditions
  const weatherGradient = useMemo(() => {
    if (!weather) return '';
    
    const condition = weather.condition?.main?.toLowerCase() || 'clear';
    const hour = new Date().getHours();
    const isDaytime = hour >= 6 && hour < 18;
    
    if (condition.includes('rain')) return isDaytime ? 'rainy-gradient' : 'night-rainy-gradient';
    if (condition.includes('snow')) return isDaytime ? 'snowy-gradient' : 'night-snowy-gradient';
    if (condition.includes('cloud')) return isDaytime ? 'cloudy-gradient' : 'night-cloudy-gradient';
      if (condition.includes('thunderstorm')) return 'stormy-gradient';
    return isDaytime ? 'sunny-gradient' : 'night-gradient';
  }, [weather]);

  // Get active alerts
  function getActiveAlerts(weather: any, forecast: any) {
    const alerts = [];
    
    if (weather?.alerts) {
      alerts.push(...weather.alerts);
    }
    
    if (forecast?.alerts) {
      alerts.push(...forecast.alerts);
    }
    
    return alerts.filter((alert: any, index: number, self: any[]) => 
      index === self.findIndex((a: any) => a.event === alert.event)
    );
  }

  const setAsHomeCity = (city: string) => {
    setHomeCity(city);
    localStorage.setItem('meteora-home-city', city);
    toast.success(`${city} set as home city`);
  };

  // Loading states
  const isDataLoading = isLoadingQuery;

  // Show welcome screen or loading
  if (showWelcome) {
    return (
      <ErrorBoundary>
        <div className={`app ${resolvedTheme} min-h-screen min-h-dvh bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 dark:from-gray-900 dark:to-gray-800 transition-all duration-500`}>
          <Suspense fallback={<div className="text-white text-lg">Loading...</div>}>
            <WelcomeScreen 
          onSearch={handleSearch} 
          onGetStarted={() => setShowWelcome(false)}
          onSkip={() => setShowWelcome(false)}
        />
          </Suspense>
        </div>
      </ErrorBoundary>
    );
  }

  // Error state
  if (queryError && errorRetryCount >= 3) {
    return (
      <ErrorBoundary>
        <div className={`app ${resolvedTheme} min-h-screen min-h-dvh bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 dark:from-gray-900 dark:to-gray-800 transition-all duration-500`}>
          <div className="flex items-center justify-center min-h-screen">
            <div className="text-center text-white">
              <h1 className="text-2xl font-bold mb-4">Weather data unavailable</h1>
              <p className="mb-4">Unable to load weather information. Please check your connection.</p>
              <button
                className="px-4 py-2 bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
                onClick={() => {
                  setErrorRetryCount(0);
                  refetch();
                }}
                              >
                {isDataLoading ? 'Searching...' : 'Search'}
              </button>
            </div>
          </div>
          {queryError && (
            <div className="text-red-300 mt-2">{String(queryError)}</div>
          )}
        </div>
      </ErrorBoundary>
    );
  }

  // Replace setAccentColorState with a new function that updates both state and CSS variable
  const handleAccentColorChange = (color: string) => {
    setAccentColorState(color);
    document.documentElement.style.setProperty('--primary-light', color);
    localStorage.setItem('meteora-accent', color);
  };

  return (
    <ErrorBoundary>
      {/* Toaster always visible and above mobile nav */}
      <Toaster position={isMobile ? 'top-center' : 'bottom-right'} toastOptions={{ duration: 3500, style: { zIndex: 9999 } }} />
      
      <div 
        className={`app ${resolvedTheme} min-h-screen min-h-dvh bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 dark:from-gray-900 dark:to-gray-800 transition-all duration-500`}
        style={{
          background: 'linear-gradient(135deg, var(--primary-light), var(--accent-light))'
        }}
      >
        {/* Animated Weather Background Overlay */}
        <WeatherBackground weather={weather} theme={resolvedTheme} />
        
        {/* Global Loading Overlay */}
        {isDataLoading && (
          <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 backdrop-blur-sm">
            <Suspense fallback={<div className="text-white text-lg">Loading...</div>}>
              <LoadingSkeleton />
            </Suspense>
          </div>
        )}
        
        <div className="glass-overlay" aria-hidden="true" />
        <WeatherOverlay weather={weather} theme={resolvedTheme} />

        {/* New Modern Layout */}
        <div className="flex h-screen overflow-hidden w-full max-w-full">
          {/* Left Sidebar - Desktop Only */}
          {!isMobile && (
            <aside className="w-80 bg-white/10 dark:bg-gray-900/20 backdrop-blur-xl border-r border-white/20 dark:border-gray-700/30 flex flex-col h-full">
              {/* Sidebar Header */}
              <div className="p-6 border-b border-white/10 dark:border-gray-700/30">
                <motion.h1 
                  className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent"
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.2 }}
                >
                  Meteora
                </motion.h1>
                <p className="text-white/60 text-sm mt-1">Weather Intelligence</p>
              </div>

              {/* Sidebar Navigation - Make scrollable */}
              <nav className="flex-1 p-6 overflow-y-auto min-h-0">
                <div className="space-y-3">
                  {tabList.map((tab) => {
                    const isActive = activeTab === tab.id;
                    return (
                      <motion.button
                        key={tab.id}
                        className={`sidebar-link tab-button relative w-full flex items-center gap-4 px-4 py-4 rounded-2xl text-left transition-all duration-300 group overflow-hidden ${
                          isActive 
                            ? 'active text-white' 
                            : 'text-white/70 hover:text-white'
                        }`}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => {
                          startTransition(() => {
                            setActiveTab(tab.id as TabType);
                            trackInteraction('component_render', { tab: tab.id });
                          });
                        }}
                        aria-label={tab.label}
                        aria-selected={isActive}
                        role="tab"
                      >
                        {/* Active Background */}
                        {isActive && (
                          <motion.div
                            layoutId="desktopTabBackground"
                            className="absolute inset-0 bg-gradient-to-r from-blue-500/30 via-purple-500/20 to-blue-400/30 dark:from-blue-400/40 dark:via-purple-400/30 dark:to-blue-300/40 rounded-2xl border border-white/20 dark:border-gray-600/30"
                            initial={false}
                            transition={{ type: "spring", stiffness: 500, damping: 30 }}
                          />
                        )}
                        {/* Hover Background */}
                        {!isActive && (
                          <motion.div
                            className="absolute inset-0 bg-white/5 dark:bg-gray-700/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                            initial={false}
                          />
                        )}
                        {/* Icon Container */}
                        <div className={`tab-icon relative z-10 rounded-xl transition-all duration-300 ${
                          isActive 
                            ? 'bg-white/20 dark:bg-white/10 text-white shadow-lg glow-icon' 
                            : 'bg-white/10 dark:bg-gray-700/30 text-white/60 group-hover:bg-white/20 group-hover:text-white'
                        }`}>
                          <tab.icon size={22} />
                          {/* Notification Badge */}
                          {tab.badge && (
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              className="notification-badge"
                            >
                              {tab.badge > 9 ? '9+' : tab.badge}
                            </motion.div>
                          )}
                        </div>
                        {/* Label */}
                        <span className={`tab-label relative z-10 font-semibold text-base transition-all duration-300 ${
                          isActive ? 'text-white' : 'text-white/70 group-hover:text-white'
                        }`}>
                          {tab.label}
                        </span>
                        {/* Active Indicator */}
                        {isActive && (
                          <motion.div
                            layoutId="desktopTabIndicator"
                            className="relative z-10 ml-auto w-3 h-3 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full shadow-lg"
                            initial={false}
                            transition={{ type: "spring", stiffness: 500, damping: 30 }}
                          />
                        )}
                        {/* Hover Arrow */}
                        {!isActive && (
                          <motion.div
                            className="relative z-10 ml-auto opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                            initial={false}
                          >
                            <div className="w-2 h-2 border-r-2 border-t-2 border-white/40 transform rotate-45" />
                          </motion.div>
                        )}
                      </motion.button>
                    );
                  })}
                </div>
              </nav>

              {/* Sidebar Footer */}
              <div className="p-6 border-t border-white/10 dark:border-gray-700/30">
                <div className="space-y-3">
                  {/* Network Status */}
                  <div className={`flex items-center gap-2 text-sm ${
                    isOnline ? 'text-green-400' : 'text-red-400'
                  }`}>
                    <span className={`w-2 h-2 rounded-full ${
                      isOnline ? 'bg-green-400' : 'bg-red-400'
                    }`}></span>
                    {isOnline ? 'Online' : 'Offline'}
                  </div>
                  
                  {/* Current Location */}
                  <div className="text-white/60 text-sm">
                    <div className="font-medium">Current Location</div>
                    <div className="truncate">{location}</div>
                  </div>
                </div>
              </div>
            </aside>
          )}

          {/* Main Content Area */}
          <main className="flex-1 flex flex-col overflow-hidden w-full max-w-full">
            {/* Top Header - Mobile Only */}
            {isMobile && (
              <header className="bg-white/10 dark:bg-gray-900/20 backdrop-blur-xl border-b border-white/20 dark:border-gray-700/30 p-4 sticky top-0 left-0 right-0 z-50 w-full max-w-full">
                <div className="flex items-center justify-between gap-4 w-full max-w-full">
                  <motion.h1 
                    className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent"
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.2 }}
                  >
                    Meteora
                  </motion.h1>
                  
                  <div className="flex items-center gap-2">
                <button
                      className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
                      onClick={() => refetch()}
                      aria-label={t('Refresh weather data')}
                    >
                      <RefreshCw className="w-4 h-4 text-white" />
                </button>
                <button
                      className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
                      onClick={() => setSettingsOpen(true)}
                      aria-label={t('Open settings')}
                    >
                      <Settings className="w-4 h-4 text-white" />
                </button>
              </div>
                </div>
                
                {/* Mobile Search */}
                <div className="mt-4">
                  <SearchBar
                    value={searchQuery}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
                    onSearch={(query: string) => {
                      startTransition(() => {
                        setLocation(query);
                        setLastSearch(query);
                        localStorage.setItem('weather-location', query);
                        trackInteraction('search', { query });
                      });
                    }}
                    aria-label={t('Search for a city')}
                  />
                </div>
              </header>
            )}

            {/* Content Area */}
            <div className={`flex-1 overflow-auto p-6 ${isMobile ? 'pb-32' : ''}`}>
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="h-full"
                >
                  {activeTab === 'dashboard' && (
                    <div className="flex flex-col gap-6">
                      {!isMobile && (
                        <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 px-4 py-4 bg-white/10 dark:bg-gray-800/20 rounded-2xl shadow-md mb-6 border border-white/10 dark:border-gray-700/30 dashboard-header">
                          <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight">Dashboard</h2>
                          <div className="flex flex-col md:flex-row md:items-center gap-2 w-full md:w-auto max-w-full">
                            <div className="w-full md:w-96 max-w-full">
                              <SearchBar
                                value={searchQuery}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
                                onSearch={(query: string) => {
                                  startTransition(() => {
                                    setLocation(query);
                                    setLastSearch(query);
                                    localStorage.setItem('weather-location', query);
                                    trackInteraction('search', { query });
                                  });
                                }}
                                aria-label={t('Search for a city')}
                              />
                            </div>
                            <button
                              className="btn-primary flex items-center gap-2"
                              onClick={() => refetch()}
                              aria-label={t('Refresh weather data')}
                              disabled={isDataLoading}
                              aria-busy={isDataLoading}
                              aria-live="polite"
                            >
                              {isDataLoading ? (
                                <span className="w-5 h-5 animate-spin inline-block border-2 border-white border-t-transparent rounded-full"></span>
                              ) : (
                                <RefreshCw className="w-5 h-5" />
                              )}
                              <span className="hidden sm:inline">Refresh</span>
                            </button>
                            <button
                              className="btn-secondary flex items-center gap-2"
                              onClick={() => setSettingsOpen(true)}
                              aria-label={t('Open settings')}
                            >
                              <Settings className="w-5 h-5" />
                              <span className="hidden sm:inline">Settings</span>
                            </button>
                          </div>
                        </header>
                      )}
                      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
                        {/* Main Weather Card */}
                        <div className="lg:col-span-2">
                          <div className="bg-white/10 dark:bg-gray-800/20 backdrop-blur-xl rounded-2xl p-6 border border-white/20 dark:border-gray-700/30 h-full">
                            <Suspense fallback={<LoadingSkeleton type="hero" />}>
                              <WeatherHero weather={weather} theme={resolvedTheme} />
                            </Suspense>
                          </div>
                        </div>
                        {/* Side Panel */}
                        <div className="space-y-6">
                          {/* Quick Stats */}
                          <div className="bg-white/10 dark:bg-gray-800/20 backdrop-blur-xl rounded-2xl p-6 border border-white/20 dark:border-gray-700/30">
                            <h3 className="text-lg font-semibold text-white mb-4">Quick Stats</h3>
                            <div className="space-y-3">
                              <div className="flex justify-between items-center">
                                <span className="text-white/70">Humidity</span>
                                <span className="text-white font-medium">{weather?.humidity}%</span>
                              </div>
                              <div className="flex justify-between items-center">
                                <span className="text-white/70">Wind Speed</span>
                                <span className="text-white font-medium">{weather?.wind?.speed} km/h</span>
                              </div>
                              <div className="flex justify-between items-center">
                                <span className="text-white/70">Pressure</span>
                                <span className="text-white font-medium">{weather?.pressure} hPa</span>
                              </div>
                              <div className="flex justify-between items-center">
                                <span className="text-white/70">Visibility</span>
                                <span className="text-white font-medium">{weather?.visibility} km</span>
                              </div>
                            </div>
                          </div>
                          {/* Favorites */}
                          <div className="bg-white/10 dark:bg-gray-800/20 backdrop-blur-xl rounded-2xl p-6 border border-white/20 dark:border-gray-700/30">
                            <div className="flex items-center justify-between mb-4">
                              <h3 className="text-lg font-semibold text-white">Favorites</h3>
                              {!favorites.includes(location) && (
                                <button
                                  onClick={() => addFavorite(location)}
                                  className="flex items-center gap-1 px-3 py-1 text-sm bg-white/10 hover:bg-white/20 rounded-lg transition-colors text-white/80 hover:text-white"
                                  title="Add current location to favorites"
                                >
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                  </svg>
                                  Add
                                </button>
                              )}
                            </div>
                            <div className="space-y-2">
                              {favorites.slice(0, 3).map((fav, index) => (
                                <div key={index} className="flex items-center justify-between p-2 rounded-lg hover:bg-white/10 transition-colors">
                                  <button
                                    className="flex-1 text-left text-white/80 hover:text-white transition-colors"
                                    onClick={() => handleSearch(fav)}
                                  >
                                    {fav}
                                  </button>
                                  <button
                                    onClick={() => removeFavorite(fav)}
                                    className="p-1 text-white/50 hover:text-red-400 transition-colors"
                                    title="Remove from favorites"
                                  >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                  </button>
                                </div>
                              ))}
                              {favorites.length === 0 && (
                                <p className="text-white/50 text-sm">No favorites yet. Add the current location to get started!</p>
                              )}
                              {favorites.length > 3 && (
                                <button
                                  onClick={() => setActiveTab('dashboard')}
                                  className="w-full text-center p-2 text-sm text-white/60 hover:text-white transition-colors"
                                >
                                  View all {favorites.length} favorites
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {activeTab === 'forecast' && (
                    <div className="bg-white/10 dark:bg-gray-800/20 backdrop-blur-xl rounded-2xl p-6 border border-white/20 dark:border-gray-700/30">
                      <Suspense fallback={<LoadingSkeleton type="forecast-item" />}>
                          <WeatherForecast forecast={forecast} weather={weather} timeFormat={timeFormat} />
                        </Suspense>
                    </div>
                  )}
                  
                  {activeTab === 'analytics' && (
                    <div className="bg-white/10 dark:bg-gray-800/20 backdrop-blur-xl rounded-2xl p-6 border border-white/20 dark:border-gray-700/30">
                      <Suspense fallback={<LoadingSkeleton type="insights" />}>
                          <WeatherAnalytics weather={weather} forecast={forecast} />
                        </Suspense>
                    </div>
                  )}
                  
                  {activeTab === 'map' && (
                    <div className="bg-white/10 dark:bg-gray-800/20 backdrop-blur-xl rounded-2xl p-6 border border-white/20 dark:border-gray-700/30">
                      <Suspense fallback={<LoadingSkeleton type="map" />}>
                          <WeatherMap weather={weather} forecast={forecast} />
                        </Suspense>
                    </div>
                  )}
                  
                  {activeTab === 'alerts' && (
                    <div className="bg-white/10 dark:bg-gray-800/20 backdrop-blur-xl rounded-2xl p-6 border border-white/20 dark:border-gray-700/30">
                      <Suspense fallback={<LoadingSkeleton type="insights" />}>
                          <WeatherAlerts weather={weather} forecast={forecast} />
                        </Suspense>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
            </main>
        </div>

        {/* Footer - Always visible, with extra bottom margin on mobile */}
        <footer className={`app-footer text-center w-full ${isMobile ? 'mb-32' : ''}`}>
          <div>Meteora Weather &copy; {new Date().getFullYear()}</div>
          <div className="footer-links flex items-center justify-center gap-4">
            <a href="https://github.com/nicolette-mashaba/meteora-weather" className="footer-link flex items-center gap-1" target="_blank" rel="noopener noreferrer" aria-label="GitHub">
              <svg className="w-5 h-5 hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0C5.37 0 0 5.373 0 12c0 5.303 3.438 9.8 8.205 11.387.6.113.82-.258.82-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.085 1.84 1.237 1.84 1.237 1.07 1.834 2.809 1.304 3.495.997.108-.775.418-1.305.762-1.605-2.665-.305-5.466-1.334-5.466-5.931 0-1.31.469-2.381 1.236-3.221-.124-.303-.535-1.523.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.984-.399 3.003-.404 1.018.005 2.046.138 3.006.404 2.291-1.553 3.297-1.23 3.297-1.23.653 1.653.242 2.873.119 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.803 5.624-5.475 5.921.43.371.823 1.102.823 2.222v3.293c0 .322.218.694.825.576C20.565 21.796 24 17.299 24 12c0-6.627-5.373-12-12-12z"/></svg>
              GitHub
            </a>
            <a href="https://linkedin.com/in/nicolette-mashaba" className="footer-link flex items-center gap-1" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
              <svg className="w-5 h-5 hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.761 0 5-2.239 5-5v-14c0-2.761-2.239-5-5-5zm-11 19h-3v-10h3v10zm-1.5-11.268c-.966 0-1.75-.784-1.75-1.75s.784-1.75 1.75-1.75 1.75.784 1.75 1.75-.784 1.75-1.75 1.75zm13.5 11.268h-3v-5.604c0-1.337-.025-3.063-1.868-3.063-1.868 0-2.154 1.459-2.154 2.968v5.699h-3v-10h2.881v1.367h.041c.401-.761 1.379-1.563 2.841-1.563 3.039 0 3.6 2.001 3.6 4.601v5.595z"/></svg>
              LinkedIn
            </a>
            <a href="/about" className="footer-link">About</a>
            <a href="/credits" className="footer-link">Credits</a>
          </div>
          <div className="mt-4 flex items-center justify-center gap-2">
            {/* Animated weather icon (Sun) */}
            <span className="inline-block animate-spin-slow"><svg className="w-6 h-6 text-yellow-400 drop-shadow-lg" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="5"/><path d="M12 1v2m0 18v2m11-11h-2M3 12H1m16.95 7.07l-1.41-1.41M6.34 6.34L4.93 4.93m12.02 0l-1.41 1.41M6.34 17.66l-1.41 1.41"/></svg></span>
            <span className="footer-gradient-text font-bold text-base md:text-lg animate-gradient-x bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">Developed by Nicolette Mashaba</span>
          </div>
          <div className="mt-2 text-xs text-blue-400 font-semibold animate-fade-in">Powered by sunshine and code ☀️</div>
        </footer>

        {/* Bottom Mobile Navigation Bar */}
        {isMobile && (
          <nav
            className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl border-t border-gray-200/50 dark:border-gray-800/50 flex items-center py-3 px-4 shadow-2xl md:hidden overflow-x-auto scrollbar-thin scrollbar-thumb-blue-400/40 scrollbar-track-transparent"
            role="tablist"
            aria-label="Main navigation"
            style={{ WebkitOverflowScrolling: 'touch' }}
          >
            <div className="flex gap-2 min-w-max">
              {tabList.map((tab, idx) => {
                const isActive = activeTab === tab.id;
                return (
                  <motion.button
                    key={tab.id}
                    className={`tab-button relative flex flex-col items-center justify-center px-4 py-2 min-w-[60px] min-h-[60px] rounded-2xl transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-2 flex-shrink-0 ${
                      isActive
                        ? 'active font-bold text-blue-600 dark:text-blue-300'
                        : 'text-gray-500 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-200'
                    }`}
                    whileHover={{ scale: 1.08 }}
                    whileTap={{ scale: 0.96 }}
                    aria-selected={isActive}
                    aria-label={tab.label}
                    aria-controls={`tabpanel-${tab.id}`}
                    role="tab"
                    tabIndex={0}
                    onClick={() => {
                      startTransition(() => {
                        setActiveTab(tab.id as TabType);
                        trackInteraction('component_render', { tab: tab.id });
                      });
                    }}
                  >
                    {/* Icon Container */}
                    <div className={`tab-icon relative z-10 mb-1 rounded-xl transition-all duration-300 ${
                      isActive
                        ? 'bg-blue-500/20 dark:bg-blue-400/20 glow-icon'
                        : 'bg-gray-100/50 dark:bg-gray-800/50'
                    }`}>
                      <tab.icon size={24} />
                      {tab.badge && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="notification-badge"
                        >
                          {tab.badge > 9 ? '9+' : tab.badge}
                        </motion.div>
                      )}
                    </div>
                    {/* Tab Label */}
                    <span className="tab-label text-xs mt-1">{tab.mobileLabel || tab.label}</span>
                  </motion.button>
                );
              })}
            </div>
          </nav>
        )}

        {/* Settings Modal */}
        <SettingsModal
          isOpen={settingsOpen}
          onClose={() => setSettingsOpen(false)}
          theme={theme}
          setTheme={setThemeState}
          accentColor={accentColor}
          setAccentColor={handleAccentColorChange}
          accentColors={accentColors}
          timeFormat={timeFormat}
          setTimeFormat={setTimeFormat}
          favorites={favorites}
          onAddFavorite={addFavorite}
          onRemoveFavorite={removeFavorite}
          currentLocation={location}
        />

        {/* React Query DevTools */}
        {import.meta.env.DEV && (
          <ReactQueryDevtools initialIsOpen={false} />
        )}
      </div>
      {/* Footer always visible */}
      {/* <footer className="app-footer" /> */}
    </ErrorBoundary>
  );
}

export default App;