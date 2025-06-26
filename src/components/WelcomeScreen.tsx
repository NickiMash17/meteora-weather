import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, MapPin, Sparkles, Globe, BarChart3, Zap, Cloud, Sun, Moon, Star, Wind, Thermometer } from 'lucide-react';

interface WelcomeScreenProps {
  onSearch?: (query: string) => void;
}

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onSearch }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim() && onSearch) {
      onSearch(searchQuery);
    }
  };

  const isDaytime = currentTime.getHours() >= 6 && currentTime.getHours() < 18;

  return (
    <div className="min-h-screen relative overflow-hidden pro-bg-gradient">
      {/* Professional + Creative Background Layers */}
      <div className="absolute inset-0">
        {/* Animated Aurora Overlay */}
        <div className="pro-aurora" />
        {/* Bokeh Circles */}
        <div className="pro-bokeh">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="pro-bokeh-circle"
              style={{
                width: `${60 + Math.random() * 80}px`,
                height: `${60 + Math.random() * 80}px`,
                left: `${Math.random() * 90}%`,
                top: `${Math.random() * 80}%`,
                animationDelay: `${Math.random() * 8}s`,
                opacity: 0.5 + Math.random() * 0.3,
              }}
            />
          ))}
        </div>
        {/* Floating Particles */}
        <div className="pro-particles">
          {Array.from({ length: 18 }).map((_, i) => (
            <div
              key={i}
              className="pro-particle"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 10}s`,
                opacity: 0.12 + Math.random() * 0.18,
              }}
            />
          ))}
        </div>
        {/* Existing animated weather icons, meteors, and stars remain layered above */}
        <div className="absolute inset-0 pointer-events-none">
          {Array.from({ length: 8 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute"
              animate={{
                x: [0, 100, 0],
                y: [0, -50, 0],
                rotate: [0, 360],
                scale: [1, 1.2, 1],
              }}
              transition={{
                duration: 15 + i * 2,
                repeat: Infinity,
                ease: "easeInOut",
                delay: i * 0.5
              }}
              style={{
                left: `${10 + i * 12}%`,
                top: `${20 + i * 8}%`,
              }}
            >
              {i % 4 === 0 && <Cloud className="w-8 h-8 text-white/30" />}
              {i % 4 === 1 && <Sun className="w-8 h-8 text-white/30" />}
              {i % 4 === 2 && <Moon className="w-8 h-8 text-white/30" />}
              {i % 4 === 3 && <Star className="w-8 h-8 text-white/30" />}
            </motion.div>
          ))}
        </div>
        {/* Meteor Shower */}
        <div className="meteor-shower">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="meteor"
              style={{
                top: `${Math.random() * 50}%`,
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${2 + Math.random() * 2}s`
              }}
            />
          ))}
        </div>
        {/* Stars for Night */}
        {!isDaytime && (
          <div className="stars">
            {Array.from({ length: 50 }).map((_, i) => (
              <div
                key={i}
                className="star"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 3}s`,
                  animationDuration: `${2 + Math.random() * 2}s`
                }}
              />
            ))}
          </div>
        )}
      </div>

      <div className="relative z-10 min-h-screen flex items-center justify-center px-4 sm:px-6">
        <div className="max-w-4xl sm:max-w-6xl mx-auto text-center">
          {/* Main Content */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
          >
            {/* Logo and Title */}
            <motion.div
              className="flex items-center justify-center mb-8 sm:mb-12 flex-col sm:flex-row mt-12 sm:mt-20 pt-8 sm:pt-16"
              whileHover={{ scale: 1.05 }}
            >
              <motion.div
                className="w-16 h-16 sm:w-24 sm:h-24 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center mb-4 sm:mb-0 sm:mr-6"
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              >
                <Sparkles className="w-8 h-8 sm:w-14 sm:h-14 text-white" />
              </motion.div>
              <div>
                <h1 className="text-4xl sm:text-7xl font-bold text-white font-display text-shadow-xl mb-2">
                  Meteora
                </h1>
                <p className="text-sm sm:text-xl text-white/80">Weather Reimagined</p>
              </div>
            </motion.div>

            {/* Tagline */}
            <motion.h2
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 1 }}
              className="text-xl sm:text-3xl text-white/90 mb-10 sm:mb-16 font-light text-shadow-lg px-4"
            >
              Experience weather like never before with stunning visualizations and AI-powered insights
            </motion.h2>

            {/* Search Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 1 }}
              className="max-w-lg sm:max-w-2xl mx-auto mb-16 sm:mb-20 px-4"
            >
              <form onSubmit={handleSubmit} className="relative">
                <div className="relative">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search for a city or location..."
                    className="w-full px-6 sm:px-8 py-4 sm:py-6 pl-12 sm:pl-16 text-base sm:text-xl bg-white/20 backdrop-blur-md border border-white/30 rounded-full text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent transition-all input-glass"
                  />
                  <Search className="absolute left-4 sm:left-6 top-1/2 transform -translate-y-1/2 w-6 h-6 sm:w-8 sm:h-8 text-white/70" />
                  <motion.button
                    type="submit"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 px-4 sm:px-8 py-2 sm:py-4 bg-white/20 backdrop-blur-sm text-white rounded-full hover:bg-white/30 transition-all btn-primary text-sm sm:text-base"
                  >
                    Explore
                  </motion.button>
                </div>
              </form>
            </motion.div>

            {/* Features Grid */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 1 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-8 px-4 mb-16 sm:mb-20"
            >
              {[
                {
                  icon: Globe,
                  title: "Interactive Maps",
                  description: "Explore weather patterns across the globe with beautiful interactive maps",
                  color: "from-blue-400 to-cyan-400"
                },
                {
                  icon: BarChart3,
                  title: "Advanced Analytics",
                  description: "Get detailed weather insights and trends with powerful analytics",
                  color: "from-purple-400 to-pink-400"
                },
                {
                  icon: Zap,
                  title: "Real-time Updates",
                  description: "Stay informed with real-time weather updates and smart alerts",
                  color: "from-yellow-400 to-orange-400"
                },
                {
                  icon: Thermometer,
                  title: "Precise Forecasts",
                  description: "Accurate weather predictions with detailed hourly and daily forecasts",
                  color: "from-green-400 to-emerald-400"
                }
              ].map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <motion.div
                    key={feature.title}
                    className="p-6 sm:p-8 bg-white/10 backdrop-blur-md rounded-xl sm:rounded-2xl border border-white/20 card-hover"
                    whileHover={{ scale: 1.02, y: -8 }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1 + index * 0.1 }}
                  >
                    <div className={`w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br ${feature.color} rounded-full flex items-center justify-center mb-4 sm:mb-6 mx-auto shadow-lg`}>
                      <Icon className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                    </div>
                    <h3 className="text-lg sm:text-2xl font-semibold text-white mb-3 sm:mb-4 text-shadow">
                      {feature.title}
                    </h3>
                    <p className="text-white/80 text-sm sm:text-base leading-relaxed">
                      {feature.description}
                    </p>
                  </motion.div>
                );
              })}
            </motion.div>

            {/* Call to Action */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.5, duration: 1 }}
              className="px-4 pb-8 sm:pb-12"
            >
              <p className="text-white/60 text-base sm:text-lg mb-6 sm:mb-8">
                Ready to experience the future of weather?
              </p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => onSearch?.('New York')}
                className="px-8 sm:px-12 py-4 sm:py-6 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full text-lg sm:text-xl font-semibold hover:from-purple-600 hover:to-pink-600 transition-all shadow-2xl"
              >
                Get Started Now
              </motion.button>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default WelcomeScreen; 