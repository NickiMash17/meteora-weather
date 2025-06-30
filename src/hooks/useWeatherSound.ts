import { useEffect, useRef, useState } from 'react';

// Map weather conditions to sound file names
const weatherSounds: Record<string, string> = {
  clear: 'birds.mp3',
  clouds: 'wind.mp3',
  rain: 'rain.mp3',
  drizzle: 'rain.mp3',
  thunderstorm: 'thunder.mp3',
  snow: 'snow.mp3',
  default: 'calm.mp3',
};

export default function useWeatherSound(condition: string) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentSound, setCurrentSound] = useState<string>('');
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Load mute preference from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('meteora-sound-muted');
    setIsPlaying(saved !== 'true');
  }, []);

  // Play/pause sound when condition or isPlaying changes
  useEffect(() => {
    const file = weatherSounds[condition?.toLowerCase?.()] || weatherSounds.default;
    setCurrentSound(file);
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    if (isPlaying && file) {
      const audio = new Audio(`/sounds/${file}`);
      audio.loop = true;
      audio.volume = 0.25;
      audioRef.current = audio;
      audio.play();
    }
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
     
  }, [condition, isPlaying]);

  // Toggle sound on/off
  const toggle = () => {
    setIsPlaying((prev) => {
      localStorage.setItem('meteora-sound-muted', (!prev).toString());
      return !prev;
    });
  };

  return { isPlaying, toggle, currentSound };
} 