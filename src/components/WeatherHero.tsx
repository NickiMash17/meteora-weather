import React, { useState, useEffect } from 'react';
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
  Zap,
  Sparkles,
  Star,
  Compass
} from 'lucide-react';

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
    const hour = new Date().getHours();
    const isDaytime = hour >= 6 && hour < 18;

    if (!isDaytime) {
      if (condition.includes('clear')) return <Moon className="w-32 h-32 text-yellow-200" />;
      if (condition.includes('cloud')) return <Cloud className="w-32 h-32 text-gray-300" />;
      if (condition.includes('rain')) return <CloudRain className="w-32 h-32 text-blue-300" />;
      if (condition.includes('thunderstorm')) return <CloudLightning className="w-32 h-32 text-purple-300" />;
      if (condition.includes('snow')) return <Snowflake className="w-32 h-32 text-blue-200" />;
      return <Moon className="w-32 h-32 text-yellow-200" />;
    }

    if (condition.includes('clear')) return <Sun className="w-32 h-32 text-yellow-400" />;
    if (condition.includes('cloud')) return <Cloud className="w-32 h-32 text-gray-400" />;
    if (condition.includes('rain')) return <CloudRain className="w-32 h-32 text-blue-400" />;
    if (condition.includes('thunderstorm')) return <CloudLightning className="w-32 h-32 text-purple-400" />;
    if (condition.includes('snow')) return <Snowflake className="w-32 h-32 text-blue-300" />;
    return <Sun className="w-32 h-32 text-yellow-400" />;
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
      className="relative overflow-hidden rounded-3xl glass-card p-8"
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
        className="relative z-10 flex justify-center items-center mb-6"
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
        className="text-center mb-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <motion.div
          className="text-6xl font-bold text-white mb-2"
          animate={{ scale: isHovered ? 1.1 : 1 }}
          transition={{ duration: 0.3 }}
        >
          {weather?.temperature?.current}°
        </motion.div>
        <div className="text-xl text-white/80 font-medium">
          {weather?.condition?.description}
        </div>
      </motion.div>

      {/* Weather Stats Grid */}
      <motion.div
        className="grid grid-cols-2 gap-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <motion.div
          className="flex items-center justify-center p-4 rounded-2xl bg-white/10 backdrop-blur-sm"
          whileHover={{ scale: 1.05, backgroundColor: 'rgba(255, 255, 255, 0.15)' }}
          transition={{ duration: 0.2 }}
        >
          <Thermometer className="w-6 h-6 text-red-400 mr-3" />
          <div>
            <div className="text-sm text-white/60">Feels Like</div>
            <div className="text-lg font-semibold text-white">
              {weather?.temperature?.feels_like}°
            </div>
          </div>
        </motion.div>

        <motion.div
          className="flex items-center justify-center p-4 rounded-2xl bg-white/10 backdrop-blur-sm"
          whileHover={{ scale: 1.05, backgroundColor: 'rgba(255, 255, 255, 0.15)' }}
          transition={{ duration: 0.2 }}
        >
          <Droplets className="w-6 h-6 text-blue-400 mr-3" />
          <div>
            <div className="text-sm text-white/60">Humidity</div>
            <div className="text-lg font-semibold text-white">
              {weather?.humidity}%
            </div>
          </div>
        </motion.div>

        <motion.div
          className="flex items-center justify-center p-4 rounded-2xl bg-white/10 backdrop-blur-sm"
          whileHover={{ scale: 1.05, backgroundColor: 'rgba(255, 255, 255, 0.15)' }}
          transition={{ duration: 0.2 }}
        >
          <Wind className="w-6 h-6 text-green-400 mr-3" />
          <div>
            <div className="text-sm text-white/60">Wind</div>
            <div className="text-lg font-semibold text-white">
              {weather?.wind?.speed} km/h
            </div>
          </div>
        </motion.div>

        <motion.div
          className="flex items-center justify-center p-4 rounded-2xl bg-white/10 backdrop-blur-sm"
          whileHover={{ scale: 1.05, backgroundColor: 'rgba(255, 255, 255, 0.15)' }}
          transition={{ duration: 0.2 }}
        >
          <Eye className="w-6 h-6 text-purple-400 mr-3" />
          <div>
            <div className="text-sm text-white/60">Visibility</div>
            <div className="text-lg font-semibold text-white">
              {weather?.visibility} km
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* Location and Time */}
      <motion.div
        className="text-center mt-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
      >
        <div className="text-2xl font-bold text-white mb-2">
          {weather?.location}
        </div>
        <div className="text-white/70">
          {new Date().toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}
        </div>
      </motion.div>

      {/* Floating Elements */}
      <motion.div
        className="absolute top-4 right-4"
        animate={{ rotate: 360 }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
      >
        <Sparkles className="w-8 h-8 text-yellow-400 opacity-60" />
      </motion.div>

      <motion.div
        className="absolute bottom-4 left-4"
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      >
        <Star className="w-6 h-6 text-blue-400 opacity-60" />
      </motion.div>
    </motion.div>
  );
};

export default WeatherHero; 