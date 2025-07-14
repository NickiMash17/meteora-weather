import React, { useState, useEffect, useRef } from 'react';
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
  SkipForward,
  Navigation,
  Zap,
  Heart,
  Star,
  Globe,
  Clock,
  Users,
  Award,
  Coffee,
  TreePine,
  Umbrella,
  Moon,
  Sunrise,
  Sunset
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
  const [isLoading, setIsLoading] = useState(false);
  const [showParticles, setShowParticles] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [userLocation, setUserLocation] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

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
    'A rainbow is actually a full circle, but we only see half of it from the ground',
    'The fastest wind speed ever recorded was 253 mph during Cyclone Olivia',
    'Fog is actually a cloud that touches the ground',
    'Hurricanes can release the energy of 10,000 nuclear bombs',
    'The wettest place on Earth is Mawsynram, India'
  ];

  const testimonials = [
    { name: 'Sarah M.', text: 'Amazing weather insights! The AI recommendations are spot on.', rating: 5 },
    { name: 'Mike R.', text: 'Beautiful interface and accurate forecasts. Love the gamification!', rating: 5 },
    { name: 'Emma L.', text: 'Perfect for planning outdoor activities. The alerts are lifesavers.', rating: 5 }
  ];

  const achievements = [
    { icon: Trophy, title: 'Weather Master', description: 'Check weather for 7 consecutive days' },
    { icon: Zap, title: 'Storm Chaser', description: 'Experience 5 different weather conditions' },
    { icon: Heart, title: 'Weather Enthusiast', description: 'Use the app for 30 days' },
    { icon: Star, title: 'Forecast Pro', description: 'Achieve 95% forecast accuracy rating' }
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

  // Update current time
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Animated background particles
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      opacity: number;
      color: string;
    }> = [];

    // Create particles based on time of day
    const hour = currentTime.getHours();
    const isDaytime = hour >= 6 && hour < 18;
    
    for (let i = 0; i < 50; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        size: Math.random() * 2 + 1,
        opacity: Math.random() * 0.6 + 0.2,
        color: isDaytime ? '#fbbf24' : '#a78bfa'
      });
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach(particle => {
        particle.x += particle.vx;
        particle.y += particle.vy;

        if (particle.x < 0) particle.x = canvas.width;
        if (particle.x > canvas.width) particle.x = 0;
        if (particle.y < 0) particle.y = canvas.height;
        if (particle.y > canvas.height) particle.y = 0;

        ctx.save();
        ctx.globalAlpha = particle.opacity;
        ctx.fillStyle = particle.color;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });

      requestAnimationFrame(animate);
    };

    animate();
  }, [currentTime]);

  const getLocation = () => {
    setIsLoading(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          // Reverse geocoding would go here
          setUserLocation('Your Location');
          setIsLoading(false);
        },
        () => {
          setIsLoading(false);
        }
      );
    }
  };

  const getTimeOfDay = () => {
    const hour = currentTime.getHours();
    if (hour >= 5 && hour < 12) return { text: 'Good Morning', icon: Sunrise };
    if (hour >= 12 && hour < 17) return { text: 'Good Afternoon', icon: Sun };
    if (hour >= 17 && hour < 21) return { text: 'Good Evening', icon: Sunset };
    return { text: 'Good Night', icon: Moon };
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      onSearch(searchQuery.trim());
    }
  };

  const nextStep = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-4">
      {/* Animated Background */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 pointer-events-none opacity-30"
      />
      
      {/* Floating Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          className="absolute top-20 left-20"
          animate={{ y: [0, -20, 0], rotate: [0, 5, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        >
          <Star className="w-8 h-8 text-yellow-400 opacity-60" />
        </motion.div>
        <motion.div
          className="absolute top-40 right-32"
          animate={{ y: [0, 15, 0], rotate: [0, -3, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        >
          <Cloud className="w-12 h-12 text-blue-400 opacity-40" />
        </motion.div>
        <motion.div
          className="absolute bottom-32 left-32"
          animate={{ x: [0, 10, 0], scale: [1, 1.1, 1] }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
        >
          <Sparkles className="w-6 h-6 text-purple-400 opacity-50" />
        </motion.div>
      </div>

      <div className="max-w-4xl w-full relative z-10 pt-16">
        {/* Progress Indicator */}
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-20">
          <div className="flex items-center gap-2">
            {[0, 1, 2, 3].map((step) => (
              <div
                key={step}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  step <= currentStep 
                    ? 'bg-blue-500 scale-110' 
                    : 'bg-gray-300 dark:bg-gray-600'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Skip Button */}
        <button
          onClick={() => onSearch('London')} // Default city
          className="absolute top-4 right-4 z-20 px-4 py-2 text-sm text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
        >
          Skip
        </button>

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
                {/* Time-based greeting */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center justify-center gap-2 text-lg text-gray-600 dark:text-gray-300"
                >
                  {React.createElement(getTimeOfDay().icon, { className: 'w-5 h-5' })}
                  <span>{getTimeOfDay().text}</span>
                </motion.div>

                <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Meteora Weather
                </h1>
                <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                  Your intelligent weather companion with AI-powered insights, beautiful visualizations, and gamified weather tracking.
                </p>
                
                {/* Current time */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="text-sm text-gray-500 dark:text-gray-400"
                >
                  {currentTime.toLocaleTimeString()}
                </motion.div>
              </div>

              {/* Weather Fact */}
              <motion.div
                key={currentFactIndex}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="bg-white/20 dark:bg-gray-800/20 backdrop-blur-sm rounded-2xl p-6 max-w-2xl mx-auto relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-yellow-400/20 to-orange-500/20 rounded-full -translate-y-10 translate-x-10" />
                <div className="relative z-10">
                  <div className="flex items-center gap-3 mb-3">
                    <Sparkles className="w-5 h-5 text-yellow-400" />
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-300">Did you know?</span>
                  </div>
                  <p className="text-gray-700 dark:text-gray-200 italic">
                    {weatherFacts[currentFactIndex]}
                  </p>
                </div>
              </motion.div>

              <div className="flex justify-center gap-4">
                <button
                  onClick={nextStep}
                  className="px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-full font-semibold hover:from-blue-600 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95"
                >
                  Get Started
                </button>
                <button
                  onClick={() => setShowParticles(!showParticles)}
                  className="px-4 py-3 bg-white/20 dark:bg-gray-800/20 backdrop-blur-sm border border-gray-200 dark:border-gray-700 rounded-full text-gray-700 dark:text-gray-300 hover:bg-white/30 dark:hover:bg-gray-800/30 transition-all duration-300"
                >
                  {showParticles ? 'Hide' : 'Show'} Effects
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
              key="testimonials"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              <div className="text-center space-y-4">
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                  What Users Say
                </h2>
                <p className="text-gray-600 dark:text-gray-300">
                  Join thousands of satisfied weather enthusiasts
                </p>
              </div>

              {/* Testimonials */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {testimonials.map((testimonial, index) => (
                  <motion.div
                    key={`testimonial-${index}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.2 }}
                    className="bg-white/20 dark:bg-gray-800/20 backdrop-blur-sm rounded-2xl p-6 hover:bg-white/30 dark:hover:bg-gray-800/30 transition-all duration-300"
                  >
                    <div className="flex items-center gap-1 mb-3">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                      ))}
                    </div>
                    <p className="text-gray-700 dark:text-gray-200 text-sm mb-3 italic">
                      "{testimonial.text}"
                    </p>
                    <p className="text-gray-600 dark:text-gray-300 text-xs font-medium">
                      — {testimonial.name}
                    </p>
                  </motion.div>
                ))}
              </div>

              {/* Achievements Preview */}
              <div className="text-center space-y-4">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Unlock Achievements
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {achievements.map((achievement, index) => (
                    <motion.div
                      key={`achievement-${index}`}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.1 }}
                      className="bg-white/10 dark:bg-gray-800/10 backdrop-blur-sm rounded-xl p-4 hover:bg-white/20 dark:hover:bg-gray-800/20 transition-all duration-300"
                    >
                      <achievement.icon className="w-8 h-8 text-blue-500 mx-auto mb-2" />
                      <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-1">
                        {achievement.title}
                      </h4>
                      <p className="text-xs text-gray-600 dark:text-gray-300">
                        {achievement.description}
                      </p>
                    </motion.div>
                  ))}
                </div>
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

          {currentStep === 3 && (
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
                
                <div className="flex gap-2">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="flex-1 px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-full font-semibold hover:from-blue-600 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? (
                      <div className="flex items-center justify-center gap-2">
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Loading...
                      </div>
                    ) : (
                      'Get Weather'
                    )}
                  </button>
                  
                  <button
                    type="button"
                    onClick={getLocation}
                    disabled={isLoading}
                    className="px-4 py-3 bg-white/20 dark:bg-gray-800/20 backdrop-blur-sm border border-gray-200 dark:border-gray-700 rounded-full text-gray-700 dark:text-gray-300 hover:bg-white/30 dark:hover:bg-gray-800/30 transition-all duration-300 disabled:opacity-50"
                    title="Use my location"
                  >
                    <Navigation className="w-5 h-5" />
                  </button>
                </div>
                
                {userLocation && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center text-sm text-green-600 dark:text-green-400"
                  >
                    ✓ Location detected: {userLocation}
                  </motion.div>
                )}
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