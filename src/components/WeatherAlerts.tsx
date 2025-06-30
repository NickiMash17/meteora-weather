import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  AlertTriangle,
  AlertCircle,
  Info,
  Thermometer,
  Wind,
  Droplets,
  CloudLightning,
  Snowflake,
  Eye,
  Clock
} from 'lucide-react';

interface WeatherAlertsProps {
  weather: any;
  forecast: any;
}

interface Alert {
  id: string;
  type: 'warning' | 'danger' | 'info';
  icon: React.ComponentType<any>;
  title: string;
  description: string;
  severity: number;
  timestamp: Date;
}

const WeatherAlerts: React.FC<WeatherAlertsProps> = ({ weather, forecast }) => {
  const [alerts, setAlerts] = React.useState<Alert[]>([]);

  React.useEffect(() => {
    if (!weather) return;

    const newAlerts: Alert[] = [];
    const { temperature, condition, wind, humidity, visibility } = weather;

    // Temperature alerts
    if (temperature.current < 0) {
      newAlerts.push({
        id: 'freezing',
        type: 'warning',
        icon: Thermometer,
        title: 'Freezing Conditions',
        description: 'Bundle up! Temperatures are below freezing. Consider wearing thermal layers and be cautious of icy conditions.',
        severity: 3,
        timestamp: new Date()
      });
    } else if (temperature.current > 30) {
      newAlerts.push({
        id: 'heat',
        type: 'warning',
        icon: Thermometer,
        title: 'High Temperature Alert',
        description: 'Stay hydrated and avoid prolonged sun exposure. Consider indoor activities during peak hours.',
        severity: 3,
        timestamp: new Date()
      });
    }

    // Weather condition alerts
    switch (condition.main) {
      case 'Thunderstorm':
        newAlerts.push({
          id: 'thunderstorm',
          type: 'danger',
          icon: CloudLightning,
          title: 'Thunderstorm Warning',
          description: 'Seek shelter indoors immediately. Lightning can be dangerous and storms may bring heavy rain and strong winds.',
          severity: 5,
          timestamp: new Date()
        });
        break;
      case 'Rain':
        newAlerts.push({
          id: 'rain',
          type: 'warning',
          icon: Droplets,
          title: 'Rain Expected',
          description: 'Don\'t forget your umbrella! Rain is in the forecast. Roads may be slippery.',
          severity: 2,
          timestamp: new Date()
        });
        break;
      case 'Snow':
        newAlerts.push({
          id: 'snow',
          type: 'warning',
          icon: Snowflake,
          title: 'Snow Alert',
          description: 'Snow is expected. Drive carefully and dress warmly. Roads may be hazardous.',
          severity: 4,
          timestamp: new Date()
        });
        break;
    }

    // Wind alerts
    if (wind.speed > 20) {
      newAlerts.push({
        id: 'wind',
        type: 'warning',
        icon: Wind,
        title: 'High Winds',
        description: 'Strong winds detected. Secure loose objects and be cautious of falling branches.',
        severity: 3,
        timestamp: new Date()
      });
    }

    // Visibility alerts
    if (visibility < 5000) {
      newAlerts.push({
        id: 'visibility',
        type: 'warning',
        icon: Eye,
        title: 'Low Visibility',
        description: 'Poor visibility conditions. Drive carefully and use headlights if driving.',
        severity: 3,
        timestamp: new Date()
      });
    }

    // Humidity alerts
    if (humidity > 80) {
      newAlerts.push({
        id: 'humidity',
        type: 'info',
        icon: Droplets,
        title: 'High Humidity',
        description: 'High humidity levels. Stay hydrated and consider using air conditioning.',
        severity: 1,
        timestamp: new Date()
      });
    }

    // Forecast-based alerts
    if (forecast?.daily) {
      const maxTemp = Math.max(...forecast.daily.map((day: any) => day.temperature.max));
      const minTemp = Math.min(...forecast.daily.map((day: any) => day.temperature.min));
      
      if (maxTemp > 35) {
        newAlerts.push({
          id: 'heat-wave',
          type: 'danger',
          icon: Thermometer,
          title: 'Heat Wave Warning',
          description: 'Extreme heat expected in the coming days. Take extra precautions to stay cool.',
          severity: 4,
          timestamp: new Date()
        });
      }
      
      if (minTemp < -10) {
        newAlerts.push({
          id: 'cold-wave',
          type: 'danger',
          icon: Thermometer,
          title: 'Cold Wave Warning',
          description: 'Extreme cold expected. Ensure proper heating and avoid prolonged outdoor exposure.',
          severity: 4,
          timestamp: new Date()
        });
      }
    }

    setAlerts(newAlerts.sort((a, b) => b.severity - a.severity));
  }, [weather, forecast]);

  const getAlertColor = (type: Alert['type']) => {
    switch (type) {
      case 'danger':
        return 'border-red-500/50 bg-red-500/10';
      case 'warning':
        return 'border-yellow-500/50 bg-yellow-500/10';
      case 'info':
        return 'border-blue-500/50 bg-blue-500/10';
      default:
        return 'border-gray-500/50 bg-gray-500/10';
    }
  };

  const getAlertIconColor = (type: Alert['type']) => {
    switch (type) {
      case 'danger':
        return 'text-red-400';
      case 'warning':
        return 'text-yellow-400';
      case 'info':
        return 'text-blue-400';
      default:
        return 'text-gray-400';
    }
  };

  if (alerts.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card rounded-2xl p-8 flex flex-col items-center justify-center text-center border border-blue-400/20 bg-blue-400/5 mt-4"
      >
        <motion.div
          initial={{ scale: 0.8, rotate: -10 }}
          animate={{ scale: [0.8, 1.1, 1], rotate: [0, 10, -10, 0] }}
          transition={{ duration: 2, repeat: Infinity, repeatType: 'mirror' }}
          className="mb-4"
        >
          <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="32" cy="32" r="18" fill="#fbbf24" />
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
          </svg>
        </motion.div>
        <h3 className="text-2xl font-bold text-yellow-400 mb-2">No Weather Alerts</h3>
        <p className="text-white/80 text-lg mb-2">Skies are calm and clear. Enjoy your day! 🌤️</p>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4"
    >
      <div className="flex items-center space-x-3">
        <AlertTriangle className="w-6 h-6 text-white" />
        <h3 className="text-xl font-semibold text-white">Weather Alerts</h3>
        <span className="px-2 py-1 bg-white/20 rounded-full text-white text-sm">
          {alerts.length}
        </span>
      </div>

      <AnimatePresence>
        {alerts.map((alert, index) => {
          const Icon = alert.icon;
          return (
            <motion.div
              key={alert.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ delay: index * 0.1 }}
              className={`glass-card rounded-2xl p-6 border ${getAlertColor(alert.type)}`}
            >
              <div className="flex items-start space-x-4">
                <div className={`w-12 h-12 bg-white/10 rounded-full flex items-center justify-center flex-shrink-0`}>
                  <Icon className={`w-6 h-6 ${getAlertIconColor(alert.type)}`} />
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h4 className="text-lg font-semibold text-white">{alert.title}</h4>
                    <div className="flex items-center space-x-1">
                      <Clock className="w-4 h-4 text-white/60" />
                      <span className="text-white/60 text-sm">
                        {alert.timestamp.toLocaleTimeString()}
                      </span>
                    </div>
                  </div>
                  <p className="text-white/80 leading-relaxed">{alert.description}</p>
                  
                  <div className="flex items-center space-x-4 mt-4">
                    <div className="flex items-center space-x-1">
                      <div className={`w-2 h-2 rounded-full ${
                        alert.severity >= 4 ? 'bg-red-400' :
                        alert.severity >= 3 ? 'bg-yellow-400' :
                        'bg-blue-400'
                      }`} />
                      <span className="text-white/60 text-sm">
                        {alert.severity >= 4 ? 'High' : alert.severity >= 3 ? 'Medium' : 'Low'} Priority
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </AnimatePresence>

      {/* Safety Tips */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="glass-card rounded-2xl p-6 border border-blue-500/30 bg-blue-500/5"
      >
        <div className="flex items-center space-x-3 mb-4">
          <Info className="w-6 h-6 text-blue-400" />
          <h4 className="text-lg font-semibold text-white">Safety Tips</h4>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-white/80 text-sm">
          <div>
            <p className="font-medium mb-2">During Extreme Weather:</p>
            <ul className="space-y-1">
              <li>• Stay indoors when possible</li>
              <li>• Keep emergency supplies ready</li>
              <li>• Monitor local weather updates</li>
            </ul>
          </div>
          <div>
            <p className="font-medium mb-2">General Safety:</p>
            <ul className="space-y-1">
              <li>• Dress appropriately for conditions</li>
              <li>• Stay hydrated and well-rested</li>
              <li>• Have a plan for emergencies</li>
            </ul>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default WeatherAlerts; 