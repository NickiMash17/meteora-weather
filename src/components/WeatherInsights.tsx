import * as React from 'react';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Lightbulb, 
  Umbrella, 
  Sun, 
  Moon,
  Cloud, 
  Wind, 
  Thermometer,
  Calendar,
  Clock,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle,
  Info,
  Sparkles,
  Zap,
  Heart,
  Coffee,
  Car,
  Plane,
  TreePine,
  Droplets
} from 'lucide-react';
import { getCityDate } from '../utils/timezone';
import { useTranslation } from 'react-i18next';

interface WeatherInsightsProps {
  weather: any;
  forecast: any;
}

const WeatherInsights: React.FC<WeatherInsightsProps> = ({ weather, forecast }) => {
  const [activeInsight, setActiveInsight] = useState(0);
  const [isExpanded, setIsExpanded] = useState(false);
  const { t } = useTranslation();

  const generateInsights = () => {
    if (!weather) return [];

    const temp = weather.temperature.current;
    const condition = weather.condition.main.toLowerCase();
    const humidity = weather.humidity;
    const windSpeed = weather.wind.speed;
    const hour = (weather && typeof weather.timezone === 'number') ? getCityDate(weather).getHours() : new Date().getHours();

    const insights = [];

    // Temperature insights
    if (temp > 30) {
      insights.push({
        type: 'temperature',
        icon: <Thermometer className="w-6 h-6" />,
        title: 'Hot Weather Alert',
        description: 'High temperatures detected. Stay hydrated and avoid prolonged sun exposure.',
        color: 'text-red-400',
        bgColor: 'bg-red-400/10',
        recommendations: [
          'Drink plenty of water',
          'Wear light, breathable clothing',
          'Avoid outdoor activities during peak hours',
          'Use sunscreen with high SPF'
        ]
      });
    } else if (temp < 10) {
      insights.push({
        type: 'temperature',
        icon: <Thermometer className="w-6 h-6" />,
        title: 'Cold Weather Alert',
        description: 'Low temperatures detected. Bundle up and stay warm.',
        color: 'text-blue-400',
        bgColor: 'bg-blue-400/10',
        recommendations: [
          'Wear warm, layered clothing',
          'Keep indoor spaces heated',
          'Check for frost warnings',
          'Prepare for potential snow'
        ]
      });
    }

    // Weather condition insights
    if (condition.includes('rain')) {
      insights.push({
        type: 'precipitation',
        icon: <Umbrella className="w-6 h-6" />,
        title: 'Rain Expected',
        description: 'Rainy conditions detected. Prepare for wet weather.',
        color: 'text-blue-400',
        bgColor: 'bg-blue-400/10',
        recommendations: [
          'Carry an umbrella or raincoat',
          'Drive carefully on wet roads',
          'Check for flood warnings',
          'Protect electronic devices'
        ]
      });
    }

    if (condition.includes('thunderstorm')) {
      insights.push({
        type: 'storm',
        icon: <Zap className="w-6 h-6" />,
        title: 'Storm Warning',
        description: 'Thunderstorm conditions detected. Take necessary precautions.',
        color: 'text-yellow-400',
        bgColor: 'bg-yellow-400/10',
        recommendations: [
          'Stay indoors during storms',
          'Unplug electronic devices',
          'Avoid open areas and tall objects',
          'Monitor weather alerts'
        ]
      });
    }

    // Time-based insights
    if (hour >= 6 && hour < 18) {
      insights.push({
        type: 'daytime',
        icon: <Sun className="w-6 h-6" />,
        title: 'Perfect Day for Activities',
        description: 'Beautiful daytime weather. Great for outdoor activities.',
        color: 'text-yellow-400',
        bgColor: 'bg-yellow-400/10',
        recommendations: [
          'Go for a walk or hike',
          'Plan outdoor dining',
          'Take photos of the scenery',
          'Enjoy outdoor sports'
        ]
      });
    } else {
      insights.push({
        type: 'nighttime',
        icon: <Moon className="w-6 h-6" />,
        title: 'Evening Weather',
        description: 'Nighttime conditions. Perfect for indoor activities.',
        color: 'text-purple-400',
        bgColor: 'bg-purple-400/10',
        recommendations: [
          'Plan indoor entertainment',
          'Enjoy a cozy evening',
          'Stargazing if clear',
          'Prepare for tomorrow'
        ]
      });
    }

    // Wind insights
    if (windSpeed > 20) {
      insights.push({
        type: 'wind',
        icon: <Wind className="w-6 h-6" />,
        title: 'Windy Conditions',
        description: 'High wind speeds detected. Secure loose objects.',
        color: 'text-green-400',
        bgColor: 'bg-green-400/10',
        recommendations: [
          'Secure outdoor furniture',
          'Be careful with umbrellas',
          'Check for wind advisories',
          'Avoid outdoor fires'
        ]
      });
    }

    // Humidity insights
    if (humidity > 80) {
      insights.push({
        type: 'humidity',
        icon: <Droplets className="w-6 h-6" />,
        title: 'High Humidity',
        description: 'High humidity levels. Air may feel muggy.',
        color: 'text-blue-400',
        bgColor: 'bg-blue-400/10',
        recommendations: [
          'Use air conditioning',
          'Stay hydrated',
          'Wear breathable fabrics',
          'Check for mold prevention'
        ]
      });
    }

    return insights;
  };

  const insights = generateInsights();

  const getActivityRecommendation = () => {
    const temp = weather?.temperature?.current;
    const condition = weather?.condition?.main?.toLowerCase();
    
    if (condition.includes('rain') || condition.includes('storm')) {
      return {
        icon: <Coffee className="w-8 h-8" />,
        activity: 'Indoor Coffee Time',
        description: 'Perfect weather for a cozy coffee break indoors',
        color: 'text-amber-400'
      };
    }
    
    if (temp > 25 && condition.includes('clear')) {
      return {
        icon: <TreePine className="w-8 h-8" />,
        activity: 'Outdoor Adventure',
        description: 'Great weather for hiking or outdoor activities',
        color: 'text-green-400'
      };
    }
    
    if (temp < 15) {
      return {
        icon: <Heart className="w-8 h-8" />,
        activity: 'Cozy Indoor Time',
        description: 'Perfect for reading or watching movies',
        color: 'text-red-400'
      };
    }
    
    return {
      icon: <Sun className="w-8 h-8" />,
      activity: 'General Activities',
      description: 'Good weather for various activities',
      color: 'text-yellow-400'
    };
  };

  const activityRec = getActivityRecommendation();

  return (
    <div className="space-y-6">
      {/* Main Insights Section */}
      <motion.div
        className="glass-card p-6 rounded-3xl"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-full bg-gradient-to-r from-purple-500 to-pink-500">
              <Lightbulb className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-xl font-bold text-white">{t('AI Weather Insights')}</h3>
          </div>
          <Sparkles className="w-6 h-6 text-yellow-400" />
        </div>

        {insights.length > 0 ? (
          <div className="space-y-4">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeInsight}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-4"
              >
                <div className={`p-4 rounded-2xl ${insights[activeInsight].bgColor} border border-white/10`}>
                  <div className="flex items-start gap-3">
                    <div className={`p-2 rounded-full bg-white/10 ${insights[activeInsight].color}`}>
                      {insights[activeInsight].icon}
                    </div>
                    <div className="flex-1">
                      <h4 className={`text-lg font-semibold ${insights[activeInsight].color} mb-2`}>
                        {insights[activeInsight].title}
                      </h4>
                      <p className="text-white/80 mb-3">
                        {insights[activeInsight].description}
                      </p>
                      
                      {isExpanded && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          className="space-y-2"
                        >
                          <h5 className="text-sm font-semibold text-white/90">{t('Recommendations:')}</h5>
                          <ul className="space-y-1">
                            {insights[activeInsight].recommendations.map((rec, index) => (
                              <motion.li
                                key={index}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="flex items-center gap-2 text-sm text-white/70"
                              >
                                <CheckCircle className="w-4 h-4 text-green-400" />
                                {rec}
                              </motion.li>
                            ))}
                          </ul>
                        </motion.div>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Navigation Dots */}
            {insights.length > 1 && (
              <div className="flex justify-center gap-2">
                {insights.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setActiveInsight(index)}
                    className={`w-2 h-2 rounded-full transition-all duration-300 ${
                      index === activeInsight ? 'bg-white scale-125' : 'bg-white/30'
                    }`}
                  />
                ))}
              </div>
            )}

            {/* Expand/Collapse Button */}
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="w-full py-2 px-4 rounded-xl bg-white/10 hover:bg-white/20 transition-all duration-300 text-white/80 text-sm font-medium"
            >
              {isExpanded ? t('Show Less') : t('Show Recommendations')}
            </button>
          </div>
        ) : (
          <div className="text-center py-10 flex flex-col items-center gap-3 animate-fade-in">
            {/* Friendly illustration or animation */}
            <span className="inline-block">
              <Sparkles className="w-16 h-16 text-yellow-300 animate-bounce mb-2" />
            </span>
            <h4 className="text-lg font-semibold text-white mb-1">{t('No Insights Available')}</h4>
            <p className="text-white/70 max-w-xs mx-auto mb-2">
              {t('We couldn\'t generate any special insights for the current weather conditions.')}
              <br />
              {t('Try searching for a different city, or check back later for more interesting weather!')}
            </p>
            <button
              className="mt-2 px-5 py-2 rounded-xl bg-blue-500 hover:bg-blue-600 text-white font-semibold shadow transition"
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            >
              {t('Search Another City')}
            </button>
          </div>
        )}
      </motion.div>

      {/* Activity Recommendation */}
      <motion.div
        className="glass-card p-6 rounded-3xl"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <div className="flex items-center gap-4">
          <div className={`p-3 rounded-full bg-white/10 ${activityRec.color}`}>
            {activityRec.icon}
          </div>
          <div className="flex-1">
            <h4 className="text-lg font-semibold text-white mb-1">
              {activityRec.activity}
            </h4>
            <p className="text-white/70 text-sm">
              {activityRec.description}
            </p>
          </div>
        </div>
      </motion.div>

      {/* Weather Trends */}
      <motion.div
        className="glass-card p-6 rounded-3xl"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white">{t('Weather Trends')}</h3>
          <TrendingUp className="w-5 h-5 text-green-400" />
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-4 rounded-2xl bg-white/10">
            <div className="text-2xl font-bold text-white mb-1">
              {weather?.temperature?.current}°
            </div>
            <div className="text-sm text-white/60">{t('Current')}</div>
          </div>
          
          <div className="text-center p-4 rounded-2xl bg-white/10">
            <div className="text-2xl font-bold text-white mb-1">
              {weather?.temperature?.feels_like}°
            </div>
            <div className="text-sm text-white/60">{t('Feels Like')}</div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default WeatherInsights; 