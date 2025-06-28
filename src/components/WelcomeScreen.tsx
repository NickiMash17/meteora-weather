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
  Star
} from 'lucide-react';

interface WelcomeScreenProps {
  onSearch: (query: string) => void;
}

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onSearch }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [currentWeather, setCurrentWeather] = useState(0);
  const [showFeatures, setShowFeatures] = useState(false);

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
      icon: Globe,
      title: 'Global Coverage',
      description: 'Get weather data from anywhere in the world',
      color: 'text-blue-400'
    },
    {
      icon: Sparkles,
      title: 'AI Insights',
      description: 'Smart recommendations based on weather conditions',
      color: 'text-purple-400'
    },
    {
      icon: Zap,
      title: 'Real-time Updates',
      description: 'Live weather data and instant notifications',
      color: 'text-yellow-400'
    },
    {
      icon: Star,
      title: 'Beautiful Design',
      description: 'Stunning visuals and smooth animations',
      color: 'text-pink-400'
    }
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

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setIsSearching(true);
      onSearch(searchQuery.trim());
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900 via-purple-900 to-pink-900">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-pulse" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/20 to-black/40" />
      </div>

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

        {/* Search Form */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="mb-12"
        >
          <form onSubmit={handleSearch} className="max-w-md mx-auto">
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