'use client';

import { useEffect, useRef, useCallback } from 'react';
import { cn } from '@/lib/utils';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  opacity: number;
  hue: number;
  life: number;
  maxLife: number;
}

interface ParticleFieldProps {
  className?: string;
  particleCount?: number;
  color?: string | 'rainbow';
  baseHue?: number;
  minSize?: number;
  maxSize?: number;
  speed?: number;
  connectDistance?: number;
  showConnections?: boolean;
  mouseInteraction?: boolean;
  mouseRadius?: number;
  mouseForce?: number;
  fadeEdges?: boolean;
  respawn?: boolean;
  fps?: number;
}

export function ParticleField({
  className,
  particleCount = 60,
  color,
  baseHue = 160, // Emerald
  minSize = 1,
  maxSize = 3,
  speed = 0.3,
  connectDistance = 100,
  showConnections = true,
  mouseInteraction = true,
  mouseRadius = 150,
  mouseForce = 0.02,
  fadeEdges = true,
  respawn = true,
  fps = 60,
}: ParticleFieldProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const mouseRef = useRef({ x: -1000, y: -1000, active: false });
  const dimensionsRef = useRef({ width: 0, height: 0 });
  const frameRef = useRef<number>(0);
  const lastTimeRef = useRef<number>(0);

  // Create a single particle
  const createParticle = useCallback(
    (width: number, height: number, x?: number, y?: number): Particle => ({
      x: x ?? Math.random() * width,
      y: y ?? Math.random() * height,
      vx: (Math.random() - 0.5) * speed * 2,
      vy: (Math.random() - 0.5) * speed * 2,
      size: Math.random() * (maxSize - minSize) + minSize,
      opacity: Math.random() * 0.5 + 0.3,
      hue: color === 'rainbow' ? Math.random() * 360 : baseHue + (Math.random() - 0.5) * 30,
      life: 0,
      maxLife: respawn ? Math.random() * 500 + 200 : Infinity,
    }),
    [speed, minSize, maxSize, color, baseHue, respawn]
  );

  // Initialize particles
  const initParticles = useCallback(() => {
    const { width, height } = dimensionsRef.current;
    particlesRef.current = Array.from({ length: particleCount }, () =>
      createParticle(width, height)
    );
  }, [particleCount, createParticle]);

  // Main animation loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    // Setup resize observer
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect;
        canvas.width = width * window.devicePixelRatio;
        canvas.height = height * window.devicePixelRatio;
        canvas.style.width = `${width}px`;
        canvas.style.height = `${height}px`;
        ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
        dimensionsRef.current = { width, height };
        initParticles();
      }
    });

    resizeObserver.observe(canvas.parentElement || canvas);

    // Mouse handlers
    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
        active: true,
      };
    };

    const handleMouseLeave = () => {
      mouseRef.current.active = false;
    };

    if (mouseInteraction) {
      canvas.addEventListener('mousemove', handleMouseMove);
      canvas.addEventListener('mouseleave', handleMouseLeave);
    }

    // Animation frame
    const fpsInterval = 1000 / fps;

    const animate = (timestamp: number) => {
      frameRef.current = requestAnimationFrame(animate);

      // FPS throttling
      const elapsed = timestamp - lastTimeRef.current;
      if (elapsed < fpsInterval) return;
      lastTimeRef.current = timestamp - (elapsed % fpsInterval);

      const { width, height } = dimensionsRef.current;
      if (width === 0 || height === 0) return;

      ctx.clearRect(0, 0, width, height);

      const particles = particlesRef.current;
      const mouse = mouseRef.current;

      // Update and draw particles
      particles.forEach((p, i) => {
        // Life cycle
        p.life++;
        if (respawn && p.life > p.maxLife) {
          const newP = createParticle(width, height);
          particles[i] = newP;
          return;
        }

        // Mouse interaction
        if (mouseInteraction && mouse.active) {
          const dx = mouse.x - p.x;
          const dy = mouse.y - p.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < mouseRadius) {
            const force = (mouseRadius - dist) / mouseRadius;
            p.vx -= dx * force * mouseForce;
            p.vy -= dy * force * mouseForce;
          }
        }

        // Update position
        p.x += p.vx;
        p.y += p.vy;

        // Soft boundary bounce with damping
        if (p.x < 0 || p.x > width) {
          p.vx *= -0.8;
          p.x = Math.max(0, Math.min(width, p.x));
        }
        if (p.y < 0 || p.y > height) {
          p.vy *= -0.8;
          p.y = Math.max(0, Math.min(height, p.y));
        }

        // Apply friction
        p.vx *= 0.99;
        p.vy *= 0.99;

        // Edge fade
        let opacity = p.opacity;
        if (fadeEdges) {
          const edgeX = Math.min(p.x, width - p.x) / 50;
          const edgeY = Math.min(p.y, height - p.y) / 50;
          const edgeFade = Math.min(1, Math.min(edgeX, edgeY));
          opacity *= edgeFade;
        }

        // Draw particle
        const particleColor = color && color !== 'rainbow' ? color : `hsl(${p.hue}, 70%, 60%)`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = particleColor;
        ctx.globalAlpha = opacity;
        ctx.fill();

        // Draw connections
        if (showConnections) {
          particles.slice(i + 1).forEach((other) => {
            const dx = p.x - other.x;
            const dy = p.y - other.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < connectDistance) {
              const lineOpacity = ((connectDistance - dist) / connectDistance) * 0.15 * opacity;
              ctx.beginPath();
              ctx.moveTo(p.x, p.y);
              ctx.lineTo(other.x, other.y);
              ctx.strokeStyle = particleColor;
              ctx.globalAlpha = lineOpacity;
              ctx.lineWidth = 0.5;
              ctx.stroke();
            }
          });
        }
      });

      ctx.globalAlpha = 1;
    };

    frameRef.current = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(frameRef.current);
      resizeObserver.disconnect();
      if (mouseInteraction) {
        canvas.removeEventListener('mousemove', handleMouseMove);
        canvas.removeEventListener('mouseleave', handleMouseLeave);
      }
    };
  }, [
    initParticles,
    createParticle,
    color,
    showConnections,
    connectDistance,
    mouseInteraction,
    mouseRadius,
    mouseForce,
    fadeEdges,
    respawn,
    fps,
  ]);

  return (
    <canvas
      ref={canvasRef}
      className={cn('pointer-events-auto absolute inset-0', className)}
    />
  );
}

// Preset: Subtle ambient particles
export function AmbientParticles({ className }: { className?: string }) {
  return (
    <ParticleField
      className={className}
      particleCount={40}
      speed={0.2}
      minSize={1}
      maxSize={2}
      connectDistance={80}
      mouseInteraction={false}
      fadeEdges={true}
    />
  );
}

// Preset: Interactive hero particles
export function HeroParticles({ className }: { className?: string }) {
  return (
    <ParticleField
      className={className}
      particleCount={80}
      speed={0.4}
      minSize={1}
      maxSize={4}
      connectDistance={120}
      mouseInteraction={true}
      mouseRadius={200}
      mouseForce={0.03}
    />
  );
}

// Preset: Starfield
export function Starfield({ className }: { className?: string }) {
  return (
    <ParticleField
      className={className}
      particleCount={100}
      color="#ffffff"
      speed={0.1}
      minSize={0.5}
      maxSize={2}
      showConnections={false}
      mouseInteraction={false}
      fadeEdges={false}
    />
  );
}

// Preset: Rainbow particles
export function RainbowParticles({ className }: { className?: string }) {
  return (
    <ParticleField
      className={className}
      particleCount={60}
      color="rainbow"
      speed={0.3}
      connectDistance={100}
      mouseInteraction={true}
    />
  );
}
