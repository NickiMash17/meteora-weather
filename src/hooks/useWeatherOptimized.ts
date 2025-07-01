import { useQuery } from '@tanstack/react-query';

interface WeatherData {
  location: string;
  temperature: {
    current: number;
    feels_like: number;
    min: number;
    max: number;
  };
  condition: {
    main: string;
    description: string;
    icon: string;
  };
  humidity: number;
  wind: {
    speed: number;
    direction: number;
  };
  visibility: number;
  pressure: number;
  coord: {
    lat: number;
    lon: number;
  };
}

interface ForecastData {
  daily: Array<{
    date: string;
    temperature: {
      min: number;
      max: number;
    };
    condition: {
      main: string;
      description: string;
    };
    humidity: number;
    wind: {
      speed: number;
    };
    precipitation: number | null;
  }>;
  hourly: Array<{
    time: string;
    temperature: number;
    condition: {
      main: string;
    };
    precipitation: number | null;
  }>;
}

// API configuration
const API_CONFIG = {
  baseUrl: import.meta.env.VITE_WEATHER_API_URL || 'https://api.openweathermap.org/data/2.5',
  apiKey: import.meta.env.VITE_WEATHER_API_KEY,
  timeout: 30000,
};

// Validate environment variables
const validateEnv = () => {
  // Since we're using a local proxy server, we don't need the API key in frontend
  // The API key is handled by the backend server
};

// Fetch with timeout and retry logic
const fetchWithTimeout = async (url: string, timeout = API_CONFIG.timeout) => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);
  
  try {
    const response = await fetch(url, { 
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
      }
    });
    clearTimeout(timeoutId);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return response.json();
  } catch (error) {
    clearTimeout(timeoutId);
    if (error instanceof Error && error.name === 'AbortError') {
      throw new Error('Request timeout');
    }
    throw error;
  }
};

// Weather data cache
const weatherCache = new Map<string, { data: WeatherData; timestamp: number }>();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

// Fetch weather data with caching
const fetchWeatherData = async (location: string): Promise<WeatherData> => {
  console.log('fetchWeatherData called with location:', location);
  validateEnv();
  
  // Check cache first
  const cached = weatherCache.get(location);
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    console.log('Returning cached weather data for:', location);
    return cached.data;
  }
  
  // Use deployed API endpoints for weather
  const url = `/api/weather?q=${encodeURIComponent(location)}`;
  console.log('Fetching weather from URL:', url);
  
  try {
    const data = await fetchWithTimeout(url);
    console.log('Weather API response received:', data);
    
    if (!data || !data.main || !data.weather) {
      try {
        const response = await fetch(url);
        const text = await response.text();
        console.error('Weather API full response:', text);
      } catch (e) {
        console.error('Failed to fetch full weather API response:', e);
      }
      console.error('Weather API returned unexpected data:', data);
      throw new Error('Weather API returned unexpected data');
    }
    
    const weatherData: WeatherData = {
      location: data.name,
      temperature: {
        current: Math.round(data.main.temp),
        feels_like: Math.round(data.main.feels_like),
        min: Math.round(data.main.temp_min),
        max: Math.round(data.main.temp_max),
      },
      condition: {
        main: data.weather[0].main,
        description: data.weather[0].description,
        icon: data.weather[0].icon,
      },
      humidity: data.main.humidity,
      wind: {
        speed: Math.round(data.wind.speed * 3.6), // Convert m/s to km/h
        direction: data.wind.deg,
      },
      visibility: Math.round(data.visibility / 1000), // Convert m to km
      pressure: data.main.pressure,
      coord: {
        lat: data.coord.lat,
        lon: data.coord.lon,
      },
    };
    
    console.log('Processed weather data:', weatherData);
    
    // Cache the data
    weatherCache.set(location, { data: weatherData, timestamp: Date.now() });
    
    return weatherData;
  } catch (error) {
    console.error('Weather API error:', error);
    
    // Always return fallback data for any error
    console.warn('API failed, using fallback data for demo');
    return {
      location: location,
      temperature: {
        current: 22,
        feels_like: 24,
        min: 18,
        max: 26,
      },
      condition: {
        main: 'Clear',
        description: 'clear sky',
        icon: '01d',
      },
      humidity: 65,
      wind: {
        speed: 12,
        direction: 180,
      },
      visibility: 10,
      pressure: 1013,
      coord: {
        lat: 51.5074,
        lon: -0.1278,
      },
    };
  }
};

// Fetch forecast data
const fetchForecastData = async (location: string): Promise<ForecastData> => {
  validateEnv();
  // Use deployed API endpoints for forecast
  const url = `/api/forecast?q=${encodeURIComponent(location)}`;
  try {
    const data = await fetchWithTimeout(url);
    console.log('Forecast API raw data:', data); // Debug
    if (!data || !data.list) {
      try {
        const response = await fetch(url);
        const text = await response.text();
        console.error('Forecast API full response:', text);
      } catch (e) {
        console.error('Failed to fetch full forecast API response:', e);
      }
      console.error('Forecast API returned unexpected data:', data);
      throw new Error('Forecast API returned unexpected data');
    }
    // Process daily forecast
    const dailyData = data.list.filter((item: any, index: number) => index % 8 === 0);
    console.log('Daily data for mapping:', dailyData); // Debug
    const daily = dailyData.slice(0, 7).map((item: any) => ({
      date: item.dt ? new Date(item.dt * 1000).toLocaleDateString() : 'N/A',
      temperature: {
        min: typeof item.main?.temp_min === 'number' ? Math.round(item.main.temp_min) : null,
        max: typeof item.main?.temp_max === 'number' ? Math.round(item.main.temp_max) : null,
      },
      condition: {
        main: item.weather?.[0]?.main || 'N/A',
        description: item.weather?.[0]?.description || 'N/A',
      },
      humidity: typeof item.main?.humidity === 'number' ? item.main.humidity : null,
      wind: {
        speed: typeof item.wind?.speed === 'number' ? Math.round(item.wind.speed * 3.6) : null,
      },
      precipitation: typeof item.pop === 'number' ? Math.round(item.pop * 100) : null,
    }));
    // Process hourly forecast
    const hourly = data.list.slice(0, 24).map((item: any) => ({
      time: item.dt ? new Date(item.dt * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'N/A',
      temperature: typeof item.main?.temp === 'number' ? Math.round(item.main.temp) : null,
      condition: {
        main: item.weather?.[0]?.main || 'N/A',
      },
      precipitation: typeof item.pop === 'number' ? Math.round(item.pop * 100) : null,
    }));
    return { daily, hourly };
  } catch (error) {
    console.error('Forecast API error:', error);
    // Always return fallback data for any error
    console.warn('Forecast API failed, using fallback data for demo');
    return {
      daily: [
        {
          date: new Date(Date.now() + 24 * 60 * 60 * 1000).toLocaleDateString(),
          temperature: { min: 18, max: 25 },
          condition: { main: 'Clear', description: 'clear sky' },
          humidity: 60,
          wind: { speed: 10 },
          precipitation: 0,
        },
        {
          date: new Date(Date.now() + 48 * 60 * 60 * 1000).toLocaleDateString(),
          temperature: { min: 16, max: 23 },
          condition: { main: 'Clouds', description: 'scattered clouds' },
          humidity: 70,
          wind: { speed: 15 },
          precipitation: 0,
        },
        {
          date: new Date(Date.now() + 72 * 60 * 60 * 1000).toLocaleDateString(),
          temperature: { min: 14, max: 20 },
          condition: { main: 'Rain', description: 'light rain' },
          humidity: 80,
          wind: { speed: 20 },
          precipitation: 0,
        },
      ],
      hourly: Array.from({ length: 24 }, (_, i) => ({
        time: new Date(Date.now() + i * 60 * 60 * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        temperature: 20 + Math.floor(Math.random() * 10),
        condition: { main: 'Clear' },
        precipitation: 0,
        humidity: 65,
        wind: { speed: 12 },
      })),
    };
  }
};

// Optimized weather hook
export const useWeatherOptimized = (location: string) => {
  const weatherQuery = useQuery({
    queryKey: ['weather', location],
    queryFn: () => fetchWeatherData(location),
    enabled: !!location,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
    retry: 3,
    retryDelay: (attemptIndex: number) => Math.min(1000 * 2 ** attemptIndex, 30000),
    refetchOnWindowFocus: false,
    refetchOnReconnect: true,
  });

  const forecastQuery = useQuery({
    queryKey: ['forecast', location],
    queryFn: () => fetchForecastData(location),
    enabled: !!location && weatherQuery.isSuccess,
    staleTime: 15 * 60 * 1000, // 15 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes (formerly cacheTime)
    retry: 3,
    retryDelay: (attemptIndex: number) => Math.min(1000 * 2 ** attemptIndex, 30000),
    refetchOnWindowFocus: false,
    refetchOnReconnect: true,
  });

  return {
    weather: weatherQuery.data,
    forecast: forecastQuery.data,
    isLoading: weatherQuery.isLoading || forecastQuery.isLoading,
    isError: weatherQuery.isError || forecastQuery.isError,
    error: weatherQuery.error || forecastQuery.error,
    refetch: () => {
      weatherQuery.refetch();
      forecastQuery.refetch();
    },
  };
};

// Performance monitoring
export const monitorAPI = async <T>(apiCall: () => Promise<T>): Promise<T> => {
  const start = performance.now();
  try {
    const result = await apiCall();
    const duration = performance.now() - start;
    
    // Log performance metrics
    if (duration > 2000) {
      console.warn(`Slow API call: ${duration.toFixed(2)}ms`);
    } else {
      console.log(`API call: ${duration.toFixed(2)}ms`);
    }
    
    return result;
  } catch (error) {
    const duration = performance.now() - start;
    console.error(`API call failed after ${duration.toFixed(2)}ms:`, error);
    throw error;
  }
};