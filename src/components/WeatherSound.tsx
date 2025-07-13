import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Volume2, 
  VolumeX, 
  Play, 
  Pause, 
  RotateCcw,
  Settings,
  Waves,
  CloudRain,
  Wind,
  Sun,
  Moon,
  Cloud,
  CloudLightning,
  Snowflake,
  Thermometer,
  Droplets,
  Sparkles,
  Sliders,
  Music,
  Headphones,
  Speaker
} from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface WeatherSoundProps {
  weather: any;
  theme: 'light' | 'dark';
}

interface SoundLayer {
  id: string;
  name: string;
  icon: React.ReactNode;
  volume: number;
  isPlaying: boolean;
  loop: boolean;
  fadeIn: number;
  fadeOut: number;
  filter: {
    lowpass: number;
    highpass: number;
    reverb: number;
  };
}

const WeatherSound: React.FC<WeatherSoundProps> = ({ weather, theme }) => {
  const { t } = useTranslation();
  const [isEnabled, setIsEnabled] = useState(false);
  const [masterVolume, setMasterVolume] = useState(0.7);
  const [isMuted, setIsMuted] = useState(false);
  const [activePreset, setActivePreset] = useState<string>('auto');
  const [showSettings, setShowSettings] = useState(false);
  const audioContextRef = useRef<AudioContext | null>(null);
  const soundLayersRef = useRef<Map<string, AudioBufferSourceNode>>(new Map());
  const gainNodesRef = useRef<Map<string, GainNode>>(new Map());
  const filterNodesRef = useRef<Map<string, BiquadFilterNode>>(new Map());

  // Weather-based sound presets
  const soundPresets = useMemo(() => {
    const condition = weather?.condition?.main?.toLowerCase() || 'clear';
    const temp = weather?.temperature?.current || 20;
    const humidity = weather?.humidity || 50;
    const windSpeed = weather?.wind?.speed || 0;
    const hour = new Date().getHours();
    const isDaytime = hour >= 6 && hour < 18;

    const presets = {
      auto: {
        name: 'Auto (Weather-based)',
        description: 'Automatically adjusts based on current weather',
        icon: <Sparkles className="w-5 h-5" />,
        layers: [] as SoundLayer[]
      },
      clear: {
        name: 'Clear Sky',
        description: 'Peaceful ambient sounds for clear weather',
        icon: <Sun className="w-5 h-5" />,
        layers: [
          {
            id: 'birds',
            name: 'Birds',
            icon: <Music className="w-4 h-4" />,
            volume: 0.3,
            isPlaying: true,
            loop: true,
            fadeIn: 2000,
            fadeOut: 1000,
            filter: { lowpass: 8000, highpass: 200, reverb: 0.2 }
          },
          {
            id: 'wind-light',
            name: 'Light Wind',
            icon: <Wind className="w-4 h-4" />,
            volume: 0.2,
            isPlaying: true,
            loop: true,
            fadeIn: 3000,
            fadeOut: 2000,
            filter: { lowpass: 4000, highpass: 100, reverb: 0.3 }
          }
        ]
      },
      rain: {
        name: 'Rain',
        description: 'Soothing rain sounds',
        icon: <CloudRain className="w-5 h-5" />,
        layers: [
          {
            id: 'rain-heavy',
            name: 'Heavy Rain',
            icon: <CloudRain className="w-4 h-4" />,
            volume: 0.4,
            isPlaying: true,
            loop: true,
            fadeIn: 1000,
            fadeOut: 500,
            filter: { lowpass: 6000, highpass: 500, reverb: 0.4 }
          },
          {
            id: 'thunder',
            name: 'Thunder',
            icon: <CloudLightning className="w-4 h-4" />,
            volume: 0.3,
            isPlaying: false,
            loop: false,
            fadeIn: 500,
            fadeOut: 2000,
            filter: { lowpass: 2000, highpass: 50, reverb: 0.6 }
          },
          {
            id: 'wind-rain',
            name: 'Wind in Rain',
            icon: <Wind className="w-4 h-4" />,
            volume: 0.25,
            isPlaying: true,
            loop: true,
            fadeIn: 2000,
            fadeOut: 1500,
            filter: { lowpass: 3000, highpass: 200, reverb: 0.3 }
          }
        ]
      },
      storm: {
        name: 'Thunderstorm',
        description: 'Intense storm atmosphere',
        icon: <CloudLightning className="w-5 h-5" />,
        layers: [
          {
            id: 'rain-storm',
            name: 'Storm Rain',
            icon: <CloudRain className="w-4 h-4" />,
            volume: 0.5,
            isPlaying: true,
            loop: true,
            fadeIn: 500,
            fadeOut: 300,
            filter: { lowpass: 5000, highpass: 300, reverb: 0.5 }
          },
          {
            id: 'thunder-frequent',
            name: 'Frequent Thunder',
            icon: <CloudLightning className="w-4 h-4" />,
            volume: 0.4,
            isPlaying: true,
            loop: false,
            fadeIn: 200,
            fadeOut: 3000,
            filter: { lowpass: 1500, highpass: 30, reverb: 0.7 }
          },
          {
            id: 'wind-storm',
            name: 'Storm Wind',
            icon: <Wind className="w-4 h-4" />,
            volume: 0.35,
            isPlaying: true,
            loop: true,
            fadeIn: 1000,
            fadeOut: 1000,
            filter: { lowpass: 2000, highpass: 150, reverb: 0.4 }
          }
        ]
      },
      snow: {
        name: 'Snow',
        description: 'Peaceful winter sounds',
        icon: <Snowflake className="w-5 h-5" />,
        layers: [
          {
            id: 'snow-fall',
            name: 'Snow Falling',
            icon: <Snowflake className="w-4 h-4" />,
            volume: 0.3,
            isPlaying: true,
            loop: true,
            fadeIn: 4000,
            fadeOut: 3000,
            filter: { lowpass: 3000, highpass: 100, reverb: 0.6 }
          },
          {
            id: 'wind-cold',
            name: 'Cold Wind',
            icon: <Wind className="w-4 h-4" />,
            volume: 0.25,
            isPlaying: true,
            loop: true,
            fadeIn: 3000,
            fadeOut: 2000,
            filter: { lowpass: 2500, highpass: 150, reverb: 0.4 }
          }
        ]
      },
      night: {
        name: 'Night Ambience',
        description: 'Peaceful nighttime sounds',
        icon: <Moon className="w-5 h-5" />,
        layers: [
          {
            id: 'crickets',
            name: 'Crickets',
            icon: <Music className="w-4 h-4" />,
            volume: 0.25,
            isPlaying: true,
            loop: true,
            fadeIn: 3000,
            fadeOut: 2000,
            filter: { lowpass: 6000, highpass: 300, reverb: 0.2 }
          },
          {
            id: 'wind-night',
            name: 'Night Wind',
            icon: <Wind className="w-4 h-4" />,
            volume: 0.2,
            isPlaying: true,
            loop: true,
            fadeIn: 4000,
            fadeOut: 3000,
            filter: { lowpass: 2000, highpass: 100, reverb: 0.3 }
          }
        ]
      }
    };

    // Auto preset based on weather conditions
    if (condition.includes('rain') && condition.includes('thunder')) {
      presets.auto = presets.storm;
    } else if (condition.includes('rain')) {
      presets.auto = presets.rain;
    } else if (condition.includes('snow')) {
      presets.auto = presets.snow;
    } else if (!isDaytime) {
      presets.auto = presets.night;
    } else {
      presets.auto = presets.clear;
    }

    return presets;
  }, [weather]);

  // Initialize audio context
  useEffect(() => {
    if (isEnabled && !audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }

    return () => {
      if (audioContextRef.current) {
        audioContextRef.current.close();
        audioContextRef.current = null;
      }
    };
  }, [isEnabled]);

  // Generate synthetic sounds
  const generateSound = (type: string, duration: number = 10): AudioBuffer => {
    const audioContext = audioContextRef.current;
    if (!audioContext) throw new Error('Audio context not initialized');

    const sampleRate = audioContext.sampleRate;
    const buffer = audioContext.createBuffer(1, sampleRate * duration, sampleRate);
    const channelData = buffer.getChannelData(0);

    switch (type) {
      case 'rain':
        for (let i = 0; i < channelData.length; i++) {
          channelData[i] = (Math.random() - 0.5) * 0.1 * Math.exp(-i / (sampleRate * 0.1));
        }
        break;
      case 'thunder':
        for (let i = 0; i < channelData.length; i++) {
          const t = i / sampleRate;
          channelData[i] = Math.sin(50 * t) * Math.exp(-t * 2) * (Math.random() * 0.5 + 0.5);
        }
        break;
      case 'wind':
        for (let i = 0; i < channelData.length; i++) {
          channelData[i] = (Math.random() - 0.5) * 0.05 * (1 + Math.sin(i * 0.001) * 0.5);
        }
        break;
      case 'birds':
        for (let i = 0; i < channelData.length; i++) {
          const t = i / sampleRate;
          channelData[i] = Math.sin(800 * t) * Math.exp(-t * 0.5) * (Math.random() * 0.3);
        }
        break;
      case 'crickets':
        for (let i = 0; i < channelData.length; i++) {
          const t = i / sampleRate;
          channelData[i] = Math.sin(2000 * t) * Math.exp(-t * 0.3) * (Math.random() * 0.2);
        }
        break;
      case 'snow':
        for (let i = 0; i < channelData.length; i++) {
          channelData[i] = (Math.random() - 0.5) * 0.03 * Math.exp(-i / (sampleRate * 0.2));
        }
        break;
      default:
        for (let i = 0; i < channelData.length; i++) {
          channelData[i] = 0;
        }
    }

    return buffer;
  };

  // Play sound layer
  const playSoundLayer = (layer: SoundLayer) => {
    if (!audioContextRef.current || !isEnabled || isMuted) return;

    try {
      const audioContext = audioContextRef.current;
      const buffer = generateSound(layer.id.split('-')[0]);
      
      const source = audioContext.createBufferSource();
      const gainNode = audioContext.createGain();
      const filterNode = audioContext.createBiquadFilter();

      source.buffer = buffer;
      source.loop = layer.loop;

      // Apply filters
      filterNode.type = 'lowpass';
      filterNode.frequency.value = layer.filter.lowpass;
      filterNode.Q.value = 1;

      // Apply gain
      gainNode.gain.setValueAtTime(0, audioContext.currentTime);
      gainNode.gain.linearRampToValueAtTime(
        layer.volume * masterVolume * (isMuted ? 0 : 1),
        audioContext.currentTime + layer.fadeIn / 1000
      );

      // Connect nodes
      source.connect(filterNode);
      filterNode.connect(gainNode);
      gainNode.connect(audioContext.destination);

      // Store references
      soundLayersRef.current.set(layer.id, source);
      gainNodesRef.current.set(layer.id, gainNode);
      filterNodesRef.current.set(layer.id, filterNode);

      source.start();
    } catch (error) {
      console.error('Error playing sound layer:', error);
    }
  };

  // Stop sound layer
  const stopSoundLayer = (layer: SoundLayer) => {
    const source = soundLayersRef.current.get(layer.id);
    const gainNode = gainNodesRef.current.get(layer.id);

    if (source && gainNode && audioContextRef.current) {
      const audioContext = audioContextRef.current;
      gainNode.gain.linearRampToValueAtTime(0, audioContext.currentTime + layer.fadeOut / 1000);
      
      setTimeout(() => {
        source.stop();
        soundLayersRef.current.delete(layer.id);
        gainNodesRef.current.delete(layer.id);
        filterNodesRef.current.delete(layer.id);
      }, layer.fadeOut);
    }
  };

  // Handle preset change
  const handlePresetChange = (presetId: string) => {
    // Stop all current sounds
    soundLayersRef.current.forEach((source) => {
      source.stop();
    });
    soundLayersRef.current.clear();
    gainNodesRef.current.clear();
    filterNodesRef.current.clear();

    setActivePreset(presetId);
    
    if (isEnabled && !isMuted) {
      const preset = soundPresets[presetId as keyof typeof soundPresets];
      preset.layers.forEach(layer => {
        if (layer.isPlaying) {
          playSoundLayer(layer);
        }
      });
    }
  };

  // Handle master volume change
  const handleMasterVolumeChange = (volume: number) => {
    setMasterVolume(volume);
    gainNodesRef.current.forEach((gainNode) => {
      if (audioContextRef.current) {
        gainNode.gain.setValueAtTime(volume * (isMuted ? 0 : 1), audioContextRef.current.currentTime);
      }
    });
  };

  // Handle mute toggle
  const handleMuteToggle = () => {
    setIsMuted(!isMuted);
    gainNodesRef.current.forEach((gainNode) => {
      if (audioContextRef.current) {
        gainNode.gain.setValueAtTime(
          masterVolume * (!isMuted ? 0 : 1),
          audioContextRef.current.currentTime
        );
      }
    });
  };

  // Enable/disable sound system
  const handleEnableToggle = () => {
    if (!isEnabled) {
      setIsEnabled(true);
      // Start playing current preset
      setTimeout(() => {
        const preset = soundPresets[activePreset as keyof typeof soundPresets];
        preset.layers.forEach(layer => {
          if (layer.isPlaying) {
            playSoundLayer(layer);
          }
        });
      }, 100);
    } else {
      setIsEnabled(false);
      // Stop all sounds
      soundLayersRef.current.forEach((source) => {
        source.stop();
      });
      soundLayersRef.current.clear();
      gainNodesRef.current.clear();
      filterNodesRef.current.clear();
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
              <div className="p-2 rounded-full bg-gradient-to-r from-green-500 to-blue-500">
                <Headphones className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Weather Sound Experience</h3>
                <p className="text-white/70 text-sm">Immersive ambient sounds</p>
              </div>
            </div>
          </div>
          <div className="text-center py-10">
            <Headphones className="w-16 h-16 text-green-300 mx-auto mb-4" />
            <p className="text-white/70">Search for a location to experience weather-based sounds</p>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Weather Sound Experience */}
      <motion.div
        className="glass-card p-6 rounded-3xl"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-full bg-gradient-to-r from-green-500 to-blue-500">
              <Headphones className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Weather Sound Experience</h3>
              <p className="text-white/70 text-sm">Immersive ambient sounds</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Waves className="w-4 h-4 text-blue-400" />
            <span className="text-white/60 text-xs">3D Audio</span>
          </div>
        </div>

        {/* Main Controls */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={handleEnableToggle}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all duration-300 ${
              isEnabled
                ? 'bg-green-500 hover:bg-green-600 text-white'
                : 'bg-white/10 hover:bg-white/20 text-white'
            }`}
          >
            {isEnabled ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
            {isEnabled ? 'Sound Active' : 'Enable Sound'}
          </button>

          <div className="flex items-center gap-3">
            <button
              onClick={handleMuteToggle}
              className={`p-2 rounded-full transition-all duration-300 ${
                isMuted ? 'bg-red-500/20 text-red-400' : 'bg-white/10 text-white hover:bg-white/20'
              }`}
            >
              {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>

            <button
              onClick={() => setShowSettings(!showSettings)}
              className="p-2 rounded-full bg-white/10 text-white hover:bg-white/20 transition-all duration-300"
            >
              <Settings className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Preset Selector */}
        <div className="mb-6">
          <h4 className="text-white font-semibold mb-3">Sound Presets</h4>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {Object.entries(soundPresets).map(([id, preset]) => (
              <button
                key={id}
                onClick={() => handlePresetChange(id)}
                className={`p-3 rounded-xl text-left transition-all duration-300 ${
                  activePreset === id
                    ? 'bg-white/20 border border-white/30'
                    : 'bg-white/10 hover:bg-white/15'
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <div className="text-blue-400">{preset.icon}</div>
                  <span className="text-white font-medium text-sm">{preset.name}</span>
                </div>
                <p className="text-white/60 text-xs">{preset.description}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Volume Control */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-white font-medium">Master Volume</span>
            <span className="text-white/60 text-sm">{Math.round(masterVolume * 100)}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={masterVolume}
            onChange={(e) => handleMasterVolumeChange(parseFloat(e.target.value))}
            className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer"
            disabled={!isEnabled}
          />
        </div>

        {/* Settings Panel */}
        <AnimatePresence>
          {showSettings && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="border-t border-white/10 pt-4"
            >
              <h4 className="text-white font-semibold mb-3">Advanced Settings</h4>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-white/70 text-sm mb-2 block">Audio Quality</label>
                  <select className="w-full p-2 rounded-lg bg-white/10 text-white border border-white/20">
                    <option value="high">High Quality</option>
                    <option value="medium">Medium Quality</option>
                    <option value="low">Low Quality</option>
                  </select>
                </div>
                
                <div>
                  <label className="text-white/70 text-sm mb-2 block">Spatial Audio</label>
                  <select className="w-full p-2 rounded-lg bg-white/10 text-white border border-white/20">
                    <option value="stereo">Stereo</option>
                    <option value="surround">Surround</option>
                    <option value="binaural">Binaural</option>
                  </select>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Current Preset Info */}
        <div className="bg-white/10 rounded-xl p-4">
          <div className="flex items-center gap-3 mb-3">
            <div className="text-blue-400">
              {soundPresets[activePreset as keyof typeof soundPresets].icon}
            </div>
            <div>
              <h4 className="text-white font-semibold">
                {soundPresets[activePreset as keyof typeof soundPresets].name}
              </h4>
              <p className="text-white/70 text-sm">
                {soundPresets[activePreset as keyof typeof soundPresets].description}
              </p>
            </div>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {soundPresets[activePreset as keyof typeof soundPresets].layers.map((layer) => (
              <div key={layer.id} className="flex items-center gap-2 p-2 rounded-lg bg-white/5">
                <div className="text-white/60">{layer.icon}</div>
                <div className="flex-1">
                  <div className="text-white text-sm font-medium">{layer.name}</div>
                  <div className="text-white/50 text-xs">{Math.round(layer.volume * 100)}%</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default WeatherSound; 