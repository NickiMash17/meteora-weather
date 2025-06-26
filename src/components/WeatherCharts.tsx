import { useMemo } from 'react';
import { 
  LineChart, 
  Line, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { Thermometer, Droplets, Wind, Cloud } from 'lucide-react';

interface WeatherChartsProps {
  forecast: any;
  weather: any;
}

const WeatherCharts: React.FC<WeatherChartsProps> = ({ forecast, weather }) => {
  const hourlyData = useMemo(() => {
    if (!forecast?.hourly) return [];
    
    return forecast.hourly.slice(0, 24).map((hour: any) => ({
      time: format(new Date(hour.timestamp), 'HH:mm'),
      temperature: Math.round(hour.temperature),
      humidity: hour.humidity || 50,
      windSpeed: hour.windSpeed || 0,
      precipitation: Math.round((hour.precipitation || 0) * 100)
    }));
  }, [forecast]);

  const dailyData = useMemo(() => {
    if (!forecast?.daily) return [];
    
    return forecast.daily.map((day: any) => ({
      day: format(new Date(day.timestamp), 'EEE'),
      max: Math.round(day.temperature.max),
      min: Math.round(day.temperature.min),
      avg: Math.round(day.temperature.day),
      precipitation: Math.round((day.precipitation || 0) * 100)
    }));
  }, [forecast]);

  const conditionData = useMemo(() => {
    if (!forecast?.hourly) return [];
    
    const conditions: Record<string, number> = {};
    forecast.hourly.forEach((hour: any) => {
      const condition = hour.condition;
      conditions[condition] = (conditions[condition] || 0) + 1;
    });
    
    return Object.entries(conditions).map(([name, value]) => ({
      name,
      value,
      fill: getConditionColor(name)
    }));
  }, [forecast]);

  const getConditionColor = (condition: string) => {
    switch (condition) {
      case 'Clear': return '#ffd700';
      case 'Clouds': return '#87ceeb';
      case 'Rain': return '#4cc9f0';
      case 'Snow': return '#ffffff';
      case 'Thunderstorm': return '#7209b7';
      default: return '#adb5bd';
    }
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="chart-tooltip">
          <p className="tooltip-label">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} style={{ color: entry.color }}>
              {entry.name}: {entry.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <motion.div
      className="weather-charts"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="charts-header">
        <h3>Weather Analytics</h3>
        <p>Detailed weather patterns and trends</p>
      </div>

      <div className="charts-grid">
        {/* 24-Hour Temperature Trend */}
        <motion.div
          className="chart-container"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <div className="chart-header">
            <Thermometer className="chart-icon" />
            <h4>24-Hour Temperature Trend</h4>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={hourlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis 
                dataKey="time" 
                stroke="var(--text-secondary-light)"
                fontSize={12}
              />
              <YAxis 
                stroke="var(--text-secondary-light)"
                fontSize={12}
              />
              <Tooltip content={<CustomTooltip />} />
              <Line
                type="monotone"
                dataKey="temperature"
                stroke="var(--primary-light)"
                strokeWidth={3}
                dot={{ fill: 'var(--primary-light)', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: 'var(--primary-light)', strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Daily Temperature Range */}
        <motion.div
          className="chart-container"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <div className="chart-header">
            <Thermometer className="chart-icon" />
            <h4>5-Day Temperature Range</h4>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={dailyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis 
                dataKey="day" 
                stroke="var(--text-secondary-light)"
                fontSize={12}
              />
              <YAxis 
                stroke="var(--text-secondary-light)"
                fontSize={12}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="max" fill="var(--accent-light)" radius={[4, 4, 0, 0]} />
              <Bar dataKey="min" fill="var(--secondary-light)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Humidity Trend */}
        <motion.div
          className="chart-container"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3, delay: 0.3 }}
        >
          <div className="chart-header">
            <Droplets className="chart-icon" />
            <h4>Humidity Levels</h4>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={hourlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis 
                dataKey="time" 
                stroke="var(--text-secondary-light)"
                fontSize={12}
              />
              <YAxis 
                stroke="var(--text-secondary-light)"
                fontSize={12}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="humidity"
                stroke="var(--accent-light)"
                fill="var(--accent-light)"
                fillOpacity={0.3}
              />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Weather Conditions Distribution */}
        <motion.div
          className="chart-container"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3, delay: 0.4 }}
        >
          <div className="chart-header">
            <Cloud className="chart-icon" />
            <h4>Weather Conditions</h4>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={conditionData}
                cx="50%"
                cy="50%"
                innerRadius={40}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {conditionData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default WeatherCharts; 