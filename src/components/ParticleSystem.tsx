import React, { useEffect, useRef } from 'react';

interface ParticleSystemProps {
  weather: any;
}

const ParticleSystem: React.FC<ParticleSystemProps> = ({ weather }) => {
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
          case 'sparkle':
            this.vx = (Math.random() - 0.5) * 0.5;
            this.vy = (Math.random() - 0.5) * 0.5;
            this.size = Math.random() * 3 + 1;
            this.opacity = Math.random() * 0.5 + 0.5;
            this.color = '#ffffff';
            break;
          case 'dust':
            this.vx = (Math.random() - 0.5) * 0.3;
            this.vy = Math.random() * 0.2 + 0.1;
            this.size = Math.random() * 2 + 0.5;
            this.opacity = Math.random() * 0.3 + 0.1;
            this.color = '#ffffff';
            break;
          case 'energy':
            this.vx = (Math.random() - 0.5) * 1;
            this.vy = (Math.random() - 0.5) * 1;
            this.size = Math.random() * 4 + 2;
            this.opacity = Math.random() * 0.7 + 0.3;
            this.color = weather?.condition.main === 'Clear' ? '#ffd700' : '#4cc9f0';
            break;
          default:
            this.vx = (Math.random() - 0.5) * 0.5;
            this.vy = (Math.random() - 0.5) * 0.5;
            this.size = Math.random() * 2 + 1;
            this.opacity = Math.random() * 0.5 + 0.3;
            this.color = '#ffffff';
        }
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;
        this.opacity *= 0.995;

        // Wrap around screen
        if (canvas && this.x < 0) this.x = canvas.width;
        if (canvas && this.x > canvas.width) this.x = 0;
        if (canvas && this.y < 0) this.y = canvas.height;
        if (canvas && this.y > canvas.height) this.y = 0;
      }

      draw() {
        if (!ctx) return;
        
        ctx.save();
        ctx.globalAlpha = this.opacity;
        ctx.fillStyle = this.color;
        
        if (this.type === 'sparkle') {
          ctx.shadowBlur = 10;
          ctx.shadowColor = this.color;
          ctx.beginPath();
          ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
          ctx.fill();
        } else if (this.type === 'energy') {
          ctx.shadowBlur = 15;
          ctx.shadowColor = this.color;
          ctx.beginPath();
          ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
          ctx.fill();
        } else {
          ctx.beginPath();
          ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
          ctx.fill();
        }
        
        ctx.restore();
      }
    }

    // Create particles
    const particles: Particle[] = [];
    const maxParticles = 100;

    const createParticle = () => {
      if (particles.length < maxParticles) {
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height;
        const types = ['sparkle', 'dust', 'energy'];
        const type = types[Math.floor(Math.random() * types.length)];
        particles.push(new Particle(x, y, type));
      }
    };

    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Create new particles
      if (Math.random() < 0.1) {
        createParticle();
      }

      // Update and draw particles
      for (let i = particles.length - 1; i >= 0; i--) {
        const particle = particles[i];
        particle.update();
        particle.draw();

        // Remove dead particles
        if (particle.opacity < 0.01) {
          particles.splice(i, 1);
        }
      }

      requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
    };
  }, [weather]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{ opacity: 0.6 }}
    />
  );
};

export default ParticleSystem; 