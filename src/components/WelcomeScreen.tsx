import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sun,
  Cloud,
  CloudRain,
  CloudLightning,
  Snowflake,
  Wind,
  Thermometer,
  Droplets,
  Eye,
  MapPin,
  Calendar,
  BarChart3,
  AlertTriangle,
  Sparkles,
  Image,
  Volume2,
  Trophy,
  Brain,
  Music,
  Play,
  Pause,
  SkipForward
} from 'lucide-react';

interface WelcomeScreenProps {
  onSearch: (query: string) => void;
  onSkip?: () => void;
}

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onSearch }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentIconIndex, setCurrentIconIndex] = useState(0);
  const [currentFactIndex, setCurrentFactIndex] = useState(0);

  const weatherIcons = [
    { icon: Sun, name: 'Sunny', color: 'text-yellow-400' },
    { icon: Cloud, name: 'Cloudy', color: 'text-gray-400' },
    { icon: CloudRain, name: 'Rainy', color: 'text-blue-400' },
    { icon: CloudLightning, name: 'Stormy', color: 'text-purple-400' },
    { icon: Snowflake, name: 'Snowy', color: 'text-blue-200' },
    { icon: Wind, name: 'Windy', color: 'text-green-400' }
  ];

  const weatherFacts = [
    'Lightning can heat the air around it to 30,000°C (54,000°F)',
    'The highest temperature ever recorded on Earth was 56.7°C (134°F) in Death Valley',
    'Snowflakes are always six-sided due to the molecular structure of ice',
    'Raindrops are not tear-shaped - they are actually spherical',
    'The windiest place on Earth is Commonwealth Bay, Antarctica',
    'A rainbow is actually a full circle, but we only see half of it from the ground'
  ];

  const features = [
    {
      icon: Thermometer,
      title: 'Real-time Weather',
      description: 'Get accurate, up-to-the-minute weather data for any location worldwide'
    },
    {
      icon: Calendar,
      title: '5-Day Forecast',
      description: 'Plan ahead with detailed weather predictions for the coming week'
    },
    {
      icon: BarChart3,
      title: 'Weather Analytics',
      description: 'Analyze weather patterns and trends with interactive charts'
    },
    {
      icon: AlertTriangle,
      title: 'Weather Alerts',
      description: 'Stay informed with severe weather warnings and notifications'
    },
    {
      icon: Sparkles,
      title: 'AI Insights',
      description: 'Get intelligent weather recommendations and insights'
    },
    {
      icon: Image,
      title: 'Weather Gallery',
      description: 'Explore beautiful weather photography and visualizations'
    }
  ];

  // Rotate weather icons
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIconIndex((prev) => (prev + 1) % weatherIcons.length);
    }, 2000);

    return () => clearInterval(interval);
  }, [weatherIcons.length]);

  // Rotate weather facts
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentFactIndex((prev) => (prev + 1) % weatherFacts.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [weatherFacts.length]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      onSearch(searchQuery.trim());
    }
  };

  const nextStep = () => {
    if (currentStep < 2) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        <AnimatePresence mode="wait">
          {currentStep === 0 && (
            <motion.div
              key="welcome"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="text-center space-y-8"
            >
              {/* Animated Weather Icon */}
              <motion.div
                key={currentIconIndex}
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ duration: 0.5 }}
                className="flex justify-center"
              >
                <div className={`p-8 rounded-full bg-white/20 dark:bg-gray-800/20 backdrop-blur-sm ${weatherIcons[currentIconIndex].color}`}>
                  {React.createElement(weatherIcons[currentIconIndex].icon, { className: 'w-16 h-16' })}
                </div>
              </motion.div>

              <div className="space-y-4">
                <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Meteora Weather
                </h1>
                <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                  Your intelligent weather companion with AI-powered insights, beautiful visualizations, and gamified weather tracking.
                </p>
              </div>

              {/* Weather Fact */}
              <motion.div
                key={currentFactIndex}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="bg-white/20 dark:bg-gray-800/20 backdrop-blur-sm rounded-2xl p-6 max-w-2xl mx-auto"
              >
                <div className="flex items-center gap-3 mb-3">
                  <Sparkles className="w-5 h-5 text-yellow-400" />
                  <span className="text-sm font-medium text-gray-600 dark:text-gray-300">Did you know?</span>
                </div>
                <p className="text-gray-700 dark:text-gray-200 italic">
                  {weatherFacts[currentFactIndex]}
                </p>
              </motion.div>

              <div className="flex justify-center gap-4">
                <button
                  onClick={nextStep}
                  className="px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-full font-semibold hover:from-blue-600 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl"
                >
                  Get Started
                </button>
              </div>
            </motion.div>
          )}

          {currentStep === 1 && (
            <motion.div
              key="features"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              <div className="text-center space-y-4">
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                  Discover Amazing Features
                </h2>
                <p className="text-gray-600 dark:text-gray-300">
                  Explore what makes Meteora Weather unique
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {features.map((feature, index) => (
                  <motion.div
                    key={`feature-${index}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-white/20 dark:bg-gray-800/20 backdrop-blur-sm rounded-2xl p-6 hover:bg-white/30 dark:hover:bg-gray-800/30 transition-all duration-300"
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <div className="p-2 rounded-lg bg-blue-500/10">
                        <feature.icon className="w-6 h-6 text-blue-500" />
                      </div>
                      <h3 className="font-semibold text-gray-900 dark:text-white">
                        {feature.title}
                      </h3>
                    </div>
                    <p className="text-gray-600 dark:text-gray-300 text-sm">
                      {feature.description}
                    </p>
                  </motion.div>
                ))}
              </div>

              <div className="flex justify-between">
                <button
                  onClick={prevStep}
                  className="px-6 py-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
                >
                  Back
                </button>
                <button
                  onClick={nextStep}
                  className="px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-full font-semibold hover:from-blue-600 hover:to-purple-700 transition-all duration-300"
                >
                  Continue
                </button>
              </div>
            </motion.div>
          )}

          {currentStep === 2 && (
            <motion.div
              key="search"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="text-center space-y-8"
            >
              <div className="space-y-4">
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                  Ready to Start?
                </h2>
                <p className="text-gray-600 dark:text-gray-300">
                  Search for your location to get started with Meteora Weather
                </p>
              </div>

              <form onSubmit={handleSearch} className="max-w-md mx-auto space-y-4">
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Enter city name..."
                    className="w-full pl-10 pr-4 py-3 bg-white/20 dark:bg-gray-800/20 backdrop-blur-sm border border-gray-200 dark:border-gray-700 rounded-full text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-full font-semibold hover:from-blue-600 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl"
                >
                  Get Weather
                </button>
              </form>

              <div className="flex justify-center">
                <button
                  onClick={prevStep}
                  className="px-6 py-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
                >
                  Back
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default WelcomeScreen; 