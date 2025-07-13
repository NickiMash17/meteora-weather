import React, { useRef, useEffect, useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { 
  Sun, 
  Moon, 
  Cloud, 
  CloudRain, 
  CloudLightning, 
  Snowflake,
  Wind,
  Droplets,
  Eye,
  Thermometer,
  Gauge,
  Compass,
  Sparkles,
  Play,
  Pause,
  RotateCcw,
  Maximize2,
  Minimize2
} from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface Weather3DProps {
  weather: any;
  forecast: any;
  theme: 'light' | 'dark';
}

interface Particle {
  x: number;
  y: number;
  z: number;
  vx: number;
  vy: number;
  vz: number;
  size: number;
  opacity: number;
  type: 'rain' | 'snow' | 'cloud' | 'wind';
}

const Weather3D: React.FC<Weather3DProps> = ({ weather, forecast, theme }) => {
  const { t } = useTranslation();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [viewMode, setViewMode] = useState<'atmospheric' | 'particle' | 'topographic'>('atmospheric');
  const [cameraPosition, setCameraPosition] = useState({ x: 0, y: 0, z: 5 });
  const [particles, setParticles] = useState<Particle[]>([]);
  const animationRef = useRef<number>();

  // Weather condition analysis
  const weatherCondition = useMemo(() => {
    if (!weather) return 'clear';
    const condition = weather.condition?.main?.toLowerCase();
    if (condition.includes('rain')) return 'rain';
    if (condition.includes('snow')) return 'snow';
    if (condition.includes('cloud')) return 'cloudy';
    if (condition.includes('thunderstorm')) return 'storm';
    return 'clear';
  }, [weather]);

  // Initialize 3D scene
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const resizeCanvas = () => {
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * window.devicePixelRatio;
      canvas.height = rect.height * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Initialize particles based on weather
    const initParticles = () => {
      const newParticles: Particle[] = [];
      const particleCount = weatherCondition === 'rain' ? 200 : 
                           weatherCondition === 'snow' ? 150 : 
                           weatherCondition === 'cloudy' ? 50 : 30;

      for (let i = 0; i < particleCount; i++) {
        const particle: Particle = {
          x: Math.random() * canvas.width - canvas.width / 2,
          y: Math.random() * canvas.height - canvas.height / 2,
          z: Math.random() * 100 - 50,
          vx: (Math.random() - 0.5) * 2,
          vy: weatherCondition === 'rain' ? Math.random() * 3 + 2 : 
               weatherCondition === 'snow' ? Math.random() * 1 + 0.5 : 0,
          vz: (Math.random() - 0.5) * 0.5,
          size: weatherCondition === 'rain' ? Math.random() * 3 + 1 :
                weatherCondition === 'snow' ? Math.random() * 4 + 2 :
                Math.random() * 20 + 10,
          opacity: Math.random() * 0.8 + 0.2,
          type: weatherCondition === 'rain' ? 'rain' :
                weatherCondition === 'snow' ? 'snow' :
                weatherCondition === 'cloudy' ? 'cloud' : 'wind'
        };
        newParticles.push(particle);
      }
      setParticles(newParticles);
    };

    initParticles();

    // Animation loop
    const animate = () => {
      if (!isPlaying) return;

      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Update and draw particles
      setParticles(prevParticles => 
        prevParticles.map(particle => {
          // Update position
          particle.x += particle.vx;
          particle.y += particle.vy;
          particle.z += particle.vz;

          // Wrap around edges
          if (particle.x > canvas.width / 2) particle.x = -canvas.width / 2;
          if (particle.x < -canvas.width / 2) particle.x = canvas.width / 2;
          if (particle.y > canvas.height / 2) particle.y = -canvas.height / 2;
          if (particle.y < -canvas.height / 2) particle.y = canvas.height / 2;

          // Draw particle
          const scale = 1 + (particle.z / 100);
          const x = particle.x * scale;
          const y = particle.y * scale;
          const size = particle.size * scale;

          ctx.save();
          ctx.globalAlpha = particle.opacity * (1 - Math.abs(particle.z) / 100);
          ctx.translate(x + canvas.width / 2, y + canvas.height / 2);

          switch (particle.type) {
            case 'rain':
              ctx.strokeStyle = theme === 'dark' ? '#60a5fa' : '#3b82f6';
              ctx.lineWidth = 2;
              ctx.beginPath();
              ctx.moveTo(0, -size / 2);
              ctx.lineTo(0, size / 2);
              ctx.stroke();
              break;
            case 'snow':
              ctx.fillStyle = theme === 'dark' ? '#e2e8f0' : '#f8fafc';
              ctx.beginPath();
              for (let i = 0; i < 6; i++) {
                const angle = (i * Math.PI) / 3;
                const x = Math.cos(angle) * size / 2;
                const y = Math.sin(angle) * size / 2;
                if (i === 0) ctx.moveTo(x, y);
                else ctx.lineTo(x, y);
              }
              ctx.closePath();
              ctx.fill();
              break;
            case 'cloud':
              ctx.fillStyle = theme === 'dark' ? '#94a3b8' : '#cbd5e1';
              ctx.beginPath();
              ctx.arc(0, 0, size / 2, 0, Math.PI * 2);
              ctx.fill();
              break;
            case 'wind':
              ctx.strokeStyle = theme === 'dark' ? '#a3e635' : '#84cc16';
              ctx.lineWidth = 1;
              ctx.beginPath();
              ctx.moveTo(-size / 2, 0);
              ctx.lineTo(size / 2, 0);
              ctx.stroke();
              break;
          }
          ctx.restore();

          return particle;
        })
      );

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [weatherCondition, isPlaying, theme]);

  // Weather data visualization
  const weatherMetrics = useMemo(() => {
    if (!weather) return [];
    
    return [
      {
        label: t('Temperature'),
        value: `${Math.round(weather.temperature?.current || 0)}°C`,
        icon: Thermometer,
        color: 'text-red-400',
        trend: weather.temperature?.current > 20 ? 'up' : 'down'
      },
      {
        label: t('Humidity'),
        value: `${weather.humidity || 0}%`,
        icon: Droplets,
        color: 'text-blue-400',
        trend: weather.humidity > 70 ? 'up' : 'down'
      },
      {
        label: t('Wind Speed'),
        value: `${weather.wind?.speed || 0} km/h`,
        icon: Wind,
        color: 'text-green-400',
        trend: weather.wind?.speed > 15 ? 'up' : 'down'
      },
      {
        label: t('Pressure'),
        value: `${weather.pressure || 0} hPa`,
        icon: Gauge,
        color: 'text-purple-400',
        trend: 'stable'
      }
    ];
  }, [weather, t]);

  const getWeatherGradient = () => {
    switch (weatherCondition) {
      case 'rain':
        return 'from-blue-600 via-blue-500 to-cyan-400';
      case 'snow':
        return 'from-gray-300 via-gray-200 to-white';
      case 'storm':
        return 'from-gray-800 via-purple-600 to-blue-500';
      case 'cloudy':
        return 'from-gray-400 via-gray-300 to-gray-200';
      default:
        return 'from-blue-400 via-cyan-300 to-blue-200';
    }
  };

  // Fallback content if no weather data
  if (!weather) {
    return (
      <div className="space-y-6">
        <motion.div
          className="glass-card p-6 rounded-3xl overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full bg-gradient-to-r from-purple-500 to-pink-500">
                <Eye className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">3D Weather Visualization</h3>
                <p className="text-white/70 text-sm">Immersive weather experience</p>
              </div>
            </div>
          </div>
          <div className="text-center py-10">
            <Eye className="w-16 h-16 text-purple-300 mx-auto mb-4" />
            <p className="text-white/70">Search for a location to see 3D weather visualization</p>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 3D Weather Visualization */}
      <motion.div
        className="glass-card p-6 rounded-3xl overflow-hidden"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-full bg-gradient-to-r from-purple-500 to-pink-500">
              <Eye className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">3D Weather Visualization</h3>
              <p className="text-white/70 text-sm">Immersive weather experience</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-yellow-400" />
            <span className="text-white/60 text-xs">Real-time</span>
          </div>
        </div>

        {/* 3D Canvas Container */}
        <div className="relative">
          <div className="relative w-full h-64 sm:h-80 rounded-2xl overflow-hidden bg-gradient-to-br from-black/20 to-white/10 backdrop-blur-sm">
            <canvas
              ref={canvasRef}
              className="w-full h-full"
              style={{ background: `linear-gradient(to bottom right, ${theme === 'dark' ? '#1e293b' : '#f1f5f9'}, ${theme === 'dark' ? '#334155' : '#e2e8f0'})` }}
            />
            
            {/* Overlay Controls */}
            <div className="absolute top-4 right-4 flex items-center gap-2">
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition-all duration-300"
              >
                {isPlaying ? <Pause className="w-4 h-4 text-white" /> : <Play className="w-4 h-4 text-white" />}
              </button>
              <button
                onClick={() => setIsFullscreen(!isFullscreen)}
                className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition-all duration-300"
              >
                {isFullscreen ? <Minimize2 className="w-4 h-4 text-white" /> : <Maximize2 className="w-4 h-4 text-white" />}
              </button>
            </div>

            {/* Weather Info Overlay */}
            <div className="absolute bottom-4 left-4 right-4">
              <div className="bg-black/30 backdrop-blur-md rounded-xl p-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {weatherCondition === 'rain' && <CloudRain className="w-5 h-5 text-blue-400" />}
                    {weatherCondition === 'snow' && <Snowflake className="w-5 h-5 text-blue-200" />}
                    {weatherCondition === 'storm' && <CloudLightning className="w-5 h-5 text-yellow-400" />}
                    {weatherCondition === 'cloudy' && <Cloud className="w-5 h-5 text-gray-400" />}
                    {weatherCondition === 'clear' && <Sun className="w-5 h-5 text-yellow-400" />}
                    <span className="text-white font-medium capitalize">
                      {weatherCondition} conditions
                    </span>
                  </div>
                  <div className="text-white/70 text-sm">
                    {particles.length} particles
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* View Mode Selector */}
        <div className="flex justify-center gap-2 mt-4">
          {[
            { id: 'atmospheric', label: 'Atmospheric', icon: Eye },
            { id: 'particle', label: 'Particle', icon: Sparkles },
            { id: 'topographic', label: 'Topographic', icon: Compass }
          ].map((mode) => (
            <button
              key={mode.id}
              onClick={() => setViewMode(mode.id as any)}
              className={`flex items-center gap-2 px-3 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                viewMode === mode.id
                  ? 'bg-white/20 text-white border border-white/30'
                  : 'bg-white/10 text-white/70 hover:bg-white/15'
              }`}
            >
              <mode.icon className="w-4 h-4" />
              {mode.label}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Weather Metrics Grid */}
      <motion.div
        className="grid grid-cols-2 sm:grid-cols-4 gap-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        {weatherMetrics.map((metric, index) => (
          <motion.div
            key={metric.label}
            className="glass-card p-4 rounded-2xl text-center"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <div className={`inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/10 mb-3 ${metric.color}`}>
              <metric.icon className="w-5 h-5" />
            </div>
            <div className="text-2xl font-bold text-white mb-1">
              {metric.value}
            </div>
            <div className="text-white/70 text-sm">
              {metric.label}
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Camera Controls */}
      <motion.div
        className="glass-card p-4 rounded-2xl"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <div className="flex items-center justify-between">
          <h4 className="text-white font-semibold">Camera Controls</h4>
          <button
            onClick={() => setCameraPosition({ x: 0, y: 0, z: 5 })}
            className="flex items-center gap-2 px-3 py-2 rounded-full bg-white/10 hover:bg-white/20 transition-all duration-300 text-white/70 text-sm"
          >
            <RotateCcw className="w-4 h-4" />
            Reset View
          </button>
        </div>
        
        <div className="grid grid-cols-3 gap-4 mt-4">
          {[
            { label: 'X', value: cameraPosition.x, range: [-10, 10] },
            { label: 'Y', value: cameraPosition.y, range: [-10, 10] },
            { label: 'Z', value: cameraPosition.z, range: [1, 20] }
          ].map((axis) => (
            <div key={axis.label} className="text-center">
              <label className="text-white/70 text-sm mb-2 block">{axis.label}</label>
              <input
                type="range"
                min={axis.range[0]}
                max={axis.range[1]}
                value={axis.value}
                onChange={(e) => setCameraPosition(prev => ({
                  ...prev,
                  [axis.label.toLowerCase()]: parseFloat(e.target.value)
                }))}
                className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer"
              />
              <div className="text-white text-xs mt-1">{axis.value.toFixed(1)}</div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default Weather3D; 