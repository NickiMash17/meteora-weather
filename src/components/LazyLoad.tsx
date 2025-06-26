import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface LazyLoadProps {
  children: React.ReactNode;
  threshold?: number;
  fallback?: React.ReactNode;
  className?: string;
}

const LazyLoad: React.FC<LazyLoadProps> = ({ 
  children, 
  threshold = 0.1, 
  fallback,
  className = "" 
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [hasLoaded, setHasLoaded] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          // Simulate loading delay for better UX
          setTimeout(() => setHasLoaded(true), 100);
        }
      },
      { threshold }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, [threshold]);

  return (
    <div ref={ref} className={className}>
      <AnimatePresence mode="wait">
        {!hasLoaded && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex items-center justify-center py-8"
          >
            {fallback || (
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-white/60 rounded-full animate-bounce" />
                <div className="w-2 h-2 bg-white/60 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                <div className="w-2 h-2 bg-white/60 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
      
      <AnimatePresence>
        {hasLoaded && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default LazyLoad; 