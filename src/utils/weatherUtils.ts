import { CurrentWeatherData, ForecastData, HourlyForecast, DailyForecast } from '../types/weather';

const API_KEY = import.meta.env.VITE_WEATHER_API_KEY;
if (!API_KEY) {
  throw new Error('Missing required environment variable: VITE_WEATHER_API_KEY');
}
const BASE_URL = 'https://api.openweathermap.org/data/2.5';

export const fetchWeather = async (location: string): Promise<CurrentWeatherData> => {
  try {
    const response = await fetch(
      `${BASE_URL}/weather?q=${encodeURIComponent(location)}&units=metric&appid=${API_KEY}`
    );
    
    if (!response.ok) {
      throw new Error(`Weather data not found for ${location}`);
    }
    
    const data = await response.json();
    
    return {
      location: data.name,
      country: data.sys.country,
      lastUpdated: Date.now(),
      isDay: data.dt > data.sys.sunrise && data.dt < data.sys.sunset,
      temperature: {
        current: data.main.temp,
        feelsLike: data.main.feels_like,
        min: data.main.temp_min,
        max: data.main.temp_max
      },
      condition: {
        main: data.weather[0].main,
        description: data.weather[0].description,
        id: data.weather[0].id
      },
      wind: {
        speed: data.wind.speed,
        direction: data.wind.deg
      },
      humidity: data.main.humidity,
      pressure: data.main.pressure,
      visibility: data.visibility,
      sunrise: data.sys.sunrise,
      sunset: data.sys.sunset,
      uvIndex: 5, // This would come from a different API endpoint
      timezone: data.timezone
    };
  } catch (error) {
    console.error('Error fetching weather:', error);
    throw new Error('Failed to fetch current weather data');
  }
};

export const fetchForecast = async (location: string): Promise<ForecastData> => {
  try {
    const response = await fetch(
      `${BASE_URL}/forecast?q=${encodeURIComponent(location)}&units=metric&appid=${API_KEY}`
    );
    
    if (!response.ok) {
      throw new Error(`Forecast data not found for ${location}`);
    }
    
    const data = await response.json();
    
    // Process hourly forecast (3-hour intervals for 5 days)
    const hourly: HourlyForecast[] = data.list.map((item: any) => ({
      timestamp: item.dt * 1000,
      temperature: item.main.temp,
      condition: item.weather[0].main,
      conditionCode: item.weather[0].id,
      precipitation: item.pop, // Probability of precipitation
      isDay: item.dt > item.sys.sunrise && item.dt < item.sys.sunset
    }));
    
    // Process daily forecast (group by day)
    const dailyMap = new Map<string, DailyForecast>();
    
    data.list.forEach((item: any) => {
      const date = new Date(item.dt * 1000);
      const dayKey = date.toLocaleDateString();
      
      if (!dailyMap.has(dayKey)) {
        dailyMap.set(dayKey, {
          timestamp: date.setHours(12, 0, 0, 0),
          temperature: {
            day: item.main.temp,
            min: item.main.temp_min,
            max: item.main.temp_max
          },
          condition: item.weather[0].main,
          conditionCode: item.weather[0].id,
          precipitation: item.pop
        });
      } else {
        const existing = dailyMap.get(dayKey)!;
        
        // Update min/max temperatures
        if (item.main.temp_min < existing.temperature.min) {
          existing.temperature.min = item.main.temp_min;
        }
        if (item.main.temp_max > existing.temperature.max) {
          existing.temperature.max = item.main.temp_max;
        }
        
        // Update day temperature to noon temperature
        if (date.getHours() === 12) {
          existing.temperature.day = item.main.temp;
          existing.condition = item.weather[0].main;
          existing.conditionCode = item.weather[0].id;
        }
      }
    });
    
    const daily: DailyForecast[] = Array.from(dailyMap.values())
      .sort((a, b) => a.timestamp - b.timestamp)
      .slice(0, 5); // Get next 5 days
    
    return { hourly, daily };
  } catch (error) {
    console.error('Error fetching forecast:', error);
    throw new Error('Failed to fetch forecast data');
  }
};