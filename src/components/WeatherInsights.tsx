import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  Info,
  Lightbulb,
  Target,
  Zap,
  Shield,
  Users,
  Globe,
  Clock,
  MapPin,
  Thermometer,
  Droplets,
  Wind,
  Sun,
  Moon,
  Cloud,
  CloudRain,
  CloudLightning,
  Snowflake,
  Umbrella,
  Car,
  Plane,
  TreePine,
  Coffee,
  Heart,
  Sparkles,
  BarChart3
} from 'lucide-react';

interface WeatherInsightsProps {
  weather: any;
  forecast: any;
}

const WeatherInsights: React.FC<WeatherInsightsProps> = ({ weather }) => {
  const [selectedInsight, setSelectedInsight] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<'all' | 'health' | 'travel' | 'activities' | 'energy'>('all');

  // Weather insights analysis
  const weatherInsights = useMemo(() => {
    if (!weather) return [];

    const temp = weather.temperature?.current || 0;
    const humidity = weather.humidity || 0;
    const windSpeed = weather.wind?.speed || 0;
    const condition = weather.condition?.main?.toLowerCase() || 'clear';
    const visibility = weather.visibility || 10;
    const pressure = weather.pressure || 1013;
    const hour = new Date().getHours();
    const isDaytime = hour >= 6 && hour < 18;

    const insights = [];

    // Health insights
    if (temp > 30) {
      insights.push({
        id: 'heat-health',
        category: 'health',
        title: 'Heat Stress Risk',
        description: 'High temperatures detected. Risk of heat exhaustion and dehydration.',
        icon: <Thermometer className="w-5 h-5" />,
        severity: 'warning',
        recommendations: [
          'Stay hydrated - drink 2-3 liters of water daily',
          'Avoid outdoor activities between 10 AM - 4 PM',
          'Wear loose, light-colored clothing',
          'Use sunscreen with SPF 30+',
          'Monitor for heat exhaustion symptoms'
        ]
      });
    }

    if (temp < 5) {
      insights.push({
        id: 'cold-health',
        category: 'health',
        title: 'Cold Weather Advisory',
        description: 'Low temperatures detected. Risk of hypothermia and frostbite.',
        icon: <Snowflake className="w-5 h-5" />,
        severity: 'warning',
        recommendations: [
          'Layer clothing for insulation',
          'Cover extremities (hands, feet, head)',
          'Stay dry to prevent heat loss',
          'Monitor for hypothermia symptoms',
          'Keep indoor spaces heated'
        ]
      });
    }

    // Travel insights
    if (condition.includes('rain') || condition.includes('storm')) {
      insights.push({
        id: 'travel-rain',
        category: 'travel',
        title: 'Travel Weather Advisory',
        description: 'Wet conditions affecting travel. Plan for delays and safety.',
        icon: <Car className="w-5 h-5" />,
        severity: 'info',
        recommendations: [
          'Allow extra travel time for delays',
          'Check flight status if flying',
          'Drive carefully on wet roads',
          'Use public transportation if possible',
          'Pack waterproof gear'
        ]
      });
    }

    if (windSpeed > 25) {
      insights.push({
        id: 'travel-wind',
        category: 'travel',
        title: 'High Wind Travel Impact',
        description: 'Strong winds may affect air travel and driving conditions.',
        icon: <Plane className="w-5 h-5" />,
        severity: 'warning',
        recommendations: [
          'Check flight delays and cancellations',
          'Secure loose objects in vehicles',
          'Avoid driving high-profile vehicles',
          'Monitor weather alerts',
          'Consider postponing non-essential travel'
        ]
      });
    }

    // Activity insights
    if (temp >= 15 && temp <= 25 && condition.includes('clear') && windSpeed < 15) {
      insights.push({
        id: 'perfect-outdoor',
        category: 'activities',
        title: 'Perfect Outdoor Weather',
        description: 'Ideal conditions for outdoor activities and recreation.',
        icon: <TreePine className="w-5 h-5" />,
        severity: 'positive',
        recommendations: [
          'Go hiking or walking',
          'Plan outdoor dining',
          'Take photos of scenery',
          'Play outdoor sports',
          'Visit parks or gardens'
        ]
      });
    }

    if (condition.includes('rain') && temp > 15) {
      insights.push({
        id: 'cozy-indoor',
        category: 'activities',
        title: 'Cozy Indoor Activities',
        description: 'Perfect weather for indoor relaxation and comfort.',
        icon: <Coffee className="w-5 h-5" />,
        severity: 'info',
        recommendations: [
          'Enjoy hot beverages',
          'Read a book or watch movies',
          'Cook comfort food',
          'Practice indoor hobbies',
          'Plan indoor social activities'
        ]
      });
    }

    // Energy insights
    if (temp > 25) {
      insights.push({
        id: 'energy-cooling',
        category: 'energy',
        title: 'Cooling Efficiency Tips',
        description: 'High temperatures increase cooling costs. Optimize for efficiency.',
        icon: <Zap className="w-5 h-5" />,
        severity: 'info',
        recommendations: [
          'Set AC to 24-26°C for optimal efficiency',
          'Use ceiling fans to circulate air',
          'Close blinds during peak sun hours',
          'Seal air leaks around windows/doors',
          'Consider smart thermostat settings'
        ]
      });
    }

    return insights;
  }, [weather]);

  const filteredInsights = activeCategory === 'all' 
    ? weatherInsights 
    : weatherInsights.filter(insight => insight.category === activeCategory);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'warning': return 'text-red-400';
      case 'info': return 'text-blue-400';
      case 'positive': return 'text-green-400';
      default: return 'text-gray-400';
    }
  };

  const getSeverityBg = (severity: string) => {
    switch (severity) {
      case 'warning': return 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800';
      case 'info': return 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800';
      case 'positive': return 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800';
      default: return 'bg-gray-50 dark:bg-gray-900/20 border-gray-200 dark:border-gray-800';
    }
  };

  if (!weather) {
    return (
      <div className="text-center py-8">
        <div className="text-gray-500">No weather data available for insights.</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Weather Insights
        </h2>
        <p className="text-gray-600 dark:text-gray-300">
          Intelligent analysis and recommendations based on current conditions
        </p>
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap gap-2 justify-center">
        {[
          { id: 'all', label: 'All Insights', icon: Lightbulb },
          { id: 'health', label: 'Health', icon: Heart },
          { id: 'travel', label: 'Travel', icon: Car },
          { id: 'activities', label: 'Activities', icon: TreePine },
          { id: 'energy', label: 'Energy', icon: Zap }
        ].map((category) => (
          <button
            key={category.id}
            onClick={() => setActiveCategory(category.id as any)}
            className={`flex items-center gap-2 px-3 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
              activeCategory === category.id
                ? 'bg-blue-500 text-white'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
            }`}
          >
            <category.icon className="w-4 h-4" />
            {category.label}
          </button>
        ))}
      </div>

      {/* Insights Grid */}
      {filteredInsights.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2">
          {filteredInsights.map((insight) => (
            <motion.div
              key={insight.id}
              className={`p-4 rounded-lg border transition-all duration-200 cursor-pointer ${getSeverityBg(insight.severity)}`}
              whileHover={{ scale: 1.02 }}
              onClick={() => setSelectedInsight(selectedInsight === insight.id ? null : insight.id)}
            >
              <div className="flex items-start gap-3">
                <div className={`p-2 rounded-lg ${getSeverityColor(insight.severity)} bg-opacity-10`}>
                  {insight.icon}
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
                    {insight.title}
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                    {insight.description}
                  </p>
                  
                  {selectedInsight === insight.id && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="space-y-2"
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
      ) : (
        <div className="text-center py-8">
          <Info className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500 dark:text-gray-400">
            No insights available for the selected category at this time.
          </p>
        </div>
      )}
    </div>
  );
};

export default WeatherInsights; 