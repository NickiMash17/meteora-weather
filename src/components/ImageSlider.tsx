import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Image as ImageIcon } from 'lucide-react';

const images = [
  {
    url: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80',
    caption: 'Misty Forest Morning',
  },
  {
    url: 'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=800&q=80',
    caption: 'Cityscape at Dusk',
  },
  {
    url: 'https://images.unsplash.com/photo-1502082553048-f009c37129b9?auto=format&fit=crop&w=800&q=80',
    caption: 'Mountain Storm',
  },
  {
    url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80',
    caption: 'Sunset Over the Lake',
  },
  {
    url: 'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=800&q=80',
    caption: 'Urban Rainy Night',
  },
  {
    url: 'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=800&q=80',
    caption: 'Snowy Pines',
  },
];

const ImageSlider: React.FC = () => {
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  const next = () => {
    setDirection(1);
    setIndex((prev) => (prev + 1) % images.length);
  };
  const prev = () => {
    setDirection(-1);
    setIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  if (images.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card rounded-2xl p-8 flex flex-col items-center justify-center text-center border border-pink-400/20 bg-pink-400/5 mt-4"
      >
        <motion.div
          initial={{ scale: 0.8, rotate: -10 }}
          animate={{ scale: [0.8, 1.1, 1], rotate: [0, 10, -10, 0] }}
          transition={{ duration: 2, repeat: Infinity, repeatType: 'mirror' }}
          className="mb-4"
        >
          <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="12" y="20" width="40" height="28" rx="6" fill="#fbbf24" />
            <circle cx="32" cy="34" r="8" fill="#60a5fa" />
            <rect x="24" y="16" width="16" height="8" rx="2" fill="#a78bfa" />
            <circle cx="32" cy="34" r="3" fill="#fff" />
          </svg>
        </motion.div>
        <h3 className="text-2xl font-bold text-pink-400 mb-2">No Gallery Images</h3>
        <p className="text-white/80 text-lg mb-2">No images to display yet. Add some beautiful weather moments soon! 📸</p>
      </motion.div>
    );
  }

  return (
    <div className="relative w-full max-w-2xl mx-auto glass-card rounded-2xl overflow-hidden p-0">
      <div className="relative h-72 sm:h-96 flex items-center justify-center bg-black/20">
        <AnimatePresence initial={false} custom={direction}>
          <motion.img
            key={images[index].url}
            src={images[index].url}
            alt={images[index].caption}
            className="absolute w-full h-full object-cover object-center"
            initial={{ x: direction > 0 ? 300 : -300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: direction > 0 ? -300 : 300, opacity: 0 }}
            transition={{ duration: 0.5, ease: 'easeInOut' }}
            draggable={false}
          />
        </AnimatePresence>
        {/* Overlay for glass effect */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent z-10" />
        {/* Image icon fallback */}
        {!images[index].url && (
          <div className="flex items-center justify-center w-full h-full">
            <ImageIcon className="w-16 h-16 text-white/40" />
          </div>
        )}
        {/* Navigation Buttons */}
        <button
          onClick={prev}
          className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white rounded-full p-2 z-20 focus:outline-none"
          aria-label="Previous image"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <button
          onClick={next}
          className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white rounded-full p-2 z-20 focus:outline-none"
          aria-label="Next image"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>
      {/* Caption and Dots */}
      <div className="relative z-20 p-4 flex flex-col items-center bg-white/10 backdrop-blur-md">
        <div className="text-white text-lg font-semibold mb-2 text-center drop-shadow">
          {images[index].caption}
        </div>
        <div className="flex space-x-2 mt-2">
          {images.map((_, i) => (
            <button
              key={i}
              onClick={() => { setDirection(i > index ? 1 : -1); setIndex(i); }}
              className={`w-3 h-3 rounded-full transition-all duration-200 ${i === index ? 'bg-blue-400' : 'bg-white/30'}`}
              aria-label={`Go to image ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ImageSlider; 