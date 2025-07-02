import React, { useState } from 'react';
import { motion, useMotionValue, useTransform, useSpring } from 'framer-motion';
import { 
  Sun, 
  Moon, 
  Cloud, 
  CloudRain, 
  CloudLightning, 
  Snowflake,
  Wind,
  Thermometer,
  Droplets,
  Eye,
  Compass
} from 'lucide-react';
import { getCityDate } from '../utils/timezone';
import { useTranslation } from 'react-i18next';

interface WeatherHeroProps {
  weather: any;
  theme: 'light' | 'dark';
}

const WeatherHero: React.FC<WeatherHeroProps> = ({ weather, theme }) => {
  const [isHovered, setIsHovered] = useState(false);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  
  const rotateX = useTransform(mouseY, [-300, 300], [15, -15]);
  const rotateY = useTransform(mouseX, [-300, 300], [-15, 15]);
  
  const springRotateX = useSpring(rotateX, { stiffness: 100, damping: 20 });
  const springRotateY = useSpring(rotateY, { stiffness: 100, damping: 20 });

  const { t } = useTranslation();

  const handleMouseMove = (event: React.MouseEvent) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    mouseX.set(event.clientX - centerX);
    mouseY.set(event.clientY - centerY);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
    setIsHovered(false);
  };

  const getWeatherIcon = () => {
    const condition = weather?.condition?.main?.toLowerCase() || 'clear';
    const hour = (weather && typeof weather.timezone === 'number') ? getCityDate(weather).getHours() : new Date().getHours();
    const isDaytime = hour >= 6 && hour < 18;

    if (!isDaytime) {
      if (condition.includes('clear')) return <Moon className="w-24 h-24 sm:w-32 sm:h-32 text-yellow-200 drop-shadow-lg" />;
      if (condition.includes('cloud')) return <Cloud className="w-24 h-24 sm:w-32 sm:h-32 text-gray-300 drop-shadow-lg" />;
      if (condition.includes('rain')) return <CloudRain className="w-24 h-24 sm:w-32 sm:h-32 text-blue-300 drop-shadow-lg" />;
      if (condition.includes('thunderstorm')) return <CloudLightning className="w-24 h-24 sm:w-32 sm:h-32 text-purple-300 drop-shadow-lg" />;
      if (condition.includes('snow')) return <Snowflake className="w-24 h-24 sm:w-32 sm:h-32 text-blue-200 drop-shadow-lg" />;
      return <Moon className="w-24 h-24 sm:w-32 sm:h-32 text-yellow-200 drop-shadow-lg" />;
    }

    if (condition.includes('clear')) return <Sun className="w-24 h-24 sm:w-32 sm:h-32 text-yellow-400 drop-shadow-lg" />;
    if (condition.includes('cloud')) return <Cloud className="w-24 h-24 sm:w-32 sm:h-32 text-gray-400 drop-shadow-lg" />;
    if (condition.includes('rain')) return <CloudRain className="w-24 h-24 sm:w-32 sm:h-32 text-blue-400 drop-shadow-lg" />;
    if (condition.includes('thunderstorm')) return <CloudLightning className="w-24 h-24 sm:w-32 sm:h-32 text-purple-400 drop-shadow-lg" />;
    if (condition.includes('snow')) return <Snowflake className="w-24 h-24 sm:w-32 sm:h-32 text-blue-300 drop-shadow-lg" />;
    return <Sun className="w-24 h-24 sm:w-32 sm:h-32 text-yellow-400 drop-shadow-lg" />;
  };

  const getWeatherParticles = () => {
    const condition = weather?.condition?.main?.toLowerCase() || 'clear';
    
    if (condition.includes('rain')) {
      return Array.from({ length: 20 }, (_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-6 bg-blue-400 rounded-full opacity-60"
          style={{
            left: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 2}s`,
          }}
          animate={{
            y: [0, 200],
            opacity: [0.6, 0],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      ));
    }
    
    if (condition.includes('snow')) {
      return Array.from({ length: 15 }, (_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 bg-white rounded-full opacity-80"
          style={{
            left: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 3}s`,
          }}
          animate={{
            y: [0, 300],
            x: [0, Math.random() * 50 - 25],
            rotate: [0, 360],
            opacity: [0.8, 0],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      ));
    }
    
    if (condition.includes('clear')) {
      return Array.from({ length: 8 }, (_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-yellow-300 rounded-full"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            scale: [1, 1.5, 1],
            opacity: [0.3, 0.8, 0.3],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            delay: Math.random() * 2,
          }}
        />
      ));
    }
    
    return null;
  };

  return (
    <motion.div
      className="relative overflow-hidden rounded-3xl glass-card p-6 sm:p-8 w-full max-w-4xl mx-auto"
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      style={{
        transformStyle: 'preserve-3d',
        perspective: 1000,
      }}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.3 }}
    >
      {/* 3D Weather Icon */}
      <motion.div
        className="relative z-10 flex justify-center items-center mb-6 sm:mb-8"
        style={{
          rotateX: springRotateX,
          rotateY: springRotateY,
        }}
      >
        <div className="relative">
          {getWeatherIcon()}
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent rounded-full"
            animate={{
              x: [-100, 100],
              opacity: [0, 0.5, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        </div>
      </motion.div>

      {/* Weather Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {getWeatherParticles()}
      </div>

      {/* Temperature Display */}
      <motion.div
        className="text-center mb-6 sm:mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <motion.div
          className="text-4xl sm:text-6xl font-bold text-gray-900 dark:text-white mb-2 sm:mb-4"
          animate={{ scale: isHovered ? 1.1 : 1 }}
          transition={{ duration: 0.3 }}
        >
          {weather?.temperature?.current || '--'}°
        </motion.div>
        
        <motion.div
          className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 font-medium capitalize"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          {weather?.condition?.description || t('Weather condition')}
        </motion.div>
        
        <motion.div
          className="text-sm sm:text-base text-gray-500 dark:text-gray-400 mt-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          {t('Feels like')} {weather?.temperature?.feelsLike || '--'}°
        </motion.div>
      </motion.div>

      {/* Weather Details Grid */}
      <motion.div
        className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
      >
        {/* Humidity */}
        <div className="flex flex-col items-center p-4 bg-white/10 dark:bg-gray-800/20 backdrop-blur-sm rounded-xl border border-white/20 dark:border-gray-700/30">
          <Droplets className="w-6 h-6 text-blue-400 mb-2" />
          <span className="text-sm text-gray-600 dark:text-gray-300 font-medium">{t('Humidity')}</span>
          <span className="text-lg font-bold text-gray-900 dark:text-white">
            {weather?.humidity || '--'}%
          </span>
        </div>

        {/* Wind */}
        <div className="flex flex-col items-center p-4 bg-white/10 dark:bg-gray-800/20 backdrop-blur-sm rounded-xl border border-white/20 dark:border-gray-700/30">
          <Wind className="w-6 h-6 text-green-400 mb-2" />
          <span className="text-sm text-gray-600 dark:text-gray-300 font-medium">{t('Wind')}</span>
          <span className="text-lg font-bold text-gray-900 dark:text-white">
            {weather?.wind?.speed || '--'} km/h
          </span>
        </div>

        {/* Visibility */}
        <div className="flex flex-col items-center p-4 bg-white/10 dark:bg-gray-800/20 backdrop-blur-sm rounded-xl border border-white/20 dark:border-gray-700/30">
          <Eye className="w-6 h-6 text-purple-400 mb-2" />
          <span className="text-sm text-gray-600 dark:text-gray-300 font-medium">{t('Visibility')}</span>
          <span className="text-lg font-bold text-gray-900 dark:text-white">
            {weather?.visibility || '--'} km
          </span>
        </div>

        {/* Pressure */}
        <div className="flex flex-col items-center p-4 bg-white/10 dark:bg-gray-800/20 backdrop-blur-sm rounded-xl border border-white/20 dark:border-gray-700/30">
          <Thermometer className="w-6 h-6 text-red-400 mb-2" />
          <span className="text-sm text-gray-600 dark:text-gray-300 font-medium">{t('Pressure')}</span>
          <span className="text-lg font-bold text-gray-900 dark:text-white">
            {weather?.pressure || '--'} hPa
          </span>
        </div>
      </motion.div>

      {/* Location Info */}
      <motion.div
        className="text-center mt-6 sm:mt-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.0 }}
      >
        <div className="flex items-center justify-center gap-2 text-gray-600 dark:text-gray-300">
          <Compass className="w-4 h-4" />
          <span className="text-sm sm:text-base font-medium">
            {weather?.location || t('Location not available')}
          </span>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default WeatherHero; 