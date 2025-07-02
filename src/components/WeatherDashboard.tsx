import React from 'react';
import { motion } from 'framer-motion';
import { 
  Thermometer, 
  Droplets, 
  Wind, 
  Eye, 
  Sunrise, 
  Sunset,
  Cloud,
  Sun,
  CloudRain,
  CloudLightning,
  Snowflake,
  MapPin,
  Clock,
  BarChart3,
  Zap,
  Sparkles
} from 'lucide-react';
import { getCityDate } from '../utils/timezone';
import { useTranslation } from 'react-i18next';

interface WeatherDashboardProps {
  weather: any;
  forecast: any;
  timeFormat?: '12' | '24';
}

const WeatherDashboard: React.FC<WeatherDashboardProps> = ({ weather, forecast, timeFormat = '12' }) => {
  const { t } = useTranslation();

  const getWeatherIcon = (condition: string) => {
    switch (condition.toLowerCase()) {
      case 'clear':
        return <Sun className="w-20 h-20 text-yellow-400 drop-shadow-lg" />;
      case 'clouds':
        return <Cloud className="w-20 h-20 text-gray-300 drop-shadow-lg" />;
      case 'rain':
      case 'drizzle':
        return <CloudRain className="w-20 h-20 text-blue-400 drop-shadow-lg" />;
      case 'thunderstorm':
        return <CloudLightning className="w-20 h-20 text-purple-400 drop-shadow-lg" />;
      case 'snow':
        return <Snowflake className="w-20 h-20 text-blue-200 drop-shadow-lg" />;
      default:
        return <Cloud className="w-20 h-20 text-gray-300 drop-shadow-lg" />;
    }
  };

  const formatTime = (timestamp: number) => {
    if (!weather || typeof weather.timezone !== 'number') return '';
    return getCityDate(weather, timestamp).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: timeFormat === '12'
    });
  };

  const getTemperatureColor = (temp: number) => {
    if (temp >= 30) return 'text-red-400';
    if (temp >= 20) return 'text-orange-400';
    if (temp >= 10) return 'text-yellow-400';
    if (temp >= 0) return 'text-blue-400';
    return 'text-purple-400';
  };

  const metrics = [
    {
      icon: Thermometer,
      label: t('Feels Like'),
      value: `${Math.round(weather.temperature.feelsLike)}°C`,
      color: 'text-red-400',
      gradient: 'from-red-400 to-orange-400'
    },
    {
      icon: Droplets,
      label: t('Humidity'),
      value: `${weather.humidity}%`,
      color: 'text-blue-400',
      gradient: 'from-blue-400 to-cyan-400'
    },
    {
      icon: Wind,
      label: t('Wind Speed'),
      value: `${weather.wind.speed} km/h`,
      color: 'text-green-400',
      gradient: 'from-green-400 to-emerald-400'
    },
    {
      icon: Eye,
      label: t('Visibility'),
      value: `${weather.visibility / 1000} km`,
      color: 'text-purple-400',
      gradient: 'from-purple-400 to-pink-400'
    }
  ];

  const getGreeting = () => {
    if (!weather || typeof weather.timezone !== 'number') return t('Hello');
    const cityHour = getCityDate(weather).getHours();
    if (cityHour < 5) return t('Good night');
    if (cityHour < 12) return t('Good morning');
    if (cityHour < 18) return t('Good afternoon');
    return t('Good evening');
  };

  const getWeatherEmoji = (condition: string) => {
    switch (condition.toLowerCase()) {
      case 'clear': return '☀️';
      case 'clouds': return '☁️';
      case 'rain':
      case 'drizzle': return '🌧️';
      case 'thunderstorm': return '⛈️';
      case 'snow': return '❄️';
      case 'mist':
      case 'fog': return '🌫️';
      default: return '🌤️';
    }
  };

  return (
    <div className="space-y-4 sm:space-y-8">
      {/* Enhanced Main Weather Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card rounded-2xl sm:rounded-3xl p-4 sm:p-12 text-center relative overflow-hidden"
      >
        {/* Greeting and Weather Emoji */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex flex-col items-center justify-center mb-2 sm:mb-6"
        >
          <motion.span
            className="text-4xl sm:text-7xl mb-2 cursor-pointer select-none drop-shadow-xl min-w-[44px] min-h-[44px] flex items-center justify-center"
            whileHover={{ scale: 1.15, rotate: [0, 10, -10, 0] }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 300 }}
            aria-label="Weather emoji"
          >
            {getWeatherEmoji(weather.condition.main)}
          </motion.span>
          <span className="text-base sm:text-2xl font-semibold text-white/90 text-shadow capitalize">
            {getGreeting()}! {t("Here's your weather in {{location}}", { location: weather.location })}
          </span>
        </motion.div>
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div className="absolute top-4 right-4 w-16 sm:w-32 h-16 sm:h-32 bg-white/20 rounded-full blur-2xl sm:blur-3xl" />
          <div className="absolute bottom-4 left-4 w-12 sm:w-24 h-12 sm:h-24 bg-white/20 rounded-full blur-xl sm:blur-2xl" />
        </div>

        <div className="relative z-10">
          {/* Location and Time */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-center mb-4 sm:mb-6 flex-wrap gap-2"
          >
            <div className="flex items-center">
              <MapPin className="w-4 h-4 sm:w-6 sm:h-6 text-white/70 mr-2" />
              <span className="text-white/80 text-sm sm:text-lg">{weather.location}</span>
            </div>
            <span className="hidden sm:inline mx-4 text-white/50">•</span>
            <div className="flex items-center">
              <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-white/70 mr-2" />
              <span className="text-white/80 text-sm sm:text-base">
                {getCityDate(weather).toLocaleTimeString('en-US', {
                  hour: 'numeric',
                  minute: '2-digit',
                  hour12: timeFormat === '12'
                })}
              </span>
            </div>
          </motion.div>

          {/* Weather Icon with Animation */}
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="flex items-center justify-center mb-6 sm:mb-8"
          >
            {getWeatherIcon(weather.condition.main)}
          </motion.div>
          
          {/* Temperature with Enhanced Animation */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, type: "spring", stiffness: 100 }}
            className="mb-4 sm:mb-6 w-full max-w-xs sm:max-w-md md:max-w-lg lg:max-w-2xl mx-auto bg-white/80 dark:bg-gray-900/80 rounded-2xl shadow-lg p-4 sm:p-8 flex flex-col items-center"
          >
            <h1 className={`text-5xl sm:text-8xl font-bold mb-2 text-shadow-xl ${getTemperatureColor(weather.temperature.current)}`}
              style={{ lineHeight: 1 }}
            >
              {Math.round(weather.temperature.current)}°
            </h1>
            <div className="flex items-center justify-center space-x-3 sm:space-x-4 text-white/80">
              <span className="text-sm sm:text-lg">{t('H')}: {Math.round(weather.temperature.max)}°</span>
              <span className="text-sm sm:text-lg">{t('L')}: {Math.round(weather.temperature.min)}°</span>
            </div>
          </motion.div>
          
          {/* Weather Description */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-xl sm:text-3xl text-white/90 mb-4 capitalize font-medium text-shadow"
          >
            {t(weather.condition.description)}
          </motion.p>
          
          {/* Weather Insights */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="flex items-center justify-center space-x-3 sm:space-x-6 text-white/70 flex-wrap gap-2"
          >
            <div className="flex items-center">
              <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
              <span className="text-xs sm:text-sm">{t('Real-time data')}</span>
            </div>
            <div className="flex items-center">
              <Zap className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
              <span className="text-xs sm:text-sm">{t('AI powered')}</span>
            </div>
            <div className="flex items-center">
              <BarChart3 className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
              <span className="text-xs sm:text-sm">{t('Precise forecasts')}</span>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Enhanced Weather Metrics Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-6"
      >
        {metrics.map((metric, index) => {
          const Icon = metric.icon;
          return (
            <motion.div
              key={metric.label}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.7 + index * 0.1, type: 'spring', stiffness: 100 }}
              className="glass-card rounded-xl sm:rounded-2xl p-2 sm:p-8 text-center card-hover group min-w-[44px] min-h-[44px]"
              aria-label={metric.label}
            >
              <div className={`w-10 h-10 sm:w-16 sm:h-16 bg-gradient-to-br ${metric.gradient} rounded-full flex items-center justify-center mx-auto mb-2 sm:mb-4 shadow-lg group-hover:scale-110 transition-transform`}>
                <Icon className="w-5 h-5 sm:w-8 sm:h-8 text-white" />
              </div>
              <p className="text-white/60 text-xs sm:text-sm mb-1 sm:mb-2 font-medium">{metric.label}</p>
              <p className="text-white text-base sm:text-2xl font-bold text-shadow">{metric.value}</p>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Enhanced Sunrise/Sunset */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9 }}
        className="glass-card rounded-xl sm:rounded-2xl p-4 sm:p-8"
      >
        <h3 className="text-lg sm:text-2xl font-semibold text-white mb-2 sm:mb-6 text-shadow">{t('Sun Schedule')}</h3>
        <div className="flex items-center justify-between flex-col sm:flex-row space-y-2 sm:space-y-0">
          <motion.div 
            className="flex items-center space-x-3 sm:space-x-4"
            whileHover={{ scale: 1.05 }}
          >
            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-orange-400 to-red-400 rounded-full flex items-center justify-center shadow-lg">
              <Sunrise className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
            </div>
            <div>
              <p className="text-white/60 text-xs sm:text-sm font-medium">{t('Sunrise')}</p>
              <p className="text-white text-lg sm:text-xl font-bold text-shadow">
                {formatTime(weather.sunrise)}
              </p>
            </div>
          </motion.div>
          
          <motion.div 
            className="flex items-center space-x-3 sm:space-x-4"
            whileHover={{ scale: 1.05 }}
          >
            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center shadow-lg">
              <Sunset className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
            </div>
            <div>
              <p className="text-white/60 text-xs sm:text-sm font-medium">{t('Sunset')}</p>
              <p className="text-white text-lg sm:text-xl font-bold text-shadow">
                {formatTime(weather.sunset)}
              </p>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Enhanced Hourly Forecast Preview */}
      {forecast?.hourly && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0 }}
          className="glass-card rounded-xl sm:rounded-2xl p-4 sm:p-8"
        >
          <h3 className="text-lg sm:text-2xl font-semibold text-white mb-2 sm:mb-6 text-shadow">{t('Next 24 Hours')}</h3>
          <div className="flex space-x-2 sm:space-x-6 overflow-x-auto pb-4 custom-scrollbar snap-x snap-mandatory">
            {forecast.hourly.slice(0, 24).map((hour: any, index: number) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1.1 + index * 0.05 }}
                className="flex-shrink-0 text-center group snap-center min-w-[60px] sm:min-w-[80px]"
                aria-label={`Hour ${getCityDate(weather, hour.timestamp).getHours()}`}
              >
                <p className="text-white/60 text-xs sm:text-sm mb-1 sm:mb-3 font-medium">
                  {getCityDate(weather, hour.timestamp).getHours()}:00
                </p>
                <div className="w-10 h-10 sm:w-16 sm:h-16 bg-white/10 rounded-full flex items-center justify-center mb-1 sm:mb-3 group-hover:bg-white/20 transition-colors">
                  {getWeatherIcon(hour.condition.main)}
                </div>
                <p className={`text-xs sm:text-lg font-bold ${getTemperatureColor(hour.temperature)}`}>{Math.round(hour.temperature)}°</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default WeatherDashboard; 