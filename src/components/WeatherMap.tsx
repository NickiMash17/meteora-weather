import React, { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { motion } from 'framer-motion';
import { MapPin, Sun, Cloud, CloudRain, CloudLightning, Snowflake, Wind, Thermometer } from 'lucide-react';

interface WeatherMapProps {
  weather: any;
}

const weatherIcons: Record<string, JSX.Element> = {
  Clear: <Sun className="w-6 h-6 text-yellow-400" />,
  Clouds: <Cloud className="w-6 h-6 text-gray-300" />,
  Rain: <CloudRain className="w-6 h-6 text-blue-400" />,
  Drizzle: <CloudRain className="w-6 h-6 text-blue-300" />,
  Thunderstorm: <CloudLightning className="w-6 h-6 text-purple-400" />,
  Snow: <Snowflake className="w-6 h-6 text-blue-200" />,
  Wind: <Wind className="w-6 h-6 text-green-400" />,
  Default: <Thermometer className="w-6 h-6 text-pink-400" />,
};

const WeatherMap: React.FC<WeatherMapProps> = ({ weather }) => {
  const mapRef = useRef<any>(null);

  // Center map on weather location
  useEffect(() => {
    if (mapRef.current && weather?.coord) {
      mapRef.current.setView([weather.coord.lat, weather.coord.lon], 10);
    }
  }, [weather]);

  if (!weather?.coord) {
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
            <rect x="8" y="16" width="48" height="32" rx="8" fill="#60a5fa" />
            <circle cx="32" cy="32" r="10" fill="#fbbf24" />
            <polygon points="32,22 36,32 32,42 28,32" fill="#2563eb" />
            <circle cx="32" cy="32" r="4" fill="#fff" />
          </svg>
        </motion.div>
        <h3 className="text-2xl font-bold text-blue-400 mb-2">No Map Data</h3>
        <p className="text-white/80 text-lg mb-2">No location data available for the map. Search for a city to explore weather on the map! 🗺️</p>
      </motion.div>
    );
  }

  // Custom marker icon
  const customIcon = new L.DivIcon({
    className: 'custom-weather-marker',
    html: `<div style="background:rgba(255,255,255,0.8);border-radius:16px;padding:8px;box-shadow:0 2px 8px rgba(0,0,0,0.12);display:flex;align-items:center;justify-content:center;">🌍</div>`
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card rounded-2xl p-0 overflow-hidden"
    >
      <div className="relative w-full h-[400px] sm:h-[500px] rounded-2xl overflow-hidden">
        <MapContainer
          center={[weather.coord.lat, weather.coord.lon]}
          zoom={10}
          scrollWheelZoom={true}
          style={{ width: '100%', height: '100%', zIndex: 1 }}
          ref={mapRef}
          className="leaflet-container"
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <Marker position={[weather.coord.lat, weather.coord.lon]} icon={customIcon}>
            <Popup>
              <div className="text-center">
                <div className="mb-2 flex items-center justify-center">
                  {weatherIcons[weather.condition.main] || weatherIcons.Default}
                  <span className="ml-2 font-semibold text-lg">{weather.location}</span>
                </div>
                <div className="text-sm text-gray-700 dark:text-white/80">
                  <div>Temp: <span className="font-bold">{Math.round(weather.temperature.current)}°C</span></div>
                  <div>Condition: <span className="capitalize">{weather.condition.description}</span></div>
                  <div>Humidity: {weather.humidity}%</div>
                  <div>Wind: {weather.wind.speed} km/h</div>
                </div>
              </div>
            </Popup>
          </Marker>
        </MapContainer>
        {/* Map overlay for glass effect */}
        <div className="absolute inset-0 pointer-events-none rounded-2xl bg-white/10 backdrop-blur-md" style={{zIndex:2}} />
      </div>
      <div className="p-4 sm:p-6">
        <h3 className="text-xl font-semibold text-white mb-2 flex items-center gap-2">
          <MapPin className="w-5 h-5 text-blue-400" />
          {weather.location}
        </h3>
        <div className="flex flex-wrap gap-4 text-white/80 text-sm">
          <div className="flex items-center gap-2">
            {weatherIcons[weather.condition.main] || weatherIcons.Default}
            <span className="capitalize">{weather.condition.description}</span>
          </div>
          <div>Temp: <span className="font-bold">{Math.round(weather.temperature.current)}°C</span></div>
          <div>Humidity: {weather.humidity}%</div>
          <div>Wind: {weather.wind.speed} km/h</div>
        </div>
      </div>
    </motion.div>
  );
};

export default WeatherMap; 