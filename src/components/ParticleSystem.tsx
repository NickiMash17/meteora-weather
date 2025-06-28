import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

interface ParticleSystemProps {
  weather: any;
  theme: 'light' | 'dark';
}

const ParticleSystem: React.FC<ParticleSystemProps> = ({ weather, theme }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Particle class
    class Particle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      opacity: number;
      color: string;
      type: string;

      constructor(x: number, y: number, type: string) {
        this.x = x;
        this.y = y;
        this.type = type;
        
        switch (type) {
          case 'rain':
            this.vx = (Math.random() - 0.5) * 2;
            this.vy = Math.random() * 3 + 2;
            this.size = Math.random() * 2 + 1;
            this.opacity = Math.random() * 0.6 + 0.4;
            this.color = theme === 'dark' ? '#60a5fa' : '#3b82f6';
            break;
          case 'snow':
            this.vx = (Math.random() - 0.5) * 1;
            this.vy = Math.random() * 1 + 0.5;
            this.size = Math.random() * 3 + 2;
            this.opacity = Math.random() * 0.8 + 0.2;
            this.color = '#ffffff';
            break;
          case 'dust':
            this.vx = (Math.random() - 0.5) * 0.5;
            this.vy = (Math.random() - 0.5) * 0.5;
            this.size = Math.random() * 1 + 0.5;
            this.opacity = Math.random() * 0.3 + 0.1;
            this.color = theme === 'dark' ? '#fbbf24' : '#f59e0b';
            break;
          case 'sparkle':
            this.vx = (Math.random() - 0.5) * 0.3;
            this.vy = (Math.random() - 0.5) * 0.3;
            this.size = Math.random() * 2 + 1;
            this.opacity = Math.random() * 0.6 + 0.4;
            this.color = '#fbbf24';
            break;
          default:
            this.vx = (Math.random() - 0.5) * 1;
            this.vy = (Math.random() - 0.5) * 1;
            this.size = Math.random() * 2 + 1;
            this.opacity = Math.random() * 0.5 + 0.3;
            this.color = '#ffffff';
        }
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;

        // Wrap around edges
        if (this.x < 0) this.x = canvas.width;
        if (this.x > canvas.width) this.x = 0;
        if (this.y < 0) this.y = canvas.height;
        if (this.y > canvas.height) this.y = 0;

        // Fade out for rain and snow
        if (this.type === 'rain' || this.type === 'snow') {
          this.opacity -= 0.005;
          if (this.opacity <= 0) {
            this.opacity = Math.random() * 0.6 + 0.4;
            this.y = -10;
            this.x = Math.random() * canvas.width;
          }
        }
      }

      draw() {
        ctx.save();
        ctx.globalAlpha = this.opacity;
        ctx.fillStyle = this.color;

        switch (this.type) {
          case 'rain':
            ctx.fillRect(this.x, this.y, 1, this.size * 3);
            break;
          case 'snow':
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
            break;
          case 'dust':
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
            break;
          case 'sparkle':
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
            // Add sparkle effect
            ctx.strokeStyle = this.color;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(this.x - this.size * 2, this.y);
            ctx.lineTo(this.x + this.size * 2, this.y);
            ctx.moveTo(this.x, this.y - this.size * 2);
            ctx.lineTo(this.x, this.y + this.size * 2);
            ctx.stroke();
            break;
          default:
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
        }
        ctx.restore();
      }
    }

    // Create particles based on weather
    const particles: Particle[] = [];
    const condition = weather?.condition?.main?.toLowerCase() || 'clear';
    const hour = new Date().getHours();
    const isDaytime = hour >= 6 && hour < 18;

    // Add weather-specific particles
    if (condition.includes('rain')) {
      for (let i = 0; i < 100; i++) {
        particles.push(new Particle(
          Math.random() * canvas.width,
          Math.random() * canvas.height,
          'rain'
        ));
      }
    } else if (condition.includes('snow')) {
      for (let i = 0; i < 50; i++) {
        particles.push(new Particle(
          Math.random() * canvas.width,
          Math.random() * canvas.height,
          'snow'
        ));
      }
    } else if (condition.includes('clear') && isDaytime) {
      for (let i = 0; i < 30; i++) {
        particles.push(new Particle(
          Math.random() * canvas.width,
          Math.random() * canvas.height,
          'sparkle'
        ));
      }
    }

    // Add ambient particles
    for (let i = 0; i < 20; i++) {
      particles.push(new Particle(
        Math.random() * canvas.width,
        Math.random() * canvas.height,
        'dust'
      ));
    }

    // Animation loop
    let animationId: number;
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Update and draw particles
      particles.forEach(particle => {
        particle.update();
        particle.draw();
      });

      animationId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationId);
    };
  }, [weather, theme]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{ opacity: 0.6 }}
    />
  );
};

export default ParticleSystem; 