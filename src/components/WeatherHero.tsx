import React from 'react';
import { motion } from 'framer-motion';
import '../styles/WeatherHero.css';
import { 
  Thermometer, 
  Wind, 
  Droplets, 
  Eye, 
  Gauge,
  MapPin,
  Calendar,
  Clock
} from 'lucide-react';
import WeatherIcon from './WeatherIcon';
import { useTranslation } from 'react-i18next';

interface WeatherHeroProps {
  weather: any;
  theme: 'light' | 'dark';
}

const WeatherHero: React.FC<WeatherHeroProps> = ({ weather, theme }) => {
  const { t } = useTranslation();

  if (!weather) {
    return (
      <div className="weather-hero-modern">
        <div className="weather-hero-skeleton">
          <div className="skeleton-main">
            <div className="skeleton-icon"></div>
            <div className="skeleton-temp"></div>
            <div className="skeleton-location"></div>
          </div>
          <div className="skeleton-stats">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="skeleton-stat"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const formatTime = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const getWindDirection = (degrees: number) => {
    const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
    const index = Math.round(degrees / 45) % 8;
    return directions[index];
  };

  const getWeatherGradient = () => {
    const condition = weather.condition?.main?.toLowerCase() || 'clear';
    const hour = new Date().getHours();
    const isDaytime = hour >= 6 && hour < 18;
    
    if (condition.includes('rain')) return 'rainy-gradient';
    if (condition.includes('snow')) return 'snowy-gradient';
    if (condition.includes('cloud')) return 'cloudy-gradient';
    if (condition.includes('thunderstorm')) return 'stormy-gradient';
    return isDaytime ? 'sunny-gradient' : 'night-gradient';
  };

  return (
    <div className="weather-hero-modern">
      <motion.div 
        className={`weather-hero-card ${getWeatherGradient()}`}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Header Section */}
        <div className="weather-hero-header">
          <div className="location-info">
            <div className="location-icon">
              <MapPin size={20} />
            </div>
            <div className="location-details">
              <h2 className="location-name">{weather.location}</h2>
              <p className="location-time">
                <Clock size={14} />
                {new Date().toLocaleTimeString([], { 
                  hour: '2-digit', 
                  minute: '2-digit' 
                })}
              </p>
            </div>
          </div>
          
          <div className="weather-condition">
            <p className="condition-text">{weather.condition?.description}</p>
          </div>
        </div>

        {/* Main Weather Display */}
        <div className="weather-main">
          <div className="weather-icon-section">
            <motion.div 
              className="weather-icon-wrapper"
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
              <WeatherIcon 
                conditionCode={parseInt(weather.condition?.icon?.slice(0, -1) || '800')}
                isDay={weather.condition?.icon?.endsWith('d') || false}
                size="large"
              />
            </motion.div>
          </div>
          
          <div className="temperature-section">
            <motion.div 
              className="current-temp"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <span className="temp-value">{Math.round(weather.temperature?.current)}</span>
              <span className="temp-unit">°C</span>
            </motion.div>
            
            <div className="temp-range">
              <span className="temp-min">
                {Math.round(weather.temperature?.min)}°
              </span>
              <div className="temp-bar">
                <div 
                  className="temp-fill"
                  style={{
                    width: `${((weather.temperature?.current - weather.temperature?.min) / 
                              (weather.temperature?.max - weather.temperature?.min)) * 100}%`
                  }}
                ></div>
              </div>
              <span className="temp-max">
                {Math.round(weather.temperature?.max)}°
              </span>
            </div>
            
            <p className="feels-like">
              {t('Feels like')} {Math.round(weather.temperature?.feels_like)}°C
            </p>
          </div>
        </div>

        {/* Weather Stats Grid */}
        <div className="weather-stats-grid">
          <motion.div 
            className="stat-card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            <div className="stat-icon">
              <Thermometer size={20} />
            </div>
            <div className="stat-content">
              <span className="stat-label">{t('Temperature')}</span>
              <span className="stat-value">{Math.round(weather.temperature?.current)}°C</span>
            </div>
          </motion.div>

          <motion.div 
            className="stat-card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
          >
            <div className="stat-icon">
              <Droplets size={20} />
            </div>
            <div className="stat-content">
              <span className="stat-label">{t('Humidity')}</span>
              <span className="stat-value">{weather.humidity}%</span>
            </div>
          </motion.div>

          <motion.div 
            className="stat-card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.3 }}
          >
            <div className="stat-icon">
              <Wind size={20} />
            </div>
            <div className="stat-content">
              <span className="stat-label">{t('Wind')}</span>
              <span className="stat-value">
                {weather.wind?.speed} km/h
                <span className="wind-direction">
                  {getWindDirection(weather.wind?.direction)}
                </span>
              </span>
            </div>
          </motion.div>

          <motion.div 
            className="stat-card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.4 }}
          >
            <div className="stat-icon">
              <Eye size={20} />
            </div>
            <div className="stat-content">
              <span className="stat-label">{t('Visibility')}</span>
              <span className="stat-value">{weather.visibility} km</span>
            </div>
          </motion.div>

          <motion.div 
            className="stat-card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.5 }}
          >
            <div className="stat-icon">
              <Gauge size={20} />
            </div>
            <div className="stat-content">
              <span className="stat-label">{t('Pressure')}</span>
              <span className="stat-value">{weather.pressure} hPa</span>
            </div>
          </motion.div>

          <motion.div 
            className="stat-card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.6 }}
          >
            <div className="stat-icon">
              <Calendar size={20} />
            </div>
            <div className="stat-content">
              <span className="stat-label">{t('Updated')}</span>
              <span className="stat-value">
                {new Date().toLocaleTimeString([], { 
                  hour: '2-digit', 
                  minute: '2-digit' 
                })}
              </span>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default WeatherHero; 