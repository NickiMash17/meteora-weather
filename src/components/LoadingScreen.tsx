import React from 'react';
import { motion } from 'framer-motion';
import { Cloud, Sun, CloudRain, Snowflake, Wind, Thermometer, MapPin, Sparkles } from 'lucide-react';

const LoadingScreen: React.FC = () => {
  const getWeatherIcon = () => {
    const icons = [Cloud, Sun, CloudRain, Snowflake, Wind, Thermometer];
    const randomIcon = icons[Math.floor(Math.random() * icons.length)];
    return randomIcon;
  };

  const WeatherIcon = getWeatherIcon();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md">
      {/* Enhanced Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Floating Particles */}
        {Array.from({ length: 15 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-white/30 rounded-full"
            animate={{
              x: [0, 100, 0],
              y: [0, -100, 0],
              scale: [0, 1, 0],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
          />
        ))}

        {/* Energy Rings */}
        {Array.from({ length: 3 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute inset-0 border-2 border-white/20 rounded-full"
            animate={{
              scale: [0.5, 2, 0.5],
              opacity: [0, 0.3, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              delay: i * 0.6,
            }}
            style={{
              left: '50%',
              top: '50%',
              transform: 'translate(-50%, -50%)',
            }}
          />
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center relative z-10"
      >
        {/* Main Loading Container */}
        <motion.div
          className="glass-card rounded-3xl p-8 sm:p-12 max-w-md mx-auto"
          animate={{
            boxShadow: [
              "0 0 20px rgba(255, 255, 255, 0.1)",
              "0 0 40px rgba(255, 255, 255, 0.2)",
              "0 0 20px rgba(255, 255, 255, 0.1)",
            ],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          {/* Enhanced Loading Spinner */}
          <div className="relative mb-8">
            {/* Outer Ring */}
            <motion.div
              className="w-24 h-24 sm:w-32 sm:h-32 border-4 border-white/20 rounded-full mx-auto"
              animate={{ rotate: 360 }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            />
            
            {/* Inner Ring */}
            <motion.div
              className="absolute top-2 left-2 sm:top-4 sm:left-4 w-20 h-20 sm:w-24 sm:h-24 border-4 border-white/40 rounded-full"
              animate={{ rotate: -360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            />
            
            {/* Center Icon */}
            <motion.div
              className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
              animate={{ 
                scale: [1, 1.2, 1],
                rotate: [0, 10, -10, 0]
              }}
              transition={{ 
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              <WeatherIcon className="w-8 h-8 sm:w-12 sm:h-12 text-white/90" />
            </motion.div>

            {/* Orbiting Particles */}
            {Array.from({ length: 6 }).map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-2 h-2 bg-white/60 rounded-full"
                animate={{
                  x: [0, 40, 0],
                  y: [0, -40, 0],
                  scale: [0, 1, 0],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  delay: i * 0.3,
                }}
                style={{
                  left: '50%',
                  top: '50%',
                  transform: 'translate(-50%, -50%)',
                }}
              />
            ))}
          </div>

          {/* Loading Text with Typing Effect */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mb-6"
          >
            <motion.h2
              className="text-2xl sm:text-3xl font-bold text-white mb-3"
              animate={{
                textShadow: [
                  "0 0 10px rgba(255, 255, 255, 0.5)",
                  "0 0 20px rgba(255, 255, 255, 0.8)",
                  "0 0 10px rgba(255, 255, 255, 0.5)",
                ],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              Loading Weather Data
            </motion.h2>
            
            <motion.p
              className="text-white/70 text-sm sm:text-base mb-4"
              animate={{ opacity: [0.7, 1, 0.7] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              Fetching the latest weather information...
            </motion.p>

            {/* Progress Bar */}
            <div className="w-full bg-white/20 rounded-full h-2 mb-4">
              <motion.div
                className="bg-gradient-to-r from-blue-400 to-purple-400 h-2 rounded-full"
                initial={{ width: "0%" }}
                animate={{ width: "100%" }}
                transition={{ duration: 3, ease: "easeInOut" }}
              />
            </div>
          </motion.div>

          {/* Enhanced Animated Dots */}
          <motion.div
            className="flex justify-center space-x-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
          >
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className="w-3 h-3 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full"
                animate={{
                  scale: [1, 1.5, 1],
                  opacity: [0.6, 1, 0.6],
                  y: [0, -5, 0],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  delay: i * 0.2,
                }}
              />
            ))}
          </motion.div>

          {/* Loading Steps */}
          <motion.div
            className="mt-6 space-y-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5 }}
          >
            {[
              { icon: MapPin, text: "Locating your city...", delay: 0 },
              { icon: Thermometer, text: "Gathering temperature data...", delay: 0.5 },
              { icon: Wind, text: "Analyzing weather patterns...", delay: 1 },
              { icon: Sparkles, text: "Preparing insights...", delay: 1.5 },
            ].map((step, index) => {
              const Icon = step.icon;
              return (
                <motion.div
                  key={index}
                  className="flex items-center space-x-3 text-white/60 text-sm"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: step.delay }}
                >
                  <motion.div
                    animate={{ rotate: [0, 360] }}
                    transition={{ duration: 2, repeat: Infinity, delay: step.delay }}
                  >
                    <Icon className="w-4 h-4" />
                  </motion.div>
                  <span>{step.text}</span>
                </motion.div>
              );
            })}
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default LoadingScreen; 