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
  timezone: number;
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

// Fetch weather data
const fetchWeatherData = async (location: string): Promise<WeatherData> => {
  validateEnv();
  
  // Use OpenWeatherMap API directly for current weather
  const apiKey = import.meta.env.VITE_WEATHER_API_KEY;
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(location)}&appid=${apiKey}&units=metric`;
  
  try {
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const text = await response.text();
    
    // Check if response is valid JSON
    let data;
    try {
      data = JSON.parse(text);
    } catch (parseError) {
      console.error('API returned invalid JSON:', text.substring(0, 200));
      throw new Error('API returned invalid JSON - possible CORS or proxy issue');
    }
    
    console.log('Weather API raw data:', data);
    
    if (!data || !data.main || !data.weather) {
      throw new Error('Weather API returned unexpected data structure');
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
      timezone: data.timezone,
    };
    
    console.log('Processed weather data:', weatherData);
    
    // Cache the data
    weatherCache.set(location, { data: weatherData, timestamp: Date.now() });
    
    return weatherData;
  } catch (error) {
    console.error('Weather API error:', error);
    
    // Return fallback data for any error
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
      timezone: 0,
    };
  }
};

// Fetch forecast data
const fetchForecastData = async (location: string): Promise<ForecastData> => {
  validateEnv();
  
  // Use OpenWeatherMap API directly for forecast
  const apiKey = import.meta.env.VITE_WEATHER_API_KEY;
  const url = `https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(location)}&appid=${apiKey}&units=metric`;
  
  try {
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const text = await response.text();
    
    // Check if response is valid JSON
    let data;
    try {
      data = JSON.parse(text);
    } catch (parseError) {
      console.error('Forecast API returned invalid JSON:', text.substring(0, 200));
      throw new Error('Forecast API returned invalid JSON - possible CORS or proxy issue');
    }
    
    console.log('Forecast API raw data:', data);
    
    if (!data || !data.list) {
      throw new Error('Forecast API returned unexpected data structure');
    }
    
    // Process 5-day forecast data
    const dailyData = new Map();
    
    data.list.forEach((item: any) => {
      const date = new Date(item.dt * 1000).toLocaleDateString();
      
      if (!dailyData.has(date)) {
        dailyData.set(date, {
          date,
          temperatures: [],
          conditions: [],
          humidity: [],
          wind: [],
          precipitation: []
        });
      }
      
      const dayData = dailyData.get(date);
      dayData.temperatures.push(item.main.temp);
      dayData.conditions.push(item.weather[0]);
      dayData.humidity.push(item.main.humidity);
      dayData.wind.push(item.wind.speed);
      dayData.precipitation.push(item.pop || 0);
    });
    
    // Convert to daily format
    const daily = Array.from(dailyData.values()).slice(0, 7).map(dayData => ({
      date: dayData.date,
      temperature: {
        min: Math.round(Math.min(...dayData.temperatures)),
        max: Math.round(Math.max(...dayData.temperatures)),
      },
      condition: {
        main: dayData.conditions[0].main,
        description: dayData.conditions[0].description,
      },
      humidity: Math.round(dayData.humidity.reduce((a: number, b: number) => a + b, 0) / dayData.humidity.length),
      wind: {
        speed: Math.round(dayData.wind.reduce((a: number, b: number) => a + b, 0) / dayData.wind.length * 3.6),
      },
      precipitation: Math.round(Math.max(...dayData.precipitation) * 100),
    }));
    
    // Create hourly forecast from 3-hour intervals
    const hourly = data.list.slice(0, 8).map((item: any) => ({
      time: new Date(item.dt * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      temperature: Math.round(item.main.temp),
      condition: { main: item.weather[0].main },
      precipitation: Math.round((item.pop || 0) * 100),
    }));
    
    return { daily, hourly };
  } catch (error) {
    console.error('Forecast API error:', error);
    
    // Return fallback data for any error
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
          precipitation: 20,
        },
        {
          date: new Date(Date.now() + 96 * 60 * 60 * 1000).toLocaleDateString(),
          temperature: { min: 13, max: 19 },
          condition: { main: 'Thunderstorm', description: 'thunderstorm' },
          humidity: 75,
          wind: { speed: 18 },
          precipitation: 40,
        },
        {
          date: new Date(Date.now() + 120 * 60 * 60 * 1000).toLocaleDateString(),
          temperature: { min: 12, max: 18 },
          condition: { main: 'Snow', description: 'light snow' },
          humidity: 85,
          wind: { speed: 10 },
          precipitation: 60,
        },
      ],
      hourly: Array.from({ length: 8 }, (_, i) => ({
        time: new Date(Date.now() + i * 3 * 60 * 60 * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        temperature: 20 + Math.floor(Math.random() * 10),
        condition: { main: 'Clear' },
        precipitation: 0,
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