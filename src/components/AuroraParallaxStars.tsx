import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';

// Number of stars and layers
const STAR_LAYERS = [
  { count: 30, speed: 0.1, size: 1.5, opacity: 0.5 },
  { count: 20, speed: 0.2, size: 2.5, opacity: 0.7 },
  { count: 10, speed: 0.4, size: 3.5, opacity: 1 },
];

const METEOR_INTERVAL = 12000; // ms

const random = (min: number, max: number) => Math.random() * (max - min) + min;

const AuroraParallaxStars: React.FC = () => {
  const [meteors, setMeteors] = useState<{ id: number; left: number; top: number; delay: number }[]>([]);
  const [parallax, setParallax] = useState({ x: 0, y: 0 });
  const [shootingStar, setShootingStar] = useState<{ key: number; top: number } | null>(null);
  const meteorId = useRef(0);
  const shootingStarId = useRef(0);

  // Parallax effect
  useEffect(() => {
    const handleMove = (e: MouseEvent | TouchEvent) => {
      let x = 0, y = 0;
      if ('touches' in e && e.touches.length > 0) {
        x = e.touches[0].clientX / window.innerWidth - 0.5;
        y = e.touches[0].clientY / window.innerHeight - 0.5;
      } else if ('clientX' in e) {
        x = e.clientX / window.innerWidth - 0.5;
        y = e.clientY / window.innerHeight - 0.5;
      }
      setParallax({ x, y });
    };
    window.addEventListener('mousemove', handleMove);
    window.addEventListener('touchmove', handleMove);
    return () => {
      window.removeEventListener('mousemove', handleMove);
      window.removeEventListener('touchmove', handleMove);
    };
  }, []);

  // Shooting star easter egg
  useEffect(() => {
    const handleDouble = () => {
      if (!shootingStar) {
        setShootingStar({ key: shootingStarId.current++, top: Math.random() * 60 + 10 });
      }
    };
    window.addEventListener('dblclick', handleDouble);
    const handleTouch = (e: TouchEvent) => {
      if (e.detail === 2 && !shootingStar) {
        setShootingStar({ key: shootingStarId.current++, top: Math.random() * 60 + 10 });
      }
    };
    window.addEventListener('touchend', handleTouch);
    return () => {
      window.removeEventListener('dblclick', handleDouble);
      window.removeEventListener('touchend', handleTouch);
    };
  }, [shootingStar]);

  // Remove shooting star after animation
  useEffect(() => {
    if (shootingStar) {
      const timeout = setTimeout(() => setShootingStar(null), 1200);
      return () => clearTimeout(timeout);
    }
  }, [shootingStar]);

  // Meteor showers
  useEffect(() => {
    const interval = setInterval(() => {
      setMeteors((prev) => [
        ...prev,
        {
          id: meteorId.current++,
          left: random(10, 90),
          top: random(0, 40),
          delay: random(0, 2),
        },
      ]);
    }, METEOR_INTERVAL + random(-3000, 3000));
    return () => clearInterval(interval);
  }, []);

  // Remove meteors after animation
  useEffect(() => {
    if (meteors.length === 0) return;
    const timeout = setTimeout(() => {
      setMeteors((prev) => prev.slice(1));
    }, 3000);
    return () => clearTimeout(timeout);
  }, [meteors]);

  return (
    <div className="absolute inset-0 w-full h-full pointer-events-none z-0">
      {/* Aurora layers */}
      <motion.div
        className="absolute w-[200vw] h-[200vh] top-[-50vh] left-[-50vw]"
        style={{ filter: 'blur(60px)' }}
        animate={{
          rotate: [0, 8, -4, 0],
          scale: [1, 1.1, 1, 1.05, 1],
        }}
        transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
      >
        {/* Aurora gradients */}
        <div
          className="absolute w-full h-full"
          style={{
            background:
              'radial-gradient(ellipse at 30% 40%, rgba(102,126,234,0.18) 0%, transparent 60%),' +
              'radial-gradient(ellipse at 70% 60%, rgba(252,92,125,0.14) 0%, transparent 60%),' +
              'radial-gradient(ellipse at 60% 20%, rgba(255,255,255,0.08) 0%, transparent 70%)',
          }}
        />
        <motion.div
          className="absolute w-full h-full"
          style={{
            background:
              'radial-gradient(ellipse at 60% 80%, rgba(84,160,255,0.18) 0%, transparent 60%),' +
              'radial-gradient(ellipse at 20% 20%, rgba(255,107,107,0.12) 0%, transparent 60%)',
          }}
          animate={{ rotate: [0, 360] }}
          transition={{ duration: 40, repeat: Infinity, ease: 'linear' }}
        />
      </motion.div>

      {/* Parallax Stars */}
      {STAR_LAYERS.map((layer, lidx) => (
        <div key={lidx} className="absolute inset-0 w-full h-full">
          {Array.from({ length: layer.count }).map((_, i) => {
            const left = random(0, 100);
            const top = random(0, 100);
            return (
              <motion.div
                key={i}
                className="absolute rounded-full"
                style={{
                  width: layer.size + 'px',
                  height: layer.size + 'px',
                  left: `calc(${left}% + ${parallax.x * 40 * layer.speed}px)` ,
                  top: `calc(${top}% + ${parallax.y * 40 * layer.speed}px)` ,
                  background: 'radial-gradient(circle, #fff 0%, #f0f8ff 100%)',
                  opacity: layer.opacity,
                  boxShadow: '0 0 10px rgba(255,255,255,0.7)',
                }}
                animate={{ opacity: [layer.opacity * 0.7, layer.opacity, layer.opacity * 0.7] }}
                transition={{ duration: 2 + Math.random() * 2, repeat: Infinity, repeatType: 'mirror' }}
              />
            );
          })}
        </div>
      ))}

      {/* Meteor Showers */}
      {meteors.map((meteor) => (
        <motion.div
          key={meteor.id}
          className="absolute w-0.5 h-32 bg-gradient-to-tr from-white via-blue-300 to-transparent rounded-full shadow-lg"
          style={{
            left: `${meteor.left}%`,
            top: `${meteor.top}%`,
            opacity: 0.8,
            zIndex: 10,
          }}
          initial={{ x: 0, y: 0, opacity: 0 }}
          animate={{ x: 200, y: 200, opacity: [0, 1, 0] }}
          transition={{ duration: 2.2, delay: meteor.delay, ease: 'easeIn' }}
        />
      ))}

      {/* Shooting Star Easter Egg */}
      {shootingStar && (
        <motion.div
          key={shootingStar.key}
          initial={{ x: '-10vw', y: 0, opacity: 0 }}
          animate={{ x: '110vw', y: 0, opacity: [0, 1, 1, 0] }}
          transition={{ duration: 1.1, ease: 'easeInOut' }}
          style={{
            position: 'absolute',
            top: `${shootingStar.top}%`,
            left: 0,
            width: '120px',
            height: '6px',
            pointerEvents: 'none',
            zIndex: 100,
          }}
        >
          <svg width="120" height="6" viewBox="0 0 120 6" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="0" y="2" width="100" height="2" rx="1" fill="url(#starTrail)" />
            <circle cx="110" cy="3" r="3" fill="#fff" filter="url(#glow)" />
            <defs>
              <linearGradient id="starTrail" x1="0" y1="3" x2="120" y2="3" gradientUnits="userSpaceOnUse">
                <stop stopColor="#fff" stopOpacity="0.7" />
                <stop offset="0.7" stopColor="#fff" stopOpacity="0.2" />
                <stop offset="1" stopColor="#fff" stopOpacity="0" />
              </linearGradient>
              <filter id="glow" x="-10" y="-10" width="26" height="26" filterUnits="userSpaceOnUse">
                <feGaussianBlur stdDeviation="4" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>
          </svg>
        </motion.div>
      )}
    </div>
  );
};

export default AuroraParallaxStars; 