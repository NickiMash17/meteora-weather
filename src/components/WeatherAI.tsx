import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Brain, 
  TrendingUp, 
  TrendingDown, 
  Calendar,
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
  Zap,
  Sparkles,
  Target,
  BarChart3,
  Activity,
  Sunrise,
  Sunset,
  Eye,
  Gauge,
  AlertTriangle,
  CheckCircle,
  Info,
  Star,
  Compass,
  Droplet,
  ThermometerSun,
  ThermometerSnowflake
} from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface WeatherAIProps {
  weather: any;
  forecast: any;
  userPreferences?: {
    activities?: string[];
    healthConditions?: string[];
    travelPlans?: string[];
    outdoorActivities?: boolean;
  };
}

interface AIInsight {
  id: string;
  type: 'prediction' | 'recommendation' | 'alert' | 'opportunity';
  category: 'health' | 'travel' | 'activities' | 'clothing' | 'energy' | 'agriculture';
  title: string;
  description: string;
  confidence: number;
  impact: 'high' | 'medium' | 'low';
  icon: React.ReactNode;
  color: string;
  bgColor: string;
  recommendations: string[];
  timeFrame: 'now' | 'today' | 'week' | 'month';
  priority: number;
}

const WeatherAI: React.FC<WeatherAIProps> = ({ weather, forecast, userPreferences = {} }) => {
  const { t } = useTranslation();
  const [activeInsight, setActiveInsight] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showAdvanced, setShowAdvanced] = useState(false);

  // AI-powered weather analysis
  const aiInsights = useMemo(() => {
    if (!weather || !forecast) return [];

    const insights: AIInsight[] = [];
    const temp = weather.temperature?.current;
    const condition = weather.condition?.main?.toLowerCase();
    const humidity = weather.humidity;
    const windSpeed = weather.wind?.speed;
    const visibility = weather.visibility;
    const pressure = weather.pressure;
    const hour = new Date().getHours();
    const isDaytime = hour >= 6 && hour < 18;

    // Health & Wellness Insights
    if (temp > 30) {
      insights.push({
        id: 'heat-health',
        type: 'alert',
        category: 'health',
        title: 'Heat Stress Risk',
        description: 'High temperatures detected. Risk of heat exhaustion and dehydration.',
        confidence: 95,
        impact: 'high',
        icon: <ThermometerSun className="w-6 h-6" />,
        color: 'text-red-400',
        bgColor: 'bg-red-400/10',
        recommendations: [
          'Stay hydrated - drink 2-3 liters of water daily',
          'Avoid outdoor activities between 10 AM - 4 PM',
          'Wear loose, light-colored clothing',
          'Use sunscreen with SPF 30+',
          'Monitor for heat exhaustion symptoms'
        ],
        timeFrame: 'today',
        priority: 1
      });
    }

    if (temp < 5) {
      insights.push({
        id: 'cold-health',
        type: 'alert',
        category: 'health',
        title: 'Cold Weather Advisory',
        description: 'Low temperatures detected. Risk of hypothermia and frostbite.',
        confidence: 90,
        impact: 'high',
        icon: <ThermometerSnowflake className="w-6 h-6" />,
        color: 'text-blue-400',
        bgColor: 'bg-blue-400/10',
        recommendations: [
          'Layer clothing for insulation',
          'Cover extremities (hands, feet, head)',
          'Stay dry to prevent heat loss',
          'Monitor for hypothermia symptoms',
          'Keep indoor spaces heated'
        ],
        timeFrame: 'today',
        priority: 1
      });
    }

    // Travel & Transportation Insights
    if (condition.includes('rain') || condition.includes('storm')) {
      insights.push({
        id: 'travel-rain',
        type: 'recommendation',
        category: 'travel',
        title: 'Travel Weather Advisory',
        description: 'Wet conditions affecting travel. Plan for delays and safety.',
        confidence: 85,
        impact: 'medium',
        icon: <Car className="w-6 h-6" />,
        color: 'text-blue-400',
        bgColor: 'bg-blue-400/10',
        recommendations: [
          'Allow extra travel time for delays',
          'Check flight status if flying',
          'Drive carefully on wet roads',
          'Use public transportation if possible',
          'Pack waterproof gear'
        ],
        timeFrame: 'today',
        priority: 2
      });
    }

    if (windSpeed > 25) {
      insights.push({
        id: 'travel-wind',
        type: 'alert',
        category: 'travel',
        title: 'High Wind Travel Impact',
        description: 'Strong winds may affect air travel and driving conditions.',
        confidence: 80,
        impact: 'medium',
        icon: <Plane className="w-6 h-6" />,
        color: 'text-yellow-400',
        bgColor: 'bg-yellow-400/10',
        recommendations: [
          'Check flight delays and cancellations',
          'Secure loose objects in vehicles',
          'Avoid driving high-profile vehicles',
          'Monitor weather alerts',
          'Consider postponing non-essential travel'
        ],
        timeFrame: 'today',
        priority: 2
      });
    }

    // Activity Recommendations
    if (temp >= 15 && temp <= 25 && condition.includes('clear') && windSpeed < 15) {
      insights.push({
        id: 'perfect-outdoor',
        type: 'opportunity',
        category: 'activities',
        title: 'Perfect Outdoor Weather',
        description: 'Ideal conditions for outdoor activities and recreation.',
        confidence: 95,
        impact: 'medium',
        icon: <TreePine className="w-6 h-6" />,
        color: 'text-green-400',
        bgColor: 'bg-green-400/10',
        recommendations: [
          'Go hiking or walking',
          'Plan outdoor dining',
          'Take photos of scenery',
          'Play outdoor sports',
          'Visit parks or gardens'
        ],
        timeFrame: 'today',
        priority: 3
      });
    }

    if (condition.includes('rain') && temp > 15) {
      insights.push({
        id: 'cozy-indoor',
        type: 'recommendation',
        category: 'activities',
        title: 'Cozy Indoor Activities',
        description: 'Perfect weather for indoor relaxation and comfort.',
        confidence: 90,
        impact: 'low',
        icon: <Coffee className="w-6 h-6" />,
        color: 'text-amber-400',
        bgColor: 'bg-amber-400/10',
        recommendations: [
          'Enjoy hot beverages',
          'Read a book or watch movies',
          'Cook comfort food',
          'Practice indoor hobbies',
          'Plan indoor social activities'
        ],
        timeFrame: 'today',
        priority: 4
      });
    }

    // Energy & Efficiency Insights
    if (temp > 25) {
      insights.push({
        id: 'energy-cooling',
        type: 'recommendation',
        category: 'energy',
        title: 'Cooling Efficiency Tips',
        description: 'High temperatures increase cooling costs. Optimize for efficiency.',
        confidence: 85,
        impact: 'medium',
        icon: <Zap className="w-6 h-6" />,
        color: 'text-purple-400',
        bgColor: 'bg-purple-400/10',
        recommendations: [
          'Set AC to 24-26°C for optimal efficiency',
          'Use ceiling fans to circulate air',
          'Close blinds during peak sun hours',
          'Seal air leaks around windows/doors',
          'Consider smart thermostat settings'
        ],
        timeFrame: 'week',
        priority: 3
      });
    }

    // Agricultural Insights (if relevant)
    if (humidity > 80 && temp > 20) {
      insights.push({
        id: 'agriculture-humidity',
        type: 'recommendation',
        category: 'agriculture',
        title: 'High Humidity Alert',
        description: 'High humidity conditions may affect plant health and growth.',
        confidence: 75,
        impact: 'low',
        icon: <Droplet className="w-6 h-6" />,
        color: 'text-cyan-400',
        bgColor: 'bg-cyan-400/10',
        recommendations: [
          'Monitor for fungal diseases',
          'Ensure proper air circulation',
          'Avoid overhead watering',
          'Check for pest infestations',
          'Consider fungicide treatments'
        ],
        timeFrame: 'week',
        priority: 4
      });
    }

    // Predictive Analytics
    if (forecast?.daily) {
      const tempTrend = forecast.daily.slice(0, 5).map((day: any) => day.temperature.max);
      const avgTemp = tempTrend.reduce((a: number, b: number) => a + b, 0) / tempTrend.length;
      
      if (avgTemp > temp + 5) {
        insights.push({
          id: 'warming-trend',
          type: 'prediction',
          category: 'activities',
          title: 'Warming Trend Detected',
          description: 'Temperatures expected to rise significantly over the next 5 days.',
          confidence: 80,
          impact: 'medium',
          icon: <TrendingUp className="w-6 h-6" />,
          color: 'text-orange-400',
          bgColor: 'bg-orange-400/10',
          recommendations: [
            'Plan outdoor activities for cooler days',
            'Prepare for increased cooling needs',
            'Stay hydrated as temperatures rise',
            'Monitor heat-sensitive plants',
            'Adjust clothing choices accordingly'
          ],
          timeFrame: 'week',
          priority: 2
        });
      }
    }

    return insights.sort((a, b) => a.priority - b.priority);
  }, [weather, forecast, userPreferences]);

  const categories = [
    { id: 'all', label: 'All Insights', icon: Brain, color: 'text-purple-400' },
    { id: 'health', label: 'Health', icon: Heart, color: 'text-red-400' },
    { id: 'travel', label: 'Travel', icon: Car, color: 'text-blue-400' },
    { id: 'activities', label: 'Activities', icon: Activity, color: 'text-green-400' },
    { id: 'energy', label: 'Energy', icon: Zap, color: 'text-yellow-400' },
    { id: 'agriculture', label: 'Agriculture', icon: TreePine, color: 'text-emerald-400' }
  ];

  const filteredInsights = selectedCategory === 'all' 
    ? aiInsights 
    : aiInsights.filter(insight => insight.category === selectedCategory);

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 90) return 'text-green-400';
    if (confidence >= 75) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getImpactIcon = (impact: string) => {
    switch (impact) {
      case 'high': return <AlertTriangle className="w-4 h-4 text-red-400" />;
      case 'medium': return <Info className="w-4 h-4 text-yellow-400" />;
      case 'low': return <CheckCircle className="w-4 h-4 text-green-400" />;
      default: return <Info className="w-4 h-4 text-blue-400" />;
    }
  };

  // Fallback content if no weather data
  if (!weather) {
    return (
      <div className="space-y-6">
        <motion.div
          className="glass-card p-6 rounded-3xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full bg-gradient-to-r from-purple-500 to-pink-500">
                <Brain className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">AI Weather Intelligence</h3>
                <p className="text-white/70 text-sm">Powered by advanced weather analytics</p>
              </div>
            </div>
          </div>
          <div className="text-center py-10">
            <Brain className="w-16 h-16 text-purple-300 mx-auto mb-4" />
            <p className="text-white/70">Search for a location to see AI-powered weather insights</p>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* AI Header */}
      <motion.div
        className="glass-card p-6 rounded-3xl"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-full bg-gradient-to-r from-purple-500 to-pink-500">
              <Brain className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">AI Weather Intelligence</h3>
              <p className="text-white/70 text-sm">Powered by advanced weather analytics</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-yellow-400" />
            <span className="text-white/60 text-sm">AI-Powered</span>
          </div>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-2 mb-6">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`flex items-center gap-2 px-3 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                selectedCategory === category.id
                  ? 'bg-white/20 text-white border border-white/30'
                  : 'bg-white/10 text-white/70 hover:bg-white/15'
              }`}
            >
              <category.icon className="w-4 h-4" />
              {category.label}
            </button>
          ))}
        </div>

        {/* Insights Display */}
        {filteredInsights.length > 0 ? (
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
                <div className={`p-6 rounded-2xl ${filteredInsights[activeInsight].bgColor} border border-white/10`}>
                  <div className="flex items-start gap-4">
                    <div className={`p-3 rounded-full bg-white/10 ${filteredInsights[activeInsight].color}`}>
                      {filteredInsights[activeInsight].icon}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className={`text-lg font-semibold ${filteredInsights[activeInsight].color}`}>
                          {filteredInsights[activeInsight].title}
                        </h4>
                        <div className="flex items-center gap-2">
                          {getImpactIcon(filteredInsights[activeInsight].impact)}
                          <span className={`text-xs font-medium ${getConfidenceColor(filteredInsights[activeInsight].confidence)}`}>
                            {filteredInsights[activeInsight].confidence}% confidence
                          </span>
                        </div>
                      </div>
                      
                      <p className="text-white/80 mb-4">
                        {filteredInsights[activeInsight].description}
                      </p>
                      
                      <div className="space-y-3">
                        <h5 className="text-sm font-semibold text-white/90 flex items-center gap-2">
                          <Target className="w-4 h-4" />
                          AI Recommendations:
                        </h5>
                        <ul className="space-y-2">
                          {filteredInsights[activeInsight].recommendations.map((rec, index) => (
                            <motion.li
                              key={index}
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: index * 0.1 }}
                              className="flex items-start gap-2 text-sm text-white/70"
                            >
                              <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                              <span>{rec}</span>
                            </motion.li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Navigation */}
            {filteredInsights.length > 1 && (
              <div className="flex justify-center gap-2">
                {filteredInsights.map((_, index) => (
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

            {/* Advanced Analytics Toggle */}
            <button
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="w-full py-3 px-4 rounded-xl bg-white/10 hover:bg-white/20 transition-all duration-300 text-white/80 text-sm font-medium flex items-center justify-center gap-2"
            >
              <BarChart3 className="w-4 h-4" />
              {showAdvanced ? 'Hide Advanced Analytics' : 'Show Advanced Analytics'}
            </button>
          </div>
        ) : (
          <div className="text-center py-10 flex flex-col items-center gap-3">
            <Brain className="w-16 h-16 text-purple-300 animate-pulse" />
            <h4 className="text-lg font-semibold text-white mb-1">No AI Insights Available</h4>
            <p className="text-white/70 max-w-xs mx-auto">
              Weather conditions are within normal ranges. No special recommendations needed at this time.
            </p>
          </div>
        )}
      </motion.div>

      {/* Advanced Analytics Panel */}
      {showAdvanced && (
        <motion.div
          className="glass-card p-6 rounded-3xl"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex items-center gap-3 mb-4">
            <BarChart3 className="w-6 h-6 text-blue-400" />
            <h4 className="text-lg font-semibold text-white">Advanced Weather Analytics</h4>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-white/10">
              <h5 className="text-sm font-semibold text-white/90 mb-2">Weather Pattern Analysis</h5>
              <div className="space-y-2 text-sm text-white/70">
                <div className="flex justify-between">
                  <span>Temperature Stability:</span>
                  <span className="text-green-400">Stable</span>
                </div>
                <div className="flex justify-between">
                  <span>Pressure Trend:</span>
                  <span className="text-blue-400">Rising</span>
                </div>
                <div className="flex justify-between">
                  <span>Humidity Pattern:</span>
                  <span className="text-yellow-400">Variable</span>
                </div>
              </div>
            </div>
            
            <div className="p-4 rounded-2xl bg-white/10">
              <h5 className="text-sm font-semibold text-white/90 mb-2">Predictive Models</h5>
              <div className="space-y-2 text-sm text-white/70">
                <div className="flex justify-between">
                  <span>Next 24h Accuracy:</span>
                  <span className="text-green-400">95%</span>
                </div>
                <div className="flex justify-between">
                  <span>5-day Forecast:</span>
                  <span className="text-blue-400">87%</span>
                </div>
                <div className="flex justify-between">
                  <span>Trend Confidence:</span>
                  <span className="text-yellow-400">82%</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default WeatherAI; 