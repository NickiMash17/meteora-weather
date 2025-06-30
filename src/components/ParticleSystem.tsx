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
      canvas: HTMLCanvasElement | null;
      ctx: CanvasRenderingContext2D | null;

      constructor(x: number, y: number, type: string, canvas: HTMLCanvasElement | null, ctx: CanvasRenderingContext2D | null) {
        this.x = x;
        this.y = y;
        this.type = type;
        this.canvas = canvas;
        this.ctx = ctx;
        
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
        if (!this.canvas) return;
        this.x += this.vx;
        this.y += this.vy;

        // Wrap around edges
        if (this.x < 0) this.x = this.canvas.width;
        if (this.x > this.canvas.width) this.x = 0;
        if (this.y < 0) this.y = this.canvas.height;
        if (this.y > this.canvas.height) this.y = 0;

        // Fade out for rain and snow
        if (this.type === 'rain' || this.type === 'snow') {
          this.opacity -= 0.005;
          if (this.opacity <= 0) {
            this.opacity = Math.random() * 0.6 + 0.4;
            this.y = -10;
            this.x = Math.random() * this.canvas.width;
          }
        }
      }

      draw() {
        if (!this.ctx) return;
        this.ctx.save();
        this.ctx.globalAlpha = this.opacity;
        this.ctx.fillStyle = this.color;

        switch (this.type) {
          case 'rain':
            this.ctx.fillRect(this.x, this.y, 1, this.size * 3);
            break;
          case 'snow':
            this.ctx.beginPath();
            this.ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            this.ctx.fill();
            break;
          case 'dust':
            this.ctx.beginPath();
            this.ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            this.ctx.fill();
            break;
          case 'sparkle':
            this.ctx.beginPath();
            this.ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            this.ctx.fill();
            // Add sparkle effect
            this.ctx.strokeStyle = this.color;
            this.ctx.lineWidth = 1;
            this.ctx.beginPath();
            this.ctx.moveTo(this.x - this.size * 2, this.y);
            this.ctx.lineTo(this.x + this.size * 2, this.y);
            this.ctx.moveTo(this.x, this.y - this.size * 2);
            this.ctx.lineTo(this.x, this.y + this.size * 2);
            this.ctx.stroke();
            break;
          default:
            this.ctx.beginPath();
            this.ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            this.ctx.fill();
        }
        this.ctx.restore();
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
          'rain',
          canvas,
          ctx
        ));
      }
    } else if (condition.includes('snow')) {
      for (let i = 0; i < 50; i++) {
        particles.push(new Particle(
          Math.random() * canvas.width,
          Math.random() * canvas.height,
          'snow',
          canvas,
          ctx
        ));
      }
    } else if (condition.includes('clear') && isDaytime) {
      for (let i = 0; i < 30; i++) {
        particles.push(new Particle(
          Math.random() * canvas.width,
          Math.random() * canvas.height,
          'sparkle',
          canvas,
          ctx
        ));
      }
    }

    // Add ambient particles
    for (let i = 0; i < 20; i++) {
      particles.push(new Particle(
        Math.random() * canvas.width,
        Math.random() * canvas.height,
        'dust',
        canvas,
        ctx
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