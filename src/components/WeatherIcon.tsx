import { useEffect, useState } from 'react';
import '../styles/WeatherIcon.css';

interface WeatherIconProps {
  conditionCode: number;
  isDay: boolean;
  size: 'small' | 'medium' | 'large';
}

const WeatherIcon: React.FC<WeatherIconProps> = ({ conditionCode, isDay, size }) => {
  const [icon, setIcon] = useState<string>('');

  useEffect(() => {
    const getWeatherIcon = () => {
      // Thunderstorm
      if (conditionCode >= 200 && conditionCode <= 232) {
        return '⛈️';
      }
      // Drizzle
      if (conditionCode >= 300 && conditionCode <= 321) {
        return '🌧️';
      }
      // Rain
      if (conditionCode >= 500 && conditionCode <= 531) {
        return isDay ? '🌦️' : '🌧️';
      }
      // Snow
      if (conditionCode >= 600 && conditionCode <= 622) {
        return '❄️';
      }
      // Atmosphere
      if (conditionCode >= 701 && conditionCode <= 781) {
        return '🌫️';
      }
      // Clear
      if (conditionCode === 800) {
        return isDay ? '☀️' : '🌙';
      }
      // Clouds
      if (conditionCode >= 801 && conditionCode <= 804) {
        if (conditionCode === 801) {
          return isDay ? '🌤️' : '🌙☁️';
        }
        if (conditionCode === 802) {
          return isDay ? '⛅' : '🌥️';
        }
        return '☁️';
      }
      return '🌈';
    };

    setIcon(getWeatherIcon());
  }, [conditionCode, isDay]);

  return (
    <span 
      className={`weather-icon ${size}`}
      role="img"
      aria-label="Weather icon"
    >
      {icon}
    </span>
  );
};

export default WeatherIcon;