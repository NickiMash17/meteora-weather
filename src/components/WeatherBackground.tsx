import React from 'react';

interface WeatherBackgroundProps {
  weather?: { condition: { main: string } };
  theme: 'light' | 'dark';
}

const WeatherBackground: React.FC<WeatherBackgroundProps> = ({ weather, theme }) => {
  if (!weather) return null;
  const main = weather.condition.main.toLowerCase();

  return (
    <div className="weather-bg-anim pointer-events-none fixed inset-0 w-full h-full z-0" aria-hidden="true">
      {/* Sun rays for clear weather */}
      {main.includes('clear') && theme === 'light' && (
        <svg width="220" height="220" viewBox="0 0 220 220" className="absolute left-8 top-8 opacity-40 animate-spin-slow">
          <circle cx="110" cy="110" r="48" fill="#ffe066" />
          {[...Array(12)].map((_, i) => (
            <rect
              key={i}
              x="108" y="18"
              width="4" height="38"
              fill="#ffd60a"
              transform={`rotate(${i * 30} 110 110)`}
              rx="2"
            />
          ))}
        </svg>
      )}
      {/* Clouds for cloudy weather */}
      {main.includes('cloud') && (
        <svg width="420" height="160" viewBox="0 0 420 160" className="absolute left-1/2 top-16 -translate-x-1/2 opacity-30 animate-cloud-move">
          <ellipse cx="100" cy="80" rx="80" ry="38" fill="#e0e7ef" />
          <ellipse cx="210" cy="70" rx="70" ry="32" fill="#cbd5e1" />
          <ellipse cx="320" cy="95" rx="100" ry="45" fill="#b6c2d1" />
        </svg>
      )}
      {/* Rain for rainy/drizzle weather */}
      {(main.includes('rain') || main.includes('drizzle')) && (
        <svg
          width="100%"
          height="100%"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          style={{ fill: 'var(--primary-light)' }}
        >
          {[...Array(24)].map((_, i) => (
            <rect
              key={i}
              x={40 + (i * 50) % 420}
              y={40 + (i * 30) % 160}
              width="3" height="18"
              fill="#38bdf8"
              className="animate-raindrop"
              style={{ animationDelay: `${i * 0.13}s` }}
              rx="2"
            />
          ))}
        </svg>
      )}
      {/* Snow for snowy weather */}
      {main.includes('snow') && (
        <svg width="100%" height="100%" className="absolute inset-0 pointer-events-none">
          {[...Array(18)].map((_, i) => (
            <circle
              key={i}
              cx={30 + (i * 60) % 420}
              cy={30 + (i * 40) % 160}
              r={2.5 + (i % 3)}
              fill="#f1f5f9"
              className="animate-snowflake"
              style={{ animationDelay: `${i * 0.18}s` }}
            />
          ))}
        </svg>
      )}
    </div>
  );
};

export default WeatherBackground; 