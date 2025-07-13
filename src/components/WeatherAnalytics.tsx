import * as React from 'react';
import { motion } from 'framer-motion';
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown, 
  Thermometer, 
  Droplets, 
  Wind,
  Calendar,
  Clock,
  Activity,
  Info,
  Eye
} from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface WeatherAnalyticsProps {
  weather: any;
  forecast: any;
}

interface MetricData {
  time: number;
  temperature: number;
  humidity: number;
  windSpeed: number;
}

// Simple sparkline SVG generator
const Sparkline: React.FC<{ data: number[]; color?: string }> = ({ data, color = '#60a5fa' }: { data: number[]; color?: string }) => {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const points = data.map((d: number, i: number) => {
    const x = (i / (data.length - 1)) * 100;
    const y = 100 - ((d - min) / (max - min || 1)) * 100;
    return `${x},${y}`;
  }).join(' ');
  return (
    <svg width="100" height="32" viewBox="0 0 100 32" fill="none">
      <polyline
        points={points}
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
    </svg>
  );
};

const WeatherAnalytics: React.FC<WeatherAnalyticsProps> = ({ weather, forecast }: WeatherAnalyticsProps) => {
  const [selectedMetric, setSelectedMetric] = React.useState<'temperature' | 'humidity' | 'wind'>('temperature');
  const { t } = useTranslation();

  // Defensive: Log forecast for debugging
  console.log('WeatherAnalytics forecast:', forecast);

  // Defensive: Check for valid data
  if (!forecast || !forecast.daily || !Array.isArray(forecast.daily) || forecast.daily.length === 0 || forecast.daily.some((d: any) => !d.temperature || typeof d.temperature.max !== 'number' || isNaN(d.temperature.max))) {
    return <div className="text-red-500 text-center p-4">No valid analytics data available.</div>;
  }

  const getMetricData = (): MetricData[] => {
    if (!forecast?.hourly) return [];
    return forecast.hourly.slice(0, 24).map((hour: any, index: number) => ({
      time: hour.time ? (typeof hour.time === 'string' ? hour.time : new Date(hour.time * 1000).getHours()) : index,
      temperature: typeof hour.temperature === 'number' ? Math.round(hour.temperature) : 0,
      humidity: typeof hour.humidity === 'number' ? hour.humidity : 0,
      windSpeed: typeof hour.wind?.speed === 'number' ? Math.round(hour.wind.speed) : 0,
    }));
  };

  const getMetricStats = () => {
    if (!forecast?.daily) return null;
    
    const temps = forecast.daily.map((day: any) => day.temperature.max);
    const humidities = forecast.daily.map((day: any) => day.humidity);
    const winds = forecast.daily.map((day: any) => day.wind.speed);
    
    return {
      temperature: {
        max: Math.max(...temps),
        min: Math.min(...temps),
        avg: Math.round(temps.reduce((a: number, b: number) => a + b, 0) / temps.length)
      },
      humidity: {
        max: Math.max(...humidities),
        min: Math.min(...humidities),
        avg: Math.round(humidities.reduce((a: number, b: number) => a + b, 0) / humidities.length)
      },
      wind: {
        max: Math.max(...winds),
        min: Math.min(...winds),
        avg: Math.round(winds.reduce((a: number, b: number) => a + b, 0) / winds.length)
      }
    };
  };

  const getTrendIcon = (current: number, previous: number) => {
    if (current > previous) {
      return <TrendingUp className="w-4 h-4 text-green-400" />;
    } else if (current < previous) {
      return <TrendingDown className="w-4 h-4 text-red-400" />;
    }
    return <Activity className="w-4 h-4 text-gray-400" />;
  };

  const renderChart = () => {
    const data = getMetricData();
    if (data.length === 0) return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center justify-center text-center py-12"
      >
        <motion.div
          initial={{ scale: 0.8, rotate: -10 }}
          animate={{ scale: [0.8, 1.1, 1], rotate: [0, 10, -10, 0] }}
          transition={{ duration: 2, repeat: Infinity, repeatType: 'mirror' }}
          className="mb-4"
        >
          <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="12" y="28" width="8" height="24" rx="3" fill="#60a5fa" />
            <rect x="28" y="20" width="8" height="32" rx="3" style={{ fill: 'var(--primary-light)' }} />
            <rect x="44" y="36" width="8" height="16" rx="3" fill="#34d399" />
            <circle cx="54" cy="54" r="6" stroke="#60a5fa" strokeWidth="3" fill="none" />
            <line x1="58" y1="58" x2="62" y2="62" stroke="#60a5fa" strokeWidth="3" strokeLinecap="round" />
          </svg>
        </motion.div>
        <h3 
          className="text-xl font-bold text-blue-400 mb-2"
          style={{ color: 'var(--primary-light)' }}
        >
          {t('No Analytics Data')}
        </h3>
        <p className="text-white/80 text-base mb-2">{t('No analytics available yet. Check back soon for trends and insights!')}</p>
      </motion.div>
    );

    const maxValue = Math.max(...data.map((d: MetricData) => d[selectedMetric as keyof MetricData] as number));
    const minValue = Math.min(...data.map((d: MetricData) => d[selectedMetric as keyof MetricData] as number));

    return (
      <div className="h-64 flex items-end justify-between space-x-1">
        {data.map((point: MetricData, index: number) => {
          const value = point[selectedMetric as keyof MetricData] as number;
          const height = ((value - minValue) / (maxValue - minValue)) * 100;
          
          return (
            <motion.div
              key={index}
              initial={{ height: 0 }}
              animate={{ height: `${height}%` }}
              transition={{ delay: index * 0.05, duration: 0.5 }}
              className="flex-1 bg-gradient-to-t from-white/30 to-white/10 rounded-t-lg relative group"
            >
              <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-black/80 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
                {value}{selectedMetric === 'temperature' ? '°C' : selectedMetric === 'humidity' ? '%' : ' km/h'}
              </div>
            </motion.div>
          );
        })}
      </div>
    );
  };

  const stats = getMetricStats();

  // Prepare data for sparklines
  const tempTrend = forecast.daily.map((d: any) => d.temperature.max);
  const humidityTrend = forecast.daily.map((d: any) => d.humidity);
  const windTrend = forecast.daily.map((d: any) => d.wind.speed);
  const visibilityTrend = forecast.daily.map((d: any) => d.visibility);

  // Calculate trends
  const getTrend = (arr: number[]) => arr[arr.length - 1] - arr[0];

  const metrics = [
    {
      label: t('Temperature'),
      icon: Thermometer,
      value: `${Math.round(weather.temperature.current)}°C`,
      trend: getTrend(tempTrend),
      data: tempTrend,
      color: '#fbbf24',
      backgroundColor: 'rgba(251, 191, 36, 0.1)',
      borderColor: '#fbbf24',
      tooltip: t('Max temperature trend for the next 5 days.')
    },
    {
      label: t('Humidity'),
      icon: Droplets,
      value: `${weather.humidity}%`,
      trend: getTrend(humidityTrend),
      data: humidityTrend,
      color: 'var(--accent-light)',
      backgroundColor: 'rgba(6, 182, 212, 0.1)',
      borderColor: 'var(--accent-light)',
      tooltip: t('Humidity trend for the next 5 days.')
    },
    {
      label: t('Wind Speed'),
      icon: Wind,
      value: `${weather.wind.speed} km/h`,
      trend: getTrend(windTrend),
      data: windTrend,
      color: '#34d399',
      tooltip: t('Wind speed trend for the next 5 days.')
    },
    {
      label: t('Visibility'),
      icon: Eye,
      value: `${weather.visibility / 1000} km`,
      trend: getTrend(visibilityTrend),
      data: visibilityTrend,
      color: '#a78bfa',
      tooltip: t('Visibility trend for the next 5 days.')
    },
  ];

  return (
    <div className="space-y-6">
      {/* Metric Selector */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex space-x-2"
      >
        {[
          { key: 'temperature', label: t('Temperature'), icon: Thermometer },
          { key: 'humidity', label: t('Humidity'), icon: Droplets },
          { key: 'wind', label: t('Wind Speed'), icon: Wind }
        ].map((metric) => {
          const Icon = metric.icon;
          return (
            <motion.button
              key={metric.key}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSelectedMetric(metric.key as any)}
              className={`flex items-center space-x-2 px-6 py-3 rounded-full backdrop-blur-sm transition-all duration-300 ${
                selectedMetric === metric.key
                  ? 'bg-white/30 text-white shadow-lg'
                  : 'bg-white/10 text-white/80 hover:bg-white/20'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span>{metric.label}</span>
            </motion.button>
          );
        })}
      </motion.div>

      {/* Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="glass-card rounded-2xl p-6"
      >
        <h3 className="text-xl font-semibold text-white mb-6">
          {t('24-Hour {{metric}} Trend', { metric: t(selectedMetric.charAt(0).toUpperCase() + selectedMetric.slice(1)) })}
        </h3>
        {renderChart()}
        <div className="flex justify-between mt-4 text-white/60 text-sm">
          <span>{t('00:00')}</span>
          <span>{t('06:00')}</span>
          <span>{t('12:00')}</span>
          <span>{t('18:00')}</span>
          <span>{t('24:00')}</span>
        </div>
      </motion.div>

      {/* Statistics */}
      {stats && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          {[
            {
              key: 'temperature',
              label: t('Temperature'),
              icon: Thermometer,
              unit: '°C',
              color: 'text-red-400'
            },
            {
              key: 'humidity',
              label: t('Humidity'),
              icon: Droplets,
              unit: '%',
              color: 'text-blue-400'
            },
            {
              key: 'wind',
              label: t('Wind Speed'),
              icon: Wind,
              unit: 'km/h',
              color: 'text-green-400'
            }
          ].map((metric) => {
            const Icon = metric.icon;
            const data = stats[metric.key as keyof typeof stats];
            return (
              <motion.div
                key={metric.key}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.6 }}
                className="glass-card rounded-2xl p-6"
              >
                <div className="flex items-center space-x-3 mb-4">
                  <div className={`w-10 h-10 bg-white/10 rounded-full flex items-center justify-center`}>
                    <Icon className={`w-5 h-5 ${metric.color}`} />
                  </div>
                  <h4 className="text-lg font-semibold text-white">{metric.label}</h4>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-white/60">{t('Average')}</span>
                    <span className="text-white font-semibold">{data.avg}{metric.unit}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-white/60">{t('Maximum')}</span>
                    <div className="flex items-center space-x-1">
                      {getTrendIcon(data.max, data.avg)}
                      <span className="text-white font-semibold">{data.max}{metric.unit}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-white/60">{t('Minimum')}</span>
                    <div className="flex items-center space-x-1">
                      {getTrendIcon(data.min, data.avg)}
                      <span className="text-white font-semibold">{data.min}{metric.unit}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      )}

      {/* Weather Patterns */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="glass-card rounded-2xl p-6"
      >
        <h3 className="text-xl font-semibold text-white mb-6">{t('Weather Patterns')}</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="text-white font-medium mb-3">{t('Most Common Conditions')}</h4>
            <div className="space-y-2">
              {forecast?.daily?.reduce((acc: any, day: any) => {
                const condition = day.condition.main;
                acc[condition] = (acc[condition] || 0) + 1;
                return acc;
              }, {} as Record<string, number>) && 
              Object.entries(forecast.daily.reduce((acc: any, day: any) => {
                const condition = day.condition.main;
                acc[condition] = (acc[condition] || 0) + 1;
                return acc;
              }, {} as Record<string, number>))
                .sort(([,a], [,b]) => (b as number) - (a as number))
                .slice(0, 3)
                .map(([condition, count]) => (
                  <div key={condition} className="flex items-center justify-between">
                    <span className="text-white/80 capitalize">{condition}</span>
                    <span className="text-white font-semibold">{count as number} days</span>
                  </div>
                ))
              }
            </div>
          </div>
          
          <div>
            <h4 className="text-white font-medium mb-3">{t('Temperature Range')}</h4>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-white/80">{t('Warmest Day')}</span>
                <span className="text-white font-semibold">
                  {forecast?.daily?.reduce((max: any, day: any) => 
                    day.temperature.max > max.temperature.max ? day : max
                  )?.condition?.description || t('N/A')}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-white/80">{t('Coolest Day')}</span>
                <span className="text-white font-semibold">
                  {forecast?.daily?.reduce((min: any, day: any) => 
                    day.temperature.min < min.temperature.min ? day : min
                  )?.condition?.description || t('N/A')}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-white/80">{t('Rainiest Day')}</span>
                <span className="text-white font-semibold">
                  {forecast?.daily?.reduce((max: any, day: any) => 
                    day.precipitation > max.precipitation ? day : max
                  )?.condition?.description || t('N/A')}
                </span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Sparklines */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1 }}
        className="glass-card rounded-2xl p-6"
      >
        <h3 className="text-xl font-semibold text-white mb-6">{t('Trends')}</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {metrics.map((metric, idx) => {
            const Icon = metric.icon;
            const isUp = metric.trend >= 0;
            return (
              <motion.div
                key={metric.label}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + idx * 0.1 }}
                className="bg-white/5 backdrop-blur-sm rounded-lg sm:rounded-xl p-4 sm:p-6 border border-white/10 hover:bg-white/10 transition-all card-hover group relative"
              >
                <div className="flex items-center mb-2">
                  <div className={`w-10 h-10 bg-gradient-to-br from-white/20 to-white/5 rounded-full flex items-center justify-center mr-3`}>
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-lg font-bold text-white">{metric.value}</span>
                      <span className={`flex items-center text-xs font-semibold ${isUp ? 'text-green-400' : 'text-red-400'}`}>
                        {isUp ? <TrendingUp className="w-4 h-4 mr-1" /> : <TrendingDown className="w-4 h-4 mr-1" />}
                        {Math.abs(metric.trend)}
                      </span>
                    </div>
                    <span className="text-white/60 text-xs">{metric.label}</span>
                  </div>
                  {/* Tooltip */}
                  <div className="relative group">
                    <Info className="w-4 h-4 text-white/40 ml-2 cursor-pointer" />
                    <div className="absolute left-1/2 -translate-x-1/2 top-8 z-20 hidden group-hover:block bg-black/80 text-white text-xs rounded-lg px-3 py-2 shadow-lg whitespace-nowrap">
                      {metric.tooltip}
                    </div>
                  </div>
                </div>
                {/* Sparkline */}
                <div className="mt-2">
                  <Sparkline data={metric.data} color={metric.color} />
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
};

export default WeatherAnalytics; 