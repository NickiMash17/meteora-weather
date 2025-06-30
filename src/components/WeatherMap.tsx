import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MapPin, 
  Navigation, 
  Layers, 
  ZoomIn, 
  ZoomOut, 
  RotateCcw,
  Globe,
  Cloud,
  CloudRain,
  Sun,
  Moon,
  Wind,
  Thermometer,
  Eye,
  Settings,
  Info
} from 'lucide-react';

interface WeatherMapProps {
  weather: any;
  forecast: any;
}

const WeatherMap: React.FC<WeatherMapProps> = ({ weather, forecast }) => {
  const [mapType, setMapType] = useState<'temperature' | 'precipitation' | 'wind' | 'satellite'>('temperature');
  const [zoom, setZoom] = useState(10);
  const [isLoading, setIsLoading] = useState(false);
  const [showLegend, setShowLegend] = useState(true);
  const mapRef = useRef<HTMLDivElement>(null);

  const mapTypes = [
    { id: 'temperature', label: 'Temperature', icon: Thermometer, color: 'text-red-400' },
    { id: 'precipitation', label: 'Precipitation', icon: CloudRain, color: 'text-blue-400' },
    { id: 'wind', label: 'Wind', icon: Wind, color: 'text-green-400' },
    { id: 'satellite', label: 'Satellite', icon: Globe, color: 'text-purple-400' }
  ];

  const getMapBackground = () => {
    switch (mapType) {
      case 'temperature':
        return 'bg-gradient-to-br from-blue-900 via-purple-900 to-red-900';
      case 'precipitation':
        return 'bg-gradient-to-br from-blue-800 via-cyan-800 to-blue-600';
      case 'wind':
        return 'bg-gradient-to-br from-green-900 via-emerald-800 to-teal-700';
      case 'satellite':
        return 'bg-gradient-to-br from-gray-900 via-slate-800 to-zinc-700';
      default:
        return 'bg-gradient-to-br from-blue-900 via-purple-900 to-red-900';
    }
  };

  const getWeatherOverlay = () => {
    if (!weather) return null;

    const condition = weather.condition.main.toLowerCase();
    const temp = weather.temperature.current;
    const hour = new Date().getHours();
    const isDaytime = hour >= 6 && hour < 18;

    if (mapType === 'temperature') {
      return (
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.div
            className="relative"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className={`w-32 h-32 rounded-full flex items-center justify-center ${
              temp > 25 ? 'bg-red-500/20' : 
              temp > 15 ? 'bg-yellow-500/20' : 
              temp > 5 ? 'bg-blue-500/20' : 'bg-purple-500/20'
            }`}>
              <div className="text-4xl font-bold text-white">
                {temp}°
              </div>
            </div>
            <motion.div
              className="absolute inset-0 rounded-full border-4 border-white/30"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </motion.div>
        </div>
      );
    }

    if (mapType === 'precipitation') {
      return (
        <div className="absolute inset-0">
          {condition.includes('rain') && (
            <div className="rain-overlay">
              {Array.from({ length: 50 }, (_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-1 h-8 bg-blue-400 rounded-full opacity-60"
                  style={{
                    left: `${Math.random() * 100}%`,
                    animationDelay: `${Math.random() * 2}s`,
                  }}
                  animate={{
                    y: [0, 400],
                    opacity: [0.6, 0],
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                />
              ))}
            </div>
          )}
          {condition.includes('snow') && (
            <div className="snow-overlay">
              {Array.from({ length: 30 }, (_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-2 h-2 bg-white rounded-full opacity-80"
                  style={{
                    left: `${Math.random() * 100}%`,
                    animationDelay: `${Math.random() * 3}s`,
                  }}
                  animate={{
                    y: [0, 400],
                    x: [0, Math.random() * 50 - 25],
                    rotate: [0, 360],
                    opacity: [0.8, 0],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                />
              ))}
            </div>
          )}
        </div>
      );
    }

    if (mapType === 'wind') {
      return (
        <div className="absolute inset-0">
          {Array.from({ length: 20 }, (_, i) => (
            <motion.div
              key={i}
              className="absolute w-16 h-1 bg-green-400/60 rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`,
              }}
              animate={{
                x: [0, 100],
                opacity: [0, 0.6, 0],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "linear",
              }}
            />
          ))}
        </div>
      );
    }

    return null;
  };

  const getLegend = () => {
    switch (mapType) {
      case 'temperature':
        return (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-white/80">Temperature</span>
              <Thermometer className="w-4 h-4 text-red-400" />
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-red-500 rounded"></div>
              <span className="text-xs text-white/60">Hot (&gt;25°C)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-yellow-500 rounded"></div>
              <span className="text-xs text-white/60">Warm (15-25°C)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-blue-500 rounded"></div>
              <span className="text-xs text-white/60">Cool (5-15°C)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-purple-500 rounded"></div>
              <span className="text-xs text-white/60">Cold (&lt;5°C)</span>
            </div>
          </div>
        );
      case 'precipitation':
        return (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-white/80">Precipitation</span>
              <CloudRain className="w-4 h-4 text-blue-400" />
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-blue-400 rounded"></div>
              <span className="text-xs text-white/60">Rain</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-white rounded"></div>
              <span className="text-xs text-white/60">Snow</span>
            </div>
          </div>
        );
      case 'wind':
        return (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-white/80">Wind</span>
              <Wind className="w-4 h-4 text-green-400" />
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-1 bg-green-400 rounded"></div>
              <span className="text-xs text-white/60">Wind Direction</span>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

    return (
    <div className="space-y-6">
      {/* Map Controls */}
      <motion.div
        className="glass-card p-4 rounded-2xl"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white">Interactive Weather Map</h3>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowLegend(!showLegend)}
              className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
            >
              <Layers className="w-4 h-4 text-white" />
            </button>
            <button
              onClick={() => setIsLoading(true)}
              className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
            >
              <RotateCcw className="w-4 h-4 text-white" />
            </button>
          </div>
        </div>

        {/* Map Type Selector */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4">
          {mapTypes.map((type) => {
            const Icon = type.icon;
            return (
              <button
                key={type.id}
                onClick={() => setMapType(type.id as any)}
                className={`p-3 rounded-xl flex flex-col items-center gap-2 transition-all duration-300 ${
                  mapType === type.id 
                    ? 'bg-white/20 border border-white/30' 
                    : 'bg-white/10 hover:bg-white/15'
                }`}
              >
                <Icon className={`w-5 h-5 ${type.color}`} />
                <span className="text-xs text-white/80">{type.label}</span>
              </button>
            );
          })}
        </div>

        {/* Zoom Controls */}
        <div className="flex items-center justify-center gap-2">
          <button
            onClick={() => setZoom(Math.max(5, zoom - 2))}
            className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
          >
            <ZoomOut className="w-4 h-4 text-white" />
          </button>
          <div className="text-sm text-white/80 px-4">
            {zoom}x
          </div>
          <button
            onClick={() => setZoom(Math.min(20, zoom + 2))}
            className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
          >
            <ZoomIn className="w-4 h-4 text-white" />
          </button>
        </div>
      </motion.div>

      {/* Interactive Map */}
      <motion.div
        ref={mapRef}
        className={`relative h-96 rounded-3xl overflow-hidden glass-card ${getMapBackground()}`}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        style={{
          transform: `scale(${zoom / 10})`,
          transformOrigin: 'center',
        }}
      >
        {/* Map Grid */}
        <div className="absolute inset-0 opacity-20">
          <div className="grid grid-cols-10 grid-rows-10 h-full">
            {Array.from({ length: 100 }, (_, i) => (
              <div key={i} className="border border-white/10"></div>
            ))}
          </div>
        </div>

        {/* Weather Overlay */}
        {getWeatherOverlay()}

        {/* Location Marker */}
        {weather && (
          <motion.div
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.5 }}
          >
            <div className="relative">
              <MapPin className="w-8 h-8 text-red-400 drop-shadow-lg" />
              <motion.div
                className="absolute inset-0 w-8 h-8 bg-red-400 rounded-full opacity-30"
                animate={{ scale: [1, 2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            </div>
          </motion.div>
        )}

        {/* Floating Elements */}
        <motion.div
          className="absolute top-4 right-4"
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        >
          <Navigation className="w-6 h-6 text-white/60" />
        </motion.div>

        <motion.div
          className="absolute bottom-4 left-4"
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        >
          <Globe className="w-6 h-6 text-white/60" />
        </motion.div>
      </motion.div>

      {/* Legend */}
      <AnimatePresence>
        {showLegend && (
    <motion.div
            className="glass-card p-4 rounded-2xl"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-sm font-semibold text-white">Legend</h4>
              <Info className="w-4 h-4 text-white/60" />
            </div>
            {getLegend()}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Loading Overlay */}
      <AnimatePresence>
        {isLoading && (
          <motion.div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center rounded-3xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onAnimationComplete={() => {
              setTimeout(() => setIsLoading(false), 1000);
            }}
          >
              <div className="text-center">
              <div className="loading-spin w-8 h-8 border-2 border-white/20 border-t-white rounded-full mx-auto mb-2" />
              <p className="text-white/80 text-sm">Updating map...</p>
      </div>
    </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default WeatherMap; 