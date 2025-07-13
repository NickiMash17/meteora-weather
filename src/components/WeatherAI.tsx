import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { 
  AlertTriangle,
  Info,
  Lightbulb,
  Target,
  Zap,
  Shield,
  Users,
  Globe,
  Activity,
  Thermometer,
  Droplets,
  Wind,
  Sun,
  CloudRain,
  CloudLightning,
  Snowflake,
  Eye,
  Gauge
} from 'lucide-react';

interface WeatherAIProps {
  weather: any;
  forecast: any;
  userPreferences?: Record<string, any>;
}

interface WeatherCondition {
  main: string;
  description: string;
  icon?: string;
}

const WeatherAI: React.FC<WeatherAIProps> = ({ weather }) => {
  const [selectedInsight, setSelectedInsight] = useState<string | null>(null);

  // Weather analysis
  const weatherAnalysis = useMemo(() => {
    if (!weather) return null;

    const temp = weather.temperature?.current || 0;
    const humidity = weather.humidity || 0;
    const windSpeed = weather.wind?.speed || 0;
    const condition = weather.condition?.main?.toLowerCase() || 'clear';
    const visibility = weather.visibility || 10;
    const pressure = weather.pressure || 1013;

    const insights = [];

    // Temperature insights
    if (temp < 0) {
      insights.push({
        type: 'temperature',
        icon: <Thermometer className="w-5 h-5" />,
        title: 'Cold Weather Alert',
        description: 'Temperatures are below freezing. Bundle up and watch for ice.',
        severity: 'warning',
        recommendations: ['Wear warm clothing', 'Check for ice on roads', 'Protect plants']
      });
    } else if (temp > 30) {
      insights.push({
        type: 'temperature',
        icon: <Sun className="w-5 h-5" />,
        title: 'Hot Weather Alert',
        description: 'High temperatures detected. Stay hydrated and avoid prolonged sun exposure.',
        severity: 'warning',
        recommendations: ['Stay hydrated', 'Avoid peak sun hours', 'Use sunscreen']
      });
    }

    // Humidity insights
    if (humidity > 80) {
      insights.push({
        type: 'humidity',
        icon: <Droplets className="w-5 h-5" />,
        title: 'High Humidity',
        description: 'Humidity levels are high. This can make temperatures feel warmer.',
        severity: 'info',
        recommendations: ['Use air conditioning', 'Stay in shaded areas', 'Wear breathable clothing']
      });
    } else if (humidity < 30) {
      insights.push({
        type: 'humidity',
        icon: <Droplets className="w-5 h-5" />,
        title: 'Low Humidity',
        description: 'Humidity levels are low. Consider using a humidifier.',
        severity: 'info',
        recommendations: ['Use a humidifier', 'Stay hydrated', 'Moisturize skin']
      });
    }

    // Wind insights
    if (windSpeed > 20) {
      insights.push({
        type: 'wind',
        icon: <Wind className="w-5 h-5" />,
        title: 'Strong Winds',
        description: 'Wind speeds are high. Secure loose objects and be cautious.',
        severity: 'warning',
        recommendations: ['Secure outdoor items', 'Be careful driving', 'Avoid high areas']
      });
    }

    // Weather condition insights
    if (condition.includes('rain')) {
      insights.push({
        type: 'condition',
        icon: <CloudRain className="w-5 h-5" />,
        title: 'Rain Expected',
        description: 'Rain is in the forecast. Bring an umbrella and drive carefully.',
        severity: 'info',
        recommendations: ['Bring umbrella', 'Drive carefully', 'Check for flooding']
      });
    } else if (condition.includes('snow')) {
      insights.push({
        type: 'condition',
        icon: <Snowflake className="w-5 h-5" />,
        title: 'Snow Expected',
        description: 'Snow is in the forecast. Prepare for winter conditions.',
        severity: 'warning',
        recommendations: ['Wear warm clothing', 'Check road conditions', 'Prepare for delays']
      });
    } else if (condition.includes('thunderstorm')) {
      insights.push({
        type: 'condition',
        icon: <CloudLightning className="w-5 h-5" />,
        title: 'Thunderstorm Alert',
        description: 'Thunderstorms are possible. Seek shelter if needed.',
        severity: 'warning',
        recommendations: ['Seek shelter', 'Avoid open areas', 'Stay indoors']
      });
    }

    // Visibility insights
    if (visibility < 5) {
      insights.push({
        type: 'visibility',
        icon: <Eye className="w-5 h-5" />,
        title: 'Poor Visibility',
        description: 'Visibility is reduced. Drive with extra caution.',
        severity: 'warning',
        recommendations: ['Use headlights', 'Reduce speed', 'Increase following distance']
      });
    }

    // Pressure insights
    if (pressure < 1000) {
      insights.push({
        type: 'pressure',
        icon: <Gauge className="w-5 h-5" />,
        title: 'Low Pressure System',
        description: 'Atmospheric pressure is low. This often indicates stormy weather.',
        severity: 'info',
        recommendations: ['Prepare for weather changes', 'Check forecasts', 'Stay informed']
      });
    }

    return insights;
  }, [weather]);

  // Activity recommendations
  const activityRecommendations = useMemo(() => {
    if (!weather) return [];

    const temp = weather.temperature?.current || 0;
    const condition = weather.condition?.main?.toLowerCase() || 'clear';
    const windSpeed = weather.wind?.speed || 0;
    const isDaytime = new Date().getHours() >= 6 && new Date().getHours() < 18;

    const activities = [];

    // Indoor activities
    if (condition.includes('rain') || condition.includes('snow') || condition.includes('thunderstorm')) {
      activities.push({
        type: 'indoor',
        icon: <Users className="w-5 h-5" />,
        title: 'Indoor Activities',
        description: 'Perfect weather for indoor activities.',
        suggestions: ['Movie night', 'Board games', 'Cooking', 'Reading', 'Gym workout']
      });
    }

    // Outdoor activities
    if (isDaytime && !condition.includes('rain') && !condition.includes('snow') && !condition.includes('thunderstorm')) {
      if (temp >= 15 && temp <= 25 && windSpeed < 15) {
        activities.push({
          type: 'outdoor',
          icon: <Activity className="w-5 h-5" />,
          title: 'Perfect Outdoor Weather',
          description: 'Excellent conditions for outdoor activities.',
          suggestions: ['Walking', 'Cycling', 'Picnic', 'Gardening', 'Photography']
        });
      } else if (temp >= 10 && temp <= 30) {
        activities.push({
          type: 'outdoor',
          icon: <Globe className="w-5 h-5" />,
          title: 'Outdoor Activities',
          description: 'Good weather for outdoor activities with proper preparation.',
          suggestions: ['Hiking', 'Running', 'Outdoor dining', 'Shopping', 'Park visit']
        });
      }
    }

    return activities;
  }, [weather]);

  // Health recommendations
  const healthRecommendations = useMemo(() => {
    if (!weather) return [];

    const temp = weather.temperature?.current || 0;
    const humidity = weather.humidity || 0;
    const condition = weather.condition?.main?.toLowerCase() || 'clear';

    const health = [];

    // Cold weather health
    if (temp < 5) {
      health.push({
        type: 'cold',
        icon: <Shield className="w-5 h-5" />,
        title: 'Cold Weather Health',
        description: 'Protect yourself from cold weather.',
        tips: ['Dress in layers', 'Stay dry', 'Keep extremities warm', 'Watch for frostbite signs']
      });
    }

    // Hot weather health
    if (temp > 30) {
      health.push({
        type: 'heat',
        icon: <Zap className="w-5 h-5" />,
        title: 'Heat Safety',
        description: 'Stay safe in hot weather.',
        tips: ['Stay hydrated', 'Avoid peak sun hours', 'Wear light clothing', 'Watch for heat exhaustion']
      });
    }

    // Allergy considerations
    if (condition.includes('wind') && humidity > 60) {
      health.push({
        type: 'allergies',
        icon: <AlertTriangle className="w-5 h-5" />,
        title: 'Allergy Alert',
        description: 'Weather conditions may trigger allergies.',
        tips: ['Take allergy medication', 'Keep windows closed', 'Use air purifier', 'Shower after outdoor activities']
      });
    }

    return health;
  }, [weather]);

  if (!weather) {
    return (
      <div className="text-center py-8">
        <div className="text-gray-500">No weather data available for AI insights.</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          AI Weather Insights
        </h2>
        <p className="text-gray-600 dark:text-gray-300">
          Intelligent analysis and recommendations based on current conditions
        </p>
      </div>

      {/* Weather Analysis */}
      {weatherAnalysis && weatherAnalysis.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
            <Lightbulb className="w-5 h-5 text-yellow-500" />
            Weather Analysis
          </h3>
          <div className="grid gap-4 md:grid-cols-2">
            {weatherAnalysis.map((insight, index) => (
              <motion.div
                key={index}
                className={`p-4 rounded-lg border ${
                  insight.severity === 'warning' 
                    ? 'border-orange-200 bg-orange-50 dark:border-orange-800 dark:bg-orange-900/20' 
                    : 'border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-900/20'
                }`}
                whileHover={{ scale: 1.02 }}
                onClick={() => setSelectedInsight(selectedInsight === insight.title ? null : insight.title)}
              >
                <div className="flex items-start gap-3">
                  <div className={`p-2 rounded-lg ${
                    insight.severity === 'warning' 
                      ? 'bg-orange-100 dark:bg-orange-800/30' 
                      : 'bg-blue-100 dark:bg-blue-800/30'
                  }`}>
                    {insight.icon}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
                      {insight.title}
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                      {insight.description}
                    </p>
                    {selectedInsight === insight.title && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="space-y-1"
                      >
                        <p className="text-xs font-medium text-gray-700 dark:text-gray-200">Recommendations:</p>
                        <ul className="text-xs text-gray-600 dark:text-gray-300 space-y-1">
                          {insight.recommendations.map((rec, idx) => (
                            <li key={idx} className="flex items-center gap-1">
                              <div className="w-1 h-1 bg-gray-400 rounded-full" />
                              {rec}
                            </li>
                          ))}
                        </ul>
                      </motion.div>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Activity Recommendations */}
      {activityRecommendations.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
            <Target className="w-5 h-5 text-green-500" />
            Activity Recommendations
          </h3>
          <div className="grid gap-4 md:grid-cols-2">
            {activityRecommendations.map((activity, index) => (
              <motion.div
                key={index}
                className="p-4 rounded-lg border border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-900/20"
                whileHover={{ scale: 1.02 }}
              >
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-green-100 dark:bg-green-800/30">
                    {activity.icon}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
                      {activity.title}
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                      {activity.description}
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {activity.suggestions.map((suggestion, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-1 text-xs bg-green-100 dark:bg-green-800/30 text-green-800 dark:text-green-200 rounded-full"
                        >
                          {suggestion}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Health Recommendations */}
      {healthRecommendations.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
            <Shield className="w-5 h-5 text-purple-500" />
            Health & Safety
          </h3>
          <div className="grid gap-4 md:grid-cols-2">
            {healthRecommendations.map((health, index) => (
              <motion.div
                key={index}
                className="p-4 rounded-lg border border-purple-200 bg-purple-50 dark:border-purple-800 dark:bg-purple-900/20"
                whileHover={{ scale: 1.02 }}
              >
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-800/30">
                    {health.icon}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
                      {health.title}
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                      {health.description}
                    </p>
                    <ul className="text-xs text-gray-600 dark:text-gray-300 space-y-1">
                      {health.tips.map((tip, idx) => (
                        <li key={idx} className="flex items-center gap-1">
                          <div className="w-1 h-1 bg-purple-400 rounded-full" />
                          {tip}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* No insights message */}
      {(!weatherAnalysis || weatherAnalysis.length === 0) && 
       activityRecommendations.length === 0 && 
       healthRecommendations.length === 0 && (
        <div className="text-center py-8">
          <Info className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500 dark:text-gray-400">
            Weather conditions are normal. No special recommendations at this time.
          </p>
        </div>
      )}
    </div>
  );
};

export default WeatherAI; 