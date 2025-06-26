import { useState, useEffect } from 'react';

interface WeatherData {
  location: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  temperature: {
    current: number;
    feelsLike: number;
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
  sunrise: number;
  sunset: number;
  isDay: boolean;
}

interface ForecastData {
  daily: Array<{
    timestamp: number;
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
      direction: number;
    };
    precipitation: number;
  }>;
  hourly: Array<{
    timestamp: number;
    temperature: number;
    condition: {
      main: string;
      description: string;
    };
    humidity: number;
    wind: {
      speed: number;
      direction: number;
    };
  }>;
}

const useWeather = (location: string) => {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [forecast, setForecast] = useState<ForecastData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!location) {
      setWeather(null);
      setForecast(null);
      setError(null);
      return;
    }

    const fetchWeather = async () => {
      setIsLoading(true);
      setError(null);

      try {
        // Simulate API call with mock data
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Mock weather data
        const mockWeather: WeatherData = {
          location: location,
          coordinates: {
            lat: 40.7128 + (Math.random() - 0.5) * 10,
            lng: -74.0060 + (Math.random() - 0.5) * 10,
          },
          temperature: {
            current: 20 + Math.floor(Math.random() * 20),
            feelsLike: 18 + Math.floor(Math.random() * 20),
            min: 15 + Math.floor(Math.random() * 10),
            max: 25 + Math.floor(Math.random() * 15),
          },
          condition: {
            main: ['Clear', 'Clouds', 'Rain', 'Snow', 'Thunderstorm'][Math.floor(Math.random() * 5)],
            description: ['clear sky', 'scattered clouds', 'light rain', 'light snow', 'thunderstorm'][Math.floor(Math.random() * 5)],
            icon: '01d',
          },
          humidity: 60 + Math.floor(Math.random() * 30),
          wind: {
            speed: 5 + Math.floor(Math.random() * 20),
            direction: Math.floor(Math.random() * 360),
          },
          visibility: 8000 + Math.floor(Math.random() * 4000),
          pressure: 1013 + Math.floor(Math.random() * 20),
          sunrise: Math.floor(Date.now() / 1000) - 21600, // 6 hours ago
          sunset: Math.floor(Date.now() / 1000) + 21600, // 6 hours from now
          isDay: new Date().getHours() >= 6 && new Date().getHours() < 18,
        };

        // Mock forecast data
        const mockForecast: ForecastData = {
          daily: Array.from({ length: 7 }, (_, i) => ({
            timestamp: Math.floor(Date.now() / 1000) + (i * 86400),
            temperature: {
              min: 10 + Math.floor(Math.random() * 15),
              max: 20 + Math.floor(Math.random() * 20),
            },
            condition: {
              main: ['Clear', 'Clouds', 'Rain', 'Snow', 'Thunderstorm'][Math.floor(Math.random() * 5)],
              description: ['clear sky', 'scattered clouds', 'light rain', 'light snow', 'thunderstorm'][Math.floor(Math.random() * 5)],
            },
            humidity: 50 + Math.floor(Math.random() * 40),
            wind: {
              speed: 3 + Math.floor(Math.random() * 15),
              direction: Math.floor(Math.random() * 360),
            },
            precipitation: Math.floor(Math.random() * 100),
          })),
          hourly: Array.from({ length: 24 }, (_, i) => ({
            timestamp: Math.floor(Date.now() / 1000) + (i * 3600),
            temperature: 15 + Math.floor(Math.random() * 20),
            condition: {
              main: ['Clear', 'Clouds', 'Rain', 'Snow', 'Thunderstorm'][Math.floor(Math.random() * 5)],
              description: ['clear sky', 'scattered clouds', 'light rain', 'light snow', 'thunderstorm'][Math.floor(Math.random() * 5)],
            },
            humidity: 50 + Math.floor(Math.random() * 40),
            wind: {
              speed: 2 + Math.floor(Math.random() * 18),
              direction: Math.floor(Math.random() * 360),
            },
          })),
        };

        setWeather(mockWeather);
        setForecast(mockForecast);
      } catch (err) {
        setError('Failed to fetch weather data. Please try again.');
        console.error('Weather fetch error:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchWeather();
  }, [location]);

  return { weather, forecast, error, isLoading };
};

export default useWeather;
