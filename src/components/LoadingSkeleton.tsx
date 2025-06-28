import React from 'react';
import { motion } from 'framer-motion';

interface SkeletonProps {
  type?: 'weather-card' | 'forecast-item' | 'hero' | 'map' | 'insights';
  className?: string;
}

const LoadingSkeleton: React.FC<SkeletonProps> = ({ type = 'weather-card', className = '' }) => {
  const shimmerAnimation = {
    background: 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)',
    backgroundSize: '200% 100%',
    animation: 'shimmer 1.5s infinite',
  };

  const renderWeatherCard = () => (
    <div className="glass-card p-6 rounded-2xl">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <motion.div
            style={shimmerAnimation}
            className="w-12 h-12 rounded-full"
          />
          <div>
            <motion.div
              style={shimmerAnimation}
              className="w-24 h-4 rounded mb-2"
            />
            <motion.div
              style={shimmerAnimation}
              className="w-16 h-3 rounded"
            />
          </div>
        </div>
        <motion.div
          style={shimmerAnimation}
          className="w-16 h-16 rounded-full"
        />
      </div>
      
      <div className="space-y-3">
        <motion.div
          style={shimmerAnimation}
          className="w-full h-8 rounded"
        />
        <motion.div
          style={shimmerAnimation}
          className="w-3/4 h-6 rounded"
        />
        <motion.div
          style={shimmerAnimation}
          className="w-1/2 h-4 rounded"
        />
      </div>
    </div>
  );

  const renderForecastItem = () => (
    <div className="glass-card p-4 rounded-xl">
      <motion.div
        style={shimmerAnimation}
        className="w-12 h-12 rounded-full mx-auto mb-3"
      />
      <motion.div
        style={shimmerAnimation}
        className="w-16 h-4 rounded mx-auto mb-2"
      />
      <motion.div
        style={shimmerAnimation}
        className="w-12 h-3 rounded mx-auto"
      />
    </div>
  );

  const renderHero = () => (
    <div className="glass-card p-8 rounded-3xl text-center">
      <motion.div
        style={shimmerAnimation}
        className="w-32 h-32 rounded-full mx-auto mb-6"
      />
      <motion.div
        style={shimmerAnimation}
        className="w-48 h-12 rounded mx-auto mb-4"
      />
      <motion.div
        style={shimmerAnimation}
        className="w-64 h-6 rounded mx-auto mb-3"
      />
      <motion.div
        style={shimmerAnimation}
        className="w-40 h-4 rounded mx-auto"
      />
    </div>
  );

  const renderMap = () => (
    <div className="glass-card p-6 rounded-2xl">
      <motion.div
        style={shimmerAnimation}
        className="w-full h-64 rounded-xl mb-4"
      />
      <div className="flex justify-between items-center">
        <motion.div
          style={shimmerAnimation}
          className="w-20 h-8 rounded"
        />
        <motion.div
          style={shimmerAnimation}
          className="w-24 h-8 rounded"
        />
      </div>
    </div>
  );

  const renderInsights = () => (
    <div className="glass-card p-6 rounded-2xl">
      <motion.div
        style={shimmerAnimation}
        className="w-32 h-6 rounded mb-4"
      />
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex items-center space-x-3">
            <motion.div
              style={shimmerAnimation}
              className="w-8 h-8 rounded-full"
            />
            <div className="flex-1 space-y-2">
              <motion.div
                style={shimmerAnimation}
                className="w-full h-4 rounded"
              />
              <motion.div
                style={shimmerAnimation}
                className="w-3/4 h-3 rounded"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderContent = () => {
    switch (type) {
      case 'weather-card':
        return renderWeatherCard();
      case 'forecast-item':
        return renderForecastItem();
      case 'hero':
        return renderHero();
      case 'map':
        return renderMap();
      case 'insights':
        return renderInsights();
      default:
        return renderWeatherCard();
    }
  };

  return (
    <div className={className}>
      <style>
        {`
          @keyframes shimmer {
            0% {
              background-position: -200% 0;
            }
            100% {
              background-position: 200% 0;
            }
          }
        `}
      </style>
      {renderContent()}
    </div>
  );
};

// Specialized skeleton components for different use cases
export const WeatherCardSkeleton: React.FC<{ className?: string }> = ({ className }) => (
  <LoadingSkeleton type="weather-card" className={className} />
);

export const ForecastSkeleton: React.FC<{ className?: string }> = ({ className }) => (
  <div className={`grid grid-cols-2 md:grid-cols-5 gap-4 ${className}`}>
    {[1, 2, 3, 4, 5].map((i) => (
      <LoadingSkeleton key={i} type="forecast-item" />
    ))}
  </div>
);

export const HeroSkeleton: React.FC<{ className?: string }> = ({ className }) => (
  <LoadingSkeleton type="hero" className={className} />
);

export const MapSkeleton: React.FC<{ className?: string }> = ({ className }) => (
  <LoadingSkeleton type="map" className={className} />
);

export const InsightsSkeleton: React.FC<{ className?: string }> = ({ className }) => (
  <LoadingSkeleton type="insights" className={className} />
);

export default LoadingSkeleton; 