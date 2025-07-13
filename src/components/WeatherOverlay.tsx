import React from 'react';
import { motion } from 'framer-motion';

interface WeatherOverlayProps {
  weather?: { condition: { main: string } };
  theme: 'light' | 'dark';
}

const WeatherOverlay: React.FC<WeatherOverlayProps> = ({ weather, theme }) => {
  if (!weather) return null;
  const main = weather.condition.main.toLowerCase();

  return (
    <div
      className="weather-bg-anim pointer-events-none fixed inset-0 w-full h-full z-0"
      aria-hidden="true"
      style={{
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        position: 'fixed',
        pointerEvents: 'none',
        zIndex: 0,
      }}
    >
      {/* Clear (sun rays) */}
      {main.includes('clear') && theme === 'light' && (
        <motion.svg
          width="180" height="180" viewBox="0 0 180 180"
          className="absolute left-8 top-8 opacity-60"
          initial={{ rotate: 0 }}
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 18, ease: 'linear' }}
        >
          <circle cx="90" cy="90" r="38" fill="#ffe066" />
          {[...Array(12)].map((_, i) => (
            <rect
              key={i}
              x="88" y="10"
              width="4" height="28"
              fill="#ffd60a"
              transform={`rotate(${i * 30} 90 90)`}
              rx="2"
            />
          ))}
        </motion.svg>
      )}
      {/* Cloudy */}
      {main.includes('cloud') && (
        <motion.svg
          width="320" height="120" viewBox="0 0 320 120"
          className="absolute left-1/2 top-12 -translate-x-1/2 opacity-50"
          initial={{ x: -20 }}
          animate={{ x: 20 }}
          transition={{ repeat: Infinity, repeatType: 'reverse', duration: 16, ease: 'easeInOut' }}
        >
          <ellipse cx="80" cy="60" rx="60" ry="28" fill="#e0e7ef" />
          <ellipse cx="160" cy="50" rx="50" ry="22" fill="#cbd5e1" />
          <ellipse cx="240" cy="65" rx="70" ry="30" fill="#b6c2d1" />
        </motion.svg>
      )}
      {/* Rain Overlay */}
      {(main.includes('rain') || main.includes('drizzle')) && (
        <svg width="100%" height="100%" className="absolute inset-0 pointer-events-none">
          {[...Array(18)].map((_, i) => (
            <motion.ellipse
              key={i}
              cx={40 + (i * 40) % 320}
              cy={40 + (i * 30) % 120}
              rx="2.5" ry="10"
              style={{ fill: 'var(--primary-light)' }}
              initial={{ y: -20, opacity: 0.5 }}
              animate={{ y: 220, opacity: [0.5, 0.7, 0] }}
              transition={{
                repeat: Infinity,
                duration: 1.6 + (i % 5) * 0.3,
                delay: i * 0.13,
                ease: 'linear',
              }}
            />
          ))}
        </svg>
      )}
      {/* Thunderstorm */}
      {main.includes('thunderstorm') && (
        <motion.svg
          width="120" height="120" viewBox="0 0 120 120"
          className="absolute right-16 top-16 opacity-70"
        >
          <ellipse cx="60" cy="60" rx="40" ry="18" fill="#b6c2d1" />
          <motion.polygon
            points="60,70 70,90 55,90 65,110"
            fill="#ffe066"
            initial={{ opacity: 0.2 }}
            animate={{ opacity: [0.2, 1, 0.2] }}
            transition={{ repeat: Infinity, duration: 2.5, times: [0, 0.98, 1] }}
          />
        </motion.svg>
      )}
      {/* Snow Overlay */}
      {main.includes('snow') && (
        <svg width="100%" height="100%" className="absolute inset-0 pointer-events-none">
          {[...Array(16)].map((_, i) => (
            <motion.circle
              key={i}
              cx={30 + (i * 50) % 320}
              cy={30 + (i * 40) % 120}
              r={2.5 + (i % 3)}
              fill="#f1f5f9"
              initial={{ y: -20, opacity: 0.5 }}
              animate={{ y: 220, opacity: [0.5, 0.7, 0] }}
              transition={{
                repeat: Infinity,
                duration: 3.2 + (i % 4) * 0.5,
                delay: i * 0.18,
                ease: 'linear',
              }}
            />
          ))}
        </svg>
      )}
      {/* Night (stars and moon) */}
      {theme === 'dark' && (main.includes('clear') || main.includes('cloud') || main.includes('mist')) && (
        <svg width="100%" height="100%" className="absolute inset-0">
          {/* Crescent Moon */}
          <motion.ellipse
            cx="120" cy="80" rx="22" ry="18"
            fill="#fef9c3"
            initial={{ opacity: 0.7, rotate: 0 }}
            animate={{ opacity: [0.7, 0.9, 0.7], rotate: [0, 8, 0] }}
            transition={{ repeat: Infinity, duration: 8, ease: 'easeInOut' }}
          />
          <motion.ellipse
            cx="128" cy="80" rx="14" ry="12"
            fill="#232946"
            initial={{ opacity: 0.7 }}
            animate={{ opacity: [0.7, 0.8, 0.7] }}
            transition={{ repeat: Infinity, duration: 8, ease: 'easeInOut' }}
          />
          {/* Twinkling Stars */}
          {[...Array(24)].map((_, i) => (
            <motion.circle
              key={i}
              cx={Math.random() * 320 + 20}
              cy={Math.random() * 120 + 20}
              r={0.8 + Math.random() * 1.6}
              fill="#fff"
              initial={{ opacity: 0.4 }}
              animate={{ opacity: [0.4, 1, 0.4] }}
              transition={{
                repeat: Infinity,
                duration: 2 + Math.random() * 2,
                delay: i * 0.13,
                ease: 'easeInOut',
              }}
            />
          ))}
        </svg>
      )}
    </div>
  );
};

export default WeatherOverlay; 