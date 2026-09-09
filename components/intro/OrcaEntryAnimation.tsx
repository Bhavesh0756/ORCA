'use client';

import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';

interface OrcaEntryAnimationProps {
  onComplete: () => void;
}

export default function OrcaEntryAnimation({ onComplete }: OrcaEntryAnimationProps) {
  const [phase, setPhase] = useState<'init' | 'scan' | 'detect' | 'brand' | 'online' | 'exit'>('init');
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) {
      onComplete();
      return;
    }

    let isMounted = true;
    let frameId: number;
    let startTime: number | null = null;
    
    // Duration mapping for exact cinematic pacing
    // 0-2000: Initial deep ocean
    // 2000-4500: Sonar scan & topography
    // 4500-7500: Whale (ORCA) detection
    // 6500-9000: Brand reveal
    // 8500-10000: System Online
    // 10000-11500: Exit & Transition
    const DURATION = 11500;

    // Timeline driver
    const tick = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      
      if (elapsed > 2000 && elapsed <= 4500) setPhase(p => p !== 'scan' ? 'scan' : p);
      if (elapsed > 4500 && elapsed <= 6500) setPhase(p => p !== 'detect' ? 'detect' : p);
      if (elapsed > 6500 && elapsed <= 8500) setPhase(p => p !== 'brand' ? 'brand' : p);
      if (elapsed > 8500 && elapsed <= 10000) setPhase(p => p !== 'online' ? 'online' : p);
      if (elapsed > 10000 && elapsed <= DURATION) setPhase(p => p !== 'exit' ? 'exit' : p);
      
      if (elapsed >= DURATION) {
        if (isMounted) onComplete();
        return;
      }
      frameId = requestAnimationFrame(tick);
    };
    frameId = requestAnimationFrame(tick);

    // --- CANVAS PARTICLES & SONAR GRID ---
    const cvs = canvasRef.current;
    if (!cvs) return;
    const ctx = cvs.getContext('2d', { alpha: false });
    if (!ctx) return;
    
    let w = window.innerWidth;
    let h = window.innerHeight;
    cvs.width = w;
    cvs.height = h;

    const particles = Array.from({ length: 150 }).map(() => ({
      x: Math.random() * w,
      y: Math.random() * h,
      size: Math.random() * 2 + 0.5,
      speedY: Math.random() * 0.4 + 0.1,
      speedX: (Math.random() - 0.5) * 0.2,
      opacity: Math.random() * 0.5 + 0.1
    }));

    const drawCanvas = (time: number) => {
      if (!isMounted) return;
      
      // Clear with deep ocean color
      ctx.fillStyle = '#010811';
      ctx.fillRect(0, 0, w, h);

      // Draw subtle topographic grid during scan/detect phases
      const t = time - (startTime || time);
      if (t > 2000 && t < 10500) {
        const gridAlpha = t < 3000 ? (t - 2000) / 1000 : t > 9500 ? 1 - (t - 9500) / 1000 : 1;
        ctx.strokeStyle = `rgba(24, 213, 208, ${0.03 * gridAlpha})`;
        ctx.lineWidth = 1;
        
        // Perspective grid lines
        const focalY = h * 0.3;
        const spacing = 40;
        ctx.beginPath();
        for (let x = -w; x < w * 2; x += spacing) {
          ctx.moveTo(x, h);
          ctx.lineTo(w / 2 + (x - w / 2) * 0.1, focalY);
        }
        for (let y = h; y > focalY; y -= Math.pow((h - y) / h + 0.1, 2) * 100) {
          ctx.moveTo(0, y);
          ctx.lineTo(w, y);
        }
        ctx.stroke();

        // Sonar sweep line
        if (t > 2000 && t < 4500) {
          const sweepY = focalY + ((t - 2000) / 2500) * (h - focalY);
          ctx.fillStyle = `rgba(24, 213, 208, ${0.2 * gridAlpha})`;
          ctx.fillRect(0, sweepY, w, 2);
          ctx.fillStyle = `rgba(24, 213, 208, ${0.05 * gridAlpha})`;
          ctx.fillRect(0, sweepY - 50, w, 50);
        }
      }

      // Draw particles
      particles.forEach(p => {
        p.y -= p.speedY;
        p.x += p.speedX;
        if (p.y < 0) {
          p.y = h;
          p.x = Math.random() * w;
        }
        
        // Parallax effect as phase progresses
        const drift = t > 4000 ? (t - 4000) * 0.0005 * p.size : 0;
        
        ctx.beginPath();
        ctx.arc(p.x - drift, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(180, 230, 255, ${p.opacity * (t > 10000 ? 1 - (t - 10000) / 1000 : 1)})`;
        ctx.fill();
      });
      
      requestAnimationFrame(drawCanvas);
    };
    requestAnimationFrame(drawCanvas);

    const handleResize = () => {
      w = window.innerWidth;
      h = window.innerHeight;
      if (cvs) {
        cvs.width = w;
        cvs.height = h;
      }
    };
    window.addEventListener('resize', handleResize);

    return () => {
      isMounted = false;
      cancelAnimationFrame(frameId);
      window.removeEventListener('resize', handleResize);
    };
  }, [onComplete]);

  // CSS classes mapped by timeline phase
  const isExit = phase === 'exit';
  const showScan = phase === 'scan' || phase === 'detect' || phase === 'brand' || phase === 'online';
  const showDetect = phase === 'detect' || phase === 'brand' || phase === 'online';
  const showBrand = phase === 'brand' || phase === 'online';
  const showOnline = phase === 'online';

  return (
    <div
      className="fixed inset-0 z-[9999] overflow-hidden bg-[#010811] text-orca-text select-none"
      style={{
        opacity: isExit ? 0 : 1,
        transition: 'opacity 1500ms cubic-bezier(0.4, 0, 0.2, 1)',
        pointerEvents: isExit ? 'none' : 'auto'
      }}
    >
      {/* 1. BACKGROUND CANVAS */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        style={{ filter: 'contrast(1.1) brightness(0.9)' }}
      />

      {/* 2. ATMOSPHERIC VOLUMETRIC LIGHTING */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 100% 100% at 50% 0%, rgba(24, 213, 208, 0.08) 0%, transparent 60%)',
          opacity: showScan ? 1 : 0,
          transition: 'opacity 2000ms ease-out'
        }}
      />

      {/* 3. SCIENTIFIC UI CORNER MARKS */}
      <div 
        className="absolute inset-6 pointer-events-none transition-all duration-[2000ms] ease-out"
        style={{
          opacity: showScan ? 1 : 0,
          transform: showScan ? 'scale(1)' : 'scale(1.05)'
        }}
      >
        <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-orca-primary/40" />
        <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-orca-primary/40" />
        <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-orca-primary/40" />
        <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-orca-primary/40" />
        
        {/* Coordinates */}
        <div className="absolute bottom-1 left-12 text-[10px] font-mono tracking-widest text-orca-primary/50">
          SYS_LOC: 18°58′N 72°49′E
        </div>
        <div className="absolute bottom-1 right-12 text-[10px] font-mono tracking-widest text-orca-primary/50">
          DPT: 0842M [ABYSSAL]
        </div>
      </div>

      {/* 4. WHALE DETECTION (THE CENTERPIECE) */}
      <div
        className="absolute top-1/2 left-1/2 w-[120vw] h-[120vh] max-w-[1200px] max-h-[800px] pointer-events-none"
        style={{
          transform: `translate(-50%, -50%)`,
        }}
      >
        <div 
          className="relative w-full h-full transition-all duration-[4000ms] ease-out"
          style={{
            // 3D Cinematic Panning
            transform: showDetect ? 'translate3d(0%, 0, 0) scale(1)' : 'translate3d(-10%, 5%, 0) scale(1.1)',
            opacity: showDetect ? 1 : 0,
            filter: showDetect ? 'blur(0px)' : 'blur(20px)',
          }}
        >
          {/* 
            CRITICAL FIX: Eliminating the rectangular boundary.
            1. mask-image creates a soft radial fade, making the image 100% transparent at the edges.
            2. mix-blend-mode: screen mathematically hides any remaining dark pixels against the background.
          */}
          <div 
            className="absolute inset-0"
            style={{
              WebkitMaskImage: 'radial-gradient(ellipse 60% 50% at 50% 50%, black 20%, transparent 70%)',
              maskImage: 'radial-gradient(ellipse 60% 50% at 50% 50%, black 20%, transparent 70%)',
              mixBlendMode: 'screen',
            }}
          >
            <Image
              src="/whale.png"
              alt="ORCA detected"
              fill
              priority
              style={{
                objectFit: 'contain',
                filter: 'brightness(1.2) contrast(1.1)', // Enhance highlights to pop through screen blend
                // Subtle continuous floating motion
                animation: 'orca-float 6s ease-in-out infinite alternate'
              }}
            />
          </div>
        </div>
      </div>

      {/* 5. BRAND REVEAL */}
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
        
        {/* Main Logo Text */}
        <div 
          className="relative flex gap-4 md:gap-8 overflow-hidden pt-8 pb-4"
        >
          {['O', 'R', 'C', 'A'].map((letter, i) => (
            <span
              key={i}
              className="text-[4rem] md:text-[8rem] font-black text-white leading-none"
              style={{
                fontFamily: 'var(--font-space-grotesk), sans-serif',
                textShadow: '0 0 40px rgba(24, 213, 208, 0.4)',
                opacity: showBrand ? 1 : 0,
                transform: showBrand ? 'translateY(0)' : 'translateY(40px)',
                filter: showBrand ? 'blur(0px)' : 'blur(10px)',
                transition: `all 1200ms cubic-bezier(0.16, 1, 0.3, 1) ${i * 150}ms`
              }}
            >
              {letter}
            </span>
          ))}
        </div>

        {/* Tagline */}
        <div 
          className="text-xs md:text-sm font-semibold tracking-[0.5em] text-orca-primary/80 uppercase mt-2"
          style={{
            opacity: showBrand ? 1 : 0,
            transform: showBrand ? 'translateY(0)' : 'translateY(10px)',
            transition: 'all 1200ms ease-out 800ms'
          }}
        >
          Marine Ecosystem Intelligence
        </div>
      </div>

      {/* 6. SYSTEM ONLINE (Bottom Center) */}
      <div 
        className="absolute bottom-20 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 pointer-events-none"
        style={{
          opacity: showOnline ? 1 : 0,
          transform: showOnline ? 'translateY(0)' : 'translateY(10px)',
          transition: 'all 800ms ease-out'
        }}
      >
        <div className="flex items-center gap-3 bg-orca-surface/40 px-4 py-2 rounded-full border border-orca-border/50 backdrop-blur-md">
          <div className="relative flex items-center justify-center w-2 h-2">
            <div className="absolute w-full h-full bg-orca-safe rounded-full animate-ping opacity-75" />
            <div className="relative w-full h-full bg-orca-safe rounded-full shadow-[0_0_10px_rgba(25,217,138,0.8)]" />
          </div>
          <span className="text-xs font-bold tracking-[0.3em] text-orca-safe uppercase">
            System Online
          </span>
        </div>
        
        {/* Decorative Loading Bar */}
        <div className="w-32 h-[2px] bg-orca-surface overflow-hidden rounded-full">
          <div className="h-full bg-orca-primary shadow-[0_0_8px_rgba(24,213,208,0.8)] animate-scan-fast" />
        </div>
      </div>

      {/* ANIMATIONS */}
      <style>{`
        @keyframes orca-float {
          0% { transform: translateY(-10px) rotate(-1deg); }
          100% { transform: translateY(10px) rotate(1deg); }
        }
        @keyframes scan-fast {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
      `}</style>
    </div>
  );
}
