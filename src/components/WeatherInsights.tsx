import React from 'react';
import { motion } from 'framer-motion';
import { 
  Lightbulb, 
  Umbrella, 
  Sun, 
  Cloud, 
  Wind, 
  Thermometer, 
  Clock, 
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Info,
  Sparkles,
  Droplets
} from 'lucide-react';

interface WeatherInsightsProps {
  weather: any;
  forecast: any;
}

const WeatherInsights: React.FC<WeatherInsightsProps> = ({ weather, forecast }) => {
  const generateInsights = () => {
    const insights = [];
    const temp = weather.temperature.current;
    const humidity = weather.humidity;
    const windSpeed = weather.wind.speed;
    const condition = weather.condition.main.toLowerCase();

    // Temperature insights
    if (temp >= 30) {
      insights.push({
        type: 'warning',
        icon: Thermometer,
        title: 'High Temperature Alert',
        description: 'Stay hydrated and avoid prolonged sun exposure. Consider indoor activities.',
        color: 'from-red-400 to-orange-400'
      });
    } else if (temp <= 0) {
      insights.push({
        type: 'warning',
        icon: Thermometer,
        title: 'Freezing Conditions',
        description: 'Bundle up! Frost and ice may be present. Drive carefully.',
        color: 'from-blue-400 to-cyan-400'
      });
    }

    // Humidity insights
    if (humidity >= 80) {
      insights.push({
        type: 'info',
        icon: Droplets,
        title: 'High Humidity',
        description: 'Air feels muggy. Consider using air conditioning or dehumidifier.',
        color: 'from-blue-400 to-purple-400'
      });
    } else if (humidity <= 30) {
      insights.push({
        type: 'info',
        icon: Droplets,
        title: 'Low Humidity',
        description: 'Air is dry. Stay hydrated and consider using a humidifier.',
        color: 'from-yellow-400 to-orange-400'
      });
    }

    // Wind insights
    if (windSpeed >= 20) {
      insights.push({
        type: 'warning',
        icon: Wind,
        title: 'Strong Winds',
        description: 'Secure loose objects. Wind may affect outdoor activities.',
        color: 'from-gray-400 to-blue-400'
      });
    }

    // Weather condition insights
    if (condition.includes('rain')) {
      insights.push({
        type: 'recommendation',
        icon: Umbrella,
        title: 'Rain Expected',
        description: 'Bring an umbrella or rain jacket. Roads may be slippery.',
        color: 'from-blue-400 to-cyan-400'
      });
    } else if (condition.includes('clear') && temp >= 20) {
      insights.push({
        type: 'positive',
        icon: Sun,
        title: 'Perfect Weather',
        description: 'Great day for outdoor activities! Enjoy the sunshine.',
        color: 'from-yellow-400 to-orange-400'
      });
    } else if (condition.includes('cloud')) {
      insights.push({
        type: 'info',
        icon: Cloud,
        title: 'Cloudy Conditions',
        description: 'UV index is lower. Good for outdoor activities without intense sun.',
        color: 'from-gray-400 to-blue-400'
      });
    }

    // Time-based insights
    const hour = new Date().getHours();
    if (hour >= 6 && hour <= 10) {
      insights.push({
        type: 'positive',
        icon: Sun,
        title: 'Morning Weather',
        description: 'Perfect time for a morning walk or outdoor exercise.',
        color: 'from-yellow-400 to-orange-400'
      });
    } else if (hour >= 18 && hour <= 22) {
      insights.push({
        type: 'info',
        icon: Clock,
        title: 'Evening Weather',
        description: 'Great time for a relaxing evening stroll.',
        color: 'from-purple-400 to-pink-400'
      });
    }

    return insights;
  };

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'warning':
        return AlertTriangle;
      case 'positive':
        return CheckCircle;
      case 'recommendation':
        return Lightbulb;
      default:
        return Info;
    }
  };

  const insights = generateInsights();

  if (insights.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card rounded-2xl p-8 flex flex-col items-center justify-center text-center border border-yellow-400/20 bg-yellow-400/5 mt-4"
      >
        <motion.div
          initial={{ scale: 0.8, rotate: -10 }}
          animate={{ scale: [0.8, 1.1, 1], rotate: [0, 10, -10, 0] }}
          transition={{ duration: 2, repeat: Infinity, repeatType: 'mirror' }}
          className="mb-4"
        >
          <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="32" cy="32" r="18" fill="#fde68a" />
            <g stroke="#fbbf24" strokeWidth="3" strokeLinecap="round">
              <line x1="32" y1="6" x2="32" y2="16" />
              <line x1="32" y1="48" x2="32" y2="58" />
              <line x1="6" y1="32" x2="16" y2="32" />
              <line x1="48" y1="32" x2="58" y2="32" />
              <line x1="14.93" y1="14.93" x2="21.21" y2="21.21" />
              <line x1="49.07" y1="49.07" x2="42.79" y2="42.79" />
              <line x1="14.93" y1="49.07" x2="21.21" y2="42.79" />
              <line x1="49.07" y1="14.93" x2="42.79" y2="21.21" />
            </g>
            <ellipse cx="32" cy="40" rx="7" ry="3" fill="#fffde7" />
            <circle cx="28" cy="30" r="2" fill="#fff" />
            <circle cx="36" cy="30" r="2" fill="#fff" />
            <path d="M28 36 Q32 39 36 36" stroke="#fff" strokeWidth="2" fill="none" />
          </svg>
        </motion.div>
        <h3 className="text-2xl font-bold text-yellow-400 mb-2">No Special Recommendations</h3>
        <p className="text-white/80 text-lg mb-2">Everything looks great. Enjoy your day! 😊</p>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="glass-card rounded-xl sm:rounded-2xl p-6 sm:p-8"
    >
      <div className="flex items-center mb-4 sm:mb-6">
        <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center mr-3 sm:mr-4">
          <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
        </div>
        <div>
          <h3 className="text-xl sm:text-2xl font-semibold text-white text-shadow">Weather Insights</h3>
          <p className="text-white/60 text-xs sm:text-sm">AI-powered recommendations for your day</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {insights.map((insight, index) => {
          const Icon = insight.icon;
          const InsightIcon = getInsightIcon(insight.type);
          
          return (
            <motion.div
              key={insight.title}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 + index * 0.1 }}
              className="bg-white/5 backdrop-blur-sm rounded-lg sm:rounded-xl p-4 sm:p-6 border border-white/10 hover:bg-white/10 transition-all card-hover"
            >
              <div className="flex items-start space-x-3 sm:space-x-4">
                <div className={`w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br ${insight.color} rounded-full flex items-center justify-center flex-shrink-0`}>
                  <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center mb-2">
                    <InsightIcon className={`w-3 h-3 sm:w-4 sm:h-4 mr-2 ${
                      insight.type === 'warning' ? 'text-red-400' :
                      insight.type === 'positive' ? 'text-green-400' :
                      insight.type === 'recommendation' ? 'text-yellow-400' :
                      'text-blue-400'
                    }`} />
                    <h4 className="text-base sm:text-lg font-semibold text-white text-shadow">
                      {insight.title}
                    </h4>
                  </div>
                  <p className="text-white/80 text-xs sm:text-sm leading-relaxed">
                    {insight.description}
                  </p>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Weather Trend */}
      {forecast?.daily && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-6 sm:mt-8 p-4 sm:p-6 bg-white/5 backdrop-blur-sm rounded-lg sm:rounded-xl border border-white/10"
        >
          <div className="flex items-center mb-3 sm:mb-4">
            <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-green-400 mr-2" />
            <h4 className="text-base sm:text-lg font-semibold text-white">Weather Trend</h4>
          </div>
          <div className="flex items-center justify-between text-white/80 flex-col sm:flex-row space-y-2 sm:space-y-0">
            <div className="text-center sm:text-left">
              <p className="text-xs sm:text-sm">Today</p>
              <p className="text-base sm:text-lg font-semibold">{Math.round(weather.temperature.current)}°</p>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-xl sm:text-2xl">→</span>
            </div>
            <div className="text-center sm:text-left">
              <p className="text-xs sm:text-sm">Tomorrow</p>
              <p className="text-base sm:text-lg font-semibold">{Math.round(forecast.daily[1]?.temperature.max || 0)}°</p>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-xl sm:text-2xl">→</span>
            </div>
            <div className="text-center sm:text-left">
              <p className="text-xs sm:text-sm">Next Week</p>
              <p className="text-base sm:text-lg font-semibold">{Math.round(forecast.daily[6]?.temperature.max || 0)}°</p>
            </div>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default WeatherInsights; 