export interface WeatherCondition {
  main: string;
  description: string;
  id: number;
}

export interface Temperature {
  current: number;
  feelsLike: number;
  min: number;
  max: number;
}

export interface Wind {
  speed: number;
  direction: number;
}

export interface CurrentWeatherData {
  location: string;
  country: string;
  lastUpdated: number;
  isDay: boolean;
  temperature: Temperature;
  condition: WeatherCondition;
  wind: Wind;
  humidity: number;
  pressure: number;
  visibility: number;
  sunrise: number;
  sunset: number;
  uvIndex: number;
}

export interface HourlyForecast {
  timestamp: number;
  temperature: number;
  condition: string;
  conditionCode: number;
  precipitation: number;
  isDay: boolean;
}

export interface DailyTemperature {
  day: number;
  min: number;
  max: number;
}

export interface DailyForecast {
  timestamp: number;
  temperature: DailyTemperature;
  condition: string;
  conditionCode: number;
  precipitation: number;
}

export interface ForecastData {
  hourly: HourlyForecast[];
  daily: DailyForecast[];
}