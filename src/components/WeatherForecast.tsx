import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Calendar, 
  Clock, 
  Thermometer, 
  Droplets, 
  Wind, 
  Cloud,
  Sun,
  CloudRain,
  CloudLightning,
  Snowflake
} from 'lucide-react';
import { getCityDate } from '../utils/timezone';
import { useTranslation } from 'react-i18next';

interface WeatherForecastProps {
  forecast: any;
  weather?: any;
  timeFormat?: '12' | '24';
}

const WeatherForecast: React.FC<WeatherForecastProps> = ({ forecast, weather, timeFormat = '12' }) => {
  const [activeTab, setActiveTab] = useState<'daily' | 'hourly'>('daily');
  const { t } = useTranslation();

  const getWeatherIcon = (condition: string) => {
    switch (condition.toLowerCase()) {
      case 'clear':
        return <Sun className="w-6 h-6 sm:w-8 sm:h-8 text-yellow-400 drop-shadow-sm" />;
      case 'clouds':
        return <Cloud className="w-6 h-6 sm:w-8 sm:h-8 text-gray-400 drop-shadow-sm" />;
      case 'rain':
      case 'drizzle':
        return <CloudRain className="w-6 h-6 sm:w-8 sm:h-8 text-blue-400 drop-shadow-sm" />;
      case 'thunderstorm':
        return <CloudLightning className="w-6 h-6 sm:w-8 sm:h-8 text-purple-400 drop-shadow-sm" />;
      case 'snow':
        return <Snowflake className="w-6 h-6 sm:w-8 sm:h-8 text-blue-200 drop-shadow-sm" />;
      default:
        return <Cloud className="w-6 h-6 sm:w-8 sm:h-8 text-gray-400 drop-shadow-sm" />;
    }
  };

  const formatDate = (timestamp: number) => {
    if (!weather || typeof weather.timezone !== 'number') return '';
    return getCityDate(weather, timestamp).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatTime = (timestamp: number) => {
    if (!weather || typeof weather.timezone !== 'number') return '';
    return getCityDate(weather, timestamp).toLocaleTimeString('en-US', {
      hour: 'numeric',
      hour12: timeFormat === '12'
    });
  };

  const getDayName = (timestamp: number) => {
    if (!weather || typeof weather.timezone !== 'number') return '';
    return getCityDate(weather, timestamp).toLocaleDateString('en-US', {
      weekday: 'long'
    });
  };

  if (!forecast) {
    return (
      <div className="glass-card rounded-2xl p-6 sm:p-8 text-center w-full">
        <p className="text-gray-600 dark:text-gray-300 text-lg">{t('No forecast data available')}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 w-full">
      {/* Tab Navigation */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row gap-2 sm:gap-4"
      >
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setActiveTab('daily')}
          className={`flex items-center justify-center gap-2 px-4 sm:px-6 py-3 rounded-full backdrop-blur-sm transition-all duration-300 font-medium ${
            activeTab === 'daily'
              ? 'bg-blue-500/80 text-white shadow-lg border border-blue-400/30'
              : 'bg-white/10 dark:bg-gray-800/20 text-gray-700 dark:text-gray-300 hover:bg-white/20 dark:hover:bg-gray-700/30 border border-white/20 dark:border-gray-700/30'
          }`}
        >
          <Calendar className="w-4 h-4 sm:w-5 sm:h-5" />
          <span className="text-sm sm:text-base">{t('5-Day Forecast')}</span>
        </motion.button>
        
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setActiveTab('hourly')}
          className={`flex items-center justify-center gap-2 px-4 sm:px-6 py-3 rounded-full backdrop-blur-sm transition-all duration-300 font-medium ${
            activeTab === 'hourly'
              ? 'bg-blue-500/80 text-white shadow-lg border border-blue-400/30'
              : 'bg-white/10 dark:bg-gray-800/20 text-gray-700 dark:text-gray-300 hover:bg-white/20 dark:hover:bg-gray-700/30 border border-white/20 dark:border-gray-700/30'
          }`}
        >
          <Clock className="w-4 h-4 sm:w-5 sm:h-5" />
          <span className="text-sm sm:text-base">{t('Hourly Forecast')}</span>
        </motion.button>
      </motion.div>

      {/* Daily Forecast */}
      {activeTab === 'daily' && forecast.daily && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          {forecast.daily.map((day: any, index: number) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="glass-card rounded-2xl p-4 sm:p-6 hover:scale-[1.02] transition-transform duration-300"
            >
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                  <div className="text-center sm:text-left">
                    <p className="text-gray-900 dark:text-white font-semibold text-sm sm:text-base">
                      {day.date && day.date !== 'Invalid Date' ? formatDate(Date.parse(day.date) / 1000) : t('N/A')}
                    </p>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    {getWeatherIcon(day.condition.main)}
                    <div>
                      <p className="text-gray-900 dark:text-white capitalize text-sm sm:text-base font-medium">
                        {day.condition.description || t('N/A')}
                      </p>
                      <p className="text-gray-600 dark:text-gray-300 text-xs sm:text-sm">
                        {typeof day.precipitation === 'number' && !isNaN(day.precipitation) ? day.precipitation : t('--')}% {t('rain')}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="text-center sm:text-right">
                  <div className="flex items-center justify-center sm:justify-end gap-4 mb-2">
                    <div className="flex items-center gap-2">
                      <Thermometer className="w-4 h-4 sm:w-5 sm:h-5 text-red-400" />
                      <span className="text-gray-900 dark:text-white font-semibold text-sm sm:text-base">
                        {typeof day.temperature.max === 'number' && !isNaN(day.temperature.max) ? day.temperature.max : t('--')}°
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Thermometer className="w-4 h-4 sm:w-5 sm:h-5 text-blue-400" />
                      <span className="text-gray-600 dark:text-gray-300 text-sm sm:text-base">
                        {typeof day.temperature.min === 'number' && !isNaN(day.temperature.min) ? day.temperature.min : t('--')}°
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-center sm:justify-end gap-4">
                    <div className="flex items-center gap-1">
                      <Droplets className="w-3 h-3 sm:w-4 sm:h-4 text-blue-400" />
                      <span className="text-gray-600 dark:text-gray-300 text-xs sm:text-sm">
                        {typeof day.humidity === 'number' && !isNaN(day.humidity) ? day.humidity : t('--')}%
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Wind className="w-3 h-3 sm:w-4 sm:h-4 text-green-400" />
                      <span className="text-gray-600 dark:text-gray-300 text-xs sm:text-sm">
                        {typeof day.wind.speed === 'number' && !isNaN(day.wind.speed) ? day.wind.speed : t('--')} {t('km/h')}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* Hourly Forecast */}
      {activeTab === 'hourly' && forecast.hourly && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card rounded-2xl p-4 sm:p-6"
        >
          <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mb-4 sm:mb-6">{t('24-Hour Forecast')}</h3>
          <div className="flex gap-2 sm:gap-4 overflow-x-auto pb-4 custom-scrollbar snap-x snap-mandatory">
            {forecast.hourly.slice(0, 24).map((hour: any, index: number) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
                className="text-center p-3 sm:p-4 bg-white/10 dark:bg-gray-800/20 backdrop-blur-sm rounded-xl flex-shrink-0 snap-center min-w-[70px] sm:min-w-[90px] border border-white/20 dark:border-gray-700/30 hover:scale-105 transition-transform duration-200"
              >
                <p className="text-gray-600 dark:text-gray-300 text-xs sm:text-sm mb-2 font-medium">
                  {hour.time && hour.time !== 'Invalid Date' ? formatTime(Date.parse(hour.time) / 1000) : t('N/A')}
                </p>
                <div className="flex justify-center mb-2">
                  {getWeatherIcon(hour.condition.main)}
                </div>
                <p className="text-gray-900 dark:text-white font-semibold text-sm sm:text-base mb-1">
                  {typeof hour.temperature === 'number' && !isNaN(hour.temperature) ? hour.temperature : t('--')}°
                </p>
                <p className="text-gray-600 dark:text-gray-300 text-xs capitalize">
                  {hour.condition?.main || t('N/A')}
                </p>
                {typeof hour.precipitation === 'number' && hour.precipitation > 0 && (
                  <div className="flex items-center justify-center gap-1 mt-1">
                    <Droplets className="w-3 h-3 text-blue-400" />
                    <span className="text-gray-600 dark:text-gray-300 text-xs">
                      {hour.precipitation}%
                    </span>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default WeatherForecast; 