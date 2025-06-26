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

interface WeatherForecastProps {
  forecast: any;
}

const WeatherForecast: React.FC<WeatherForecastProps> = ({ forecast }) => {
  const [activeTab, setActiveTab] = useState<'daily' | 'hourly'>('daily');

  const getWeatherIcon = (condition: string) => {
    switch (condition.toLowerCase()) {
      case 'clear':
        return <Sun className="w-8 h-8 text-yellow-400" />;
      case 'clouds':
        return <Cloud className="w-8 h-8 text-gray-400" />;
      case 'rain':
      case 'drizzle':
        return <CloudRain className="w-8 h-8 text-blue-400" />;
      case 'thunderstorm':
        return <CloudLightning className="w-8 h-8 text-purple-400" />;
      case 'snow':
        return <Snowflake className="w-8 h-8 text-blue-200" />;
      default:
        return <Cloud className="w-8 h-8 text-gray-400" />;
    }
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatTime = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleTimeString('en-US', {
      hour: 'numeric',
      hour12: true
    });
  };

  const getDayName = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleDateString('en-US', {
      weekday: 'long'
    });
  };

  if (!forecast) {
    return (
      <div className="glass-card rounded-2xl p-8 text-center">
        <p className="text-white/60">No forecast data available</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Tab Navigation */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex space-x-2"
      >
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setActiveTab('daily')}
          className={`flex items-center space-x-2 px-6 py-3 rounded-full backdrop-blur-sm transition-all duration-300 ${
            activeTab === 'daily'
              ? 'bg-white/30 text-white shadow-lg'
              : 'bg-white/10 text-white/80 hover:bg-white/20'
          }`}
        >
          <Calendar className="w-5 h-5" />
          <span>7-Day Forecast</span>
        </motion.button>
        
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setActiveTab('hourly')}
          className={`flex items-center space-x-2 px-6 py-3 rounded-full backdrop-blur-sm transition-all duration-300 ${
            activeTab === 'hourly'
              ? 'bg-white/30 text-white shadow-lg'
              : 'bg-white/10 text-white/80 hover:bg-white/20'
          }`}
        >
          <Clock className="w-5 h-5" />
          <span>Hourly Forecast</span>
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
              className="glass-card rounded-2xl p-6"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="text-center">
                    <p className="text-white font-semibold">
                      {getDayName(day.timestamp)}
                    </p>
                    <p className="text-white/60 text-sm">
                      {formatDate(day.timestamp)}
                    </p>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    {getWeatherIcon(day.condition.main)}
                    <div>
                      <p className="text-white capitalize">
                        {day.condition.description}
                      </p>
                      <p className="text-white/60 text-sm">
                        {Math.round(day.precipitation)}% rain
                      </p>
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      <Thermometer className="w-5 h-5 text-red-400" />
                      <span className="text-white font-semibold">
                        {Math.round(day.temperature.max)}°
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Thermometer className="w-5 h-5 text-blue-400" />
                      <span className="text-white/80">
                        {Math.round(day.temperature.min)}°
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4 mt-2">
                    <div className="flex items-center space-x-1">
                      <Droplets className="w-4 h-4 text-blue-400" />
                      <span className="text-white/60 text-sm">
                        {day.humidity}%
                      </span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Wind className="w-4 h-4 text-green-400" />
                      <span className="text-white/60 text-sm">
                        {Math.round(day.wind.speed)} km/h
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
          className="glass-card rounded-2xl p-6"
        >
          <h3 className="text-xl font-semibold text-white mb-6">24-Hour Forecast</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {forecast.hourly.slice(0, 24).map((hour: any, index: number) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
                className="text-center p-4 bg-white/5 rounded-xl"
              >
                <p className="text-white/60 text-sm mb-2">
                  {formatTime(hour.timestamp)}
                </p>
                
                <div className="flex justify-center mb-2">
                  {getWeatherIcon(hour.condition.main)}
                </div>
                
                <p className="text-white font-semibold mb-1">
                  {Math.round(hour.temperature)}°C
                </p>
                
                <p className="text-white/60 text-xs capitalize">
                  {hour.condition.description}
                </p>
                
                <div className="flex items-center justify-center space-x-2 mt-2">
                  <Droplets className="w-3 h-3 text-blue-400" />
                  <span className="text-white/60 text-xs">
                    {hour.humidity}%
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Forecast Summary */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="glass-card rounded-2xl p-6"
      >
        <h3 className="text-xl font-semibold text-white mb-4">Forecast Summary</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <p className="text-white/60 text-sm mb-2">Average High</p>
            <p className="text-2xl font-bold text-white">
              {Math.round(forecast.daily?.reduce((acc: number, day: any) => acc + day.temperature.max, 0) / forecast.daily?.length || 0)}°C
            </p>
          </div>
          <div className="text-center">
            <p className="text-white/60 text-sm mb-2">Average Low</p>
            <p className="text-2xl font-bold text-white">
              {Math.round(forecast.daily?.reduce((acc: number, day: any) => acc + day.temperature.min, 0) / forecast.daily?.length || 0)}°C
            </p>
          </div>
          <div className="text-center">
            <p className="text-white/60 text-sm mb-2">Rainy Days</p>
            <p className="text-2xl font-bold text-white">
              {forecast.daily?.filter((day: any) => day.precipitation > 30).length || 0}
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default WeatherForecast; 