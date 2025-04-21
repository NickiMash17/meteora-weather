import { useState, useEffect } from 'react';
import { CurrentWeatherData, ForecastData } from '../types/weather';
import { fetchWeather, fetchForecast } from '../utils/weatherUtils';


interface WeatherHookResult {
  weather: CurrentWeatherData | null;
  forecast: ForecastData | null;
  isLoading: boolean;
  error: string | null;
}

export default function useWeather(location: string) {
  const [weather, setWeather] = useState<CurrentWeatherData | null>(null);
  const [forecast, setForecast] = useState<ForecastData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);


  useEffect(() => {
    if (!location.trim()) {
      setWeather(null);
      setForecast(null);
      setError(null);
      return;
    }

    const fetchWeatherData = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        const [currentWeather, forecastData] = await Promise.all([
          fetchWeather(location),
          fetchForecast(location)
        ]);
        
        setWeather(currentWeather);
        setForecast(forecastData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch weather data');
        setWeather(null);
        setForecast(null);
      } finally {
        setIsLoading(false);
      }
    };

    const timer = setTimeout(() => {
      fetchWeatherData();
    }, 500);

    return () => clearTimeout(timer);
  }, [location]);

  return { weather, forecast, isLoading, error };
};
