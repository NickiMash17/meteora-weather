import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  Sun, 
  Moon, 
  Cloud, 
  CloudRain, 
  CloudLightning, 
  Snowflake,
  Wind,
  Sparkles,
  Globe,
  ArrowRight,
  MapPin,
  Zap,
  Star,
  BarChart3,
  SkipForward,
  Heart
} from 'lucide-react';
import Lottie from 'lottie-react';
import sunCloudAnim from '../lottie/sun-cloud.json'; // You can swap this for any premium Lottie
import { useTranslation } from 'react-i18next';

export interface WelcomeScreenProps {
  onSearch: (query: string) => void;
  onGetStarted: () => void;
  onSkip: () => void;
}

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onSearch, onGetStarted, onSkip }: WelcomeScreenProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [currentWeather, setCurrentWeather] = useState(0);
  const [showFeatures, setShowFeatures] = useState(false);
  const [factIdx, setFactIdx] = useState(0);
  const { t } = useTranslation();

  const weatherIcons = [
    { icon: Sun, color: 'text-yellow-400', delay: 0 },
    { icon: Cloud, color: 'text-gray-400', delay: 0.5 },
    { icon: CloudRain, color: 'text-blue-400', delay: 1 },
    { icon: CloudLightning, color: 'text-purple-400', delay: 1.5 },
    { icon: Snowflake, color: 'text-blue-300', delay: 2 },
    { icon: Wind, color: 'text-green-400', delay: 2.5 }
  ];

  const features = [
    {
      icon: MapPin,
      title: t('Real-time Weather'),
      description: t('Get current weather conditions for any location'),
      color: 'text-blue-400'
    },
    {
      icon: BarChart3,
      title: t('Detailed Forecasts'),
      description: t('7-day forecasts with hourly breakdowns'),
      color: 'text-purple-400'
    },
    {
      icon: Sun,
      title: t('Beautiful UI'),
      description: t('Modern, responsive design with smooth animations'),
      color: 'text-yellow-400'
    },
    {
      icon: Heart,
      title: t('Personalized'),
      description: t('Save favorite locations and customize your experience'),
      color: 'text-pink-400'
    },
  ];

  const weatherFacts = [
    'The highest temperature ever recorded on Earth was 56.7°C (134°F) in Death Valley, USA.',
    'Raindrops can fall at speeds of about 22 miles per hour.',
    'Snowflakes always have six sides.',
    'A bolt of lightning is five times hotter than the surface of the sun.',
    'The coldest temperature ever recorded was -89.2°C (-128.6°F) in Antarctica.',
    'Clouds look white because they reflect sunlight.',
    'The fastest wind speed ever recorded was 253 mph during Cyclone Olivia.',
    'Fog is actually a cloud that touches the ground.',
    'Hurricanes can release the energy of 10,000 nuclear bombs.',
    'The wettest place on Earth is Mawsynram, India.'
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentWeather((prev) => (prev + 1) % weatherIcons.length);
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowFeatures(true);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setFactIdx(idx => (idx + 1) % weatherFacts.length);
    }, 3500);
    return () => clearInterval(interval);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setIsSearching(true);
      onSearch(searchQuery.trim());
    }
  };

  return (
    <div className="welcome-bg-gradient min-h-screen min-h-dvh flex flex-col items-center justify-center relative overflow-hidden px-2 sm:px-6 py-4 sm:py-8 w-full">
      {/* Animated Lottie and Title */}
      <div className="flex flex-col items-center gap-6 z-20 mt-8 mb-8 w-full max-w-xs sm:max-w-md md:max-w-lg lg:max-w-2xl mx-auto">
        <div className="w-40 h-40 sm:w-56 sm:h-56 relative flex items-center justify-center">
          <Lottie animationData={sunCloudAnim} loop autoplay style={{ width: '100%', height: '100%' }} />
        </div>
        <h1 className="text-5xl sm:text-6xl font-extrabold bg-gradient-to-r from-blue-500 via-purple-500 to-pink-400 bg-clip-text text-transparent drop-shadow-lg animate-gradient-glow text-center">
          Meteora
        </h1>
        <p className="text-xl sm:text-2xl font-medium text-white/90 dark:text-gray-200 text-center">
          Your next-gen, animated weather dashboard
        </p>
      </div>
      {/* Rotating Weather Fact */}
      <div className="bg-white/30 dark:bg-gray-900/40 rounded-xl px-4 sm:px-6 py-3 sm:py-4 shadow-lg backdrop-blur-md mb-8 z-20 max-w-xs sm:max-w-lg text-center animate-fade-in mx-auto">
        <span className="text-base sm:text-lg font-semibold text-blue-700 dark:text-blue-200">
          {weatherFacts[factIdx]}
        </span>
      </div>
      {/* Get Started Button and Search Input Grouped */}
      <div className="flex flex-col items-center gap-4 w-full max-w-md z-20">
        <button
          className="px-8 py-3 rounded-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-400 text-white font-bold text-lg shadow-xl hover:scale-105 active:scale-95 transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-blue-300 animate-bounce"
          onClick={onGetStarted}
          aria-label="Get Started"
        >
          Get Started
        </button>
        <form onSubmit={handleSearch} className="w-full mt-2">
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Enter city name..."
              className="w-full px-6 py-4 text-lg bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl text-white placeholder-white/60 focus:outline-none focus:border-white/40 focus:bg-white/15 transition-all duration-300"
            />
            <button
              type="submit"
              disabled={isSearching}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl text-white hover:from-blue-600 hover:to-purple-700 transition-all duration-300 disabled:opacity-50"
            >
              {isSearching ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <Search className="w-5 h-5" />
              )}
            </button>
          </div>
        </form>
      </div>
      {/* Animated gradient background */}
      <div className="absolute inset-0 -z-10 welcome-bg-gradient" />
      {/* Floating Weather Icons */}
      <div className="absolute inset-0 overflow-hidden">
        {weatherIcons.map((weather, index) => {
          const Icon = weather.icon;
          return (
            <motion.div
              key={index}
              className={`absolute ${weather.color}`}
              style={{
                left: `${20 + (index * 15)}%`,
                top: `${20 + (index * 10)}%`,
              }}
              initial={{ opacity: 0, scale: 0, y: 50 }}
              animate={{ 
                opacity: currentWeather === index ? 1 : 0.3,
                scale: currentWeather === index ? 1.2 : 0.8,
                y: currentWeather === index ? 0 : 20
              }}
              transition={{ 
                duration: 0.5,
                delay: weather.delay,
                ease: "easeInOut"
              }}
            >
              <Icon className="w-16 h-16" />
            </motion.div>
          );
        })}
      </div>

      {/* Main Content */}
      <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
        {/* Logo and Title */}
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-12"
        >
          <motion.div
            className="inline-block mb-6"
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          >
            <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto">
              <Globe className="w-12 h-12 text-white" />
            </div>
          </motion.div>
          
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-4">
            <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Meteora
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-white/80 font-light">
            Your Personal Weather Companion
          </p>
        </motion.div>

        {/* Features Grid */}
        <AnimatePresence>
          {showFeatures && (
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12"
            >
              {features.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <motion.div
                    key={feature.title}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.8 + index * 0.1 }}
                    className="glass-card p-6 rounded-2xl hover:scale-105 transition-transform duration-300"
                  >
                    <div className={`${feature.color} mb-4`}>
                      <Icon className="w-8 h-8 mx-auto" />
                    </div>
                    <h3 className="text-lg font-semibold text-white mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-white/70 text-sm">
                      {feature.description}
                    </p>
                  </motion.div>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 1.2 }}
          className="text-center"
        >
          <p className="text-white/60 mb-4">
            Start exploring weather around the world
          </p>
          <motion.div
            animate={{ x: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="inline-flex items-center text-white/80"
          >
            <ArrowRight className="w-5 h-5 mr-2" />
            <span>Type a city name above</span>
          </motion.div>
        </motion.div>
      </div>

      {/* Floating Elements */}
      <motion.div
        className="absolute top-10 right-10"
        animate={{ rotate: 360 }}
        transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
      >
        <Sparkles className="w-8 h-8 text-yellow-400 opacity-60" />
      </motion.div>

      <motion.div
        className="absolute bottom-10 left-10"
        animate={{ y: [0, -20, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      >
        <Star className="w-6 h-6 text-blue-400 opacity-60" />
      </motion.div>

      <motion.div
        className="absolute top-1/2 left-10"
        animate={{ scale: [1, 1.2, 1] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      >
        <MapPin className="w-6 h-6 text-purple-400 opacity-60" />
      </motion.div>
    </div>
  );
};

export default WelcomeScreen; 