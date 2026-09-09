'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';

interface OrcaEntryAnimationProps {
  onComplete: () => void;
}

/**
 * ORCA Cinematic Entry Animation
 *
 * The whale.png has a near-black underwater background.
 * By setting mix-blend-mode: screen on the whale image,
 * the dark background becomes optically transparent
 * (black + screen = nothing) while the bright whale body
 * pixels are preserved and composited over the scene.
 * The intro background color is tuned to match the darkest
 * pixels in the whale photo for a seamless blend.
 */
export default function OrcaEntryAnimation({ onComplete }: OrcaEntryAnimationProps) {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (mediaQuery.matches) { onComplete(); return; }

    // Phase timeline (per spec)
    // 0 → scene
    // 1 → ORCA wordmark emerges    (0.5s)
    // 2 → whale swims in           (0.9s)
    // 3 → MARINE ECOSYSTEM appears (2.6s)
    // 4 → SYSTEM ONLINE            (3.0s)
    // 5 → start exit transition    (3.2s)
    // done                         (4.1s)
    const timers = [
      setTimeout(() => setPhase(1), 500),
      setTimeout(() => setPhase(2), 900),
      setTimeout(() => setPhase(3), 2600),
      setTimeout(() => setPhase(4), 3000),
      setTimeout(() => setPhase(5), 3200),
      setTimeout(() => onComplete(), 4100),
    ];
    return () => timers.forEach(clearTimeout);
  }, [onComplete]);

  const exiting = phase >= 5;

  return (
    <>
      {/* ── Keyframe styles ─────────────────────────────────── */}
      <style>{`
        /* Vertical bob — continuous while visible */
        @keyframes orcaBob {
          0%   { transform: translateY(0px)   rotate(-1.5deg); }
          25%  { transform: translateY(-10px)  rotate(-0.5deg); }
          50%  { transform: translateY(-18px)  rotate(0.5deg);  }
          75%  { transform: translateY(-8px)   rotate(-0.8deg); }
          100% { transform: translateY(0px)   rotate(-1.5deg); }
        }

        /* Horizontal swim in — from off-screen left to resting position */
        @keyframes orcaSwimIn {
          0%   { transform: translateX(-55vw); }
          100% { transform: translateX(0);     }
        }

        /* Exit drift — whale glides up-right and fades */
        @keyframes orcaExitDrift {
          from { transform: translate(0, 0)    scale(1);    opacity: 1; }
          to   { transform: translate(12vw, -8vh) scale(0.9); opacity: 0; }
        }

        /* Subtle particle drift */
        @keyframes particleDrift {
          0%   { transform: translateY(0)   opacity: 0;   }
          10%  {                            opacity: 0.6; }
          90%  {                            opacity: 0.4; }
          100% { transform: translateY(-80px) opacity: 0; }
        }

        /* Light ray shimmer */
        @keyframes rayShimmer {
          0%,100% { opacity: 0.06; }
          50%     { opacity: 0.14; }
        }

        /* Slow wordmark pulse */
        @keyframes orcaWordPulse {
          0%,100% { text-shadow: 0 0 80px rgba(24,213,208,0.12); }
          50%     { text-shadow: 0 0 140px rgba(24,213,208,0.28); }
        }
      `}</style>

      {/* ── Root: full-screen intro overlay ──────────────────── */}
      <div
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 9999,
          overflow: 'hidden',
          // Background precisely matches the darkest pixels in whale.png
          // so mix-blend-mode:screen erases the photo background seamlessly
          background: '#030f18',
          opacity: exiting ? 0 : 1,
          transition: exiting ? 'opacity 900ms cubic-bezier(0.4,0,0.2,1)' : 'none',
          pointerEvents: exiting ? 'none' : 'auto',
        }}
      >

        {/* ── Depth layer 1: deep ocean gradient ── */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'radial-gradient(ellipse 120% 80% at 50% 30%, #062033 0%, #041422 40%, #030f18 100%)',
        }} />

        {/* ── Depth layer 2: light shaft from top ── */}
        {[
          { left: '38%', width: '3%',  delay: '0s',   skew: '-3deg' },
          { left: '48%', width: '6%',  delay: '0.4s', skew: '0deg'  },
          { left: '58%', width: '2.5%',delay: '0.8s', skew: '4deg'  },
        ].map((r, i) => (
          <div key={i} style={{
            position: 'absolute',
            top: 0, left: r.left,
            width: r.width, height: '65%',
            background: 'linear-gradient(to bottom, rgba(100,190,240,0.18) 0%, transparent 100%)',
            transform: `skewX(${r.skew})`,
            animation: `rayShimmer 4s ease-in-out ${r.delay} infinite`,
            transformOrigin: 'top center',
            pointerEvents: 'none',
          }} />
        ))}

        {/* ── Depth layer 3: floating particles ── */}
        {Array.from({ length: 28 }).map((_, i) => (
          <div key={i} style={{
            position: 'absolute',
            left: `${5 + (i * 37) % 90}%`,
            top:  `${10 + (i * 53) % 75}%`,
            width:  `${1.5 + (i % 3) * 0.8}px`,
            height: `${1.5 + (i % 3) * 0.8}px`,
            borderRadius: '50%',
            background: `rgba(140,210,240,${0.2 + (i % 4) * 0.12})`,
            animation: `particleDrift ${4 + (i % 5)}s ease-in-out ${(i * 0.37) % 4}s infinite`,
            pointerEvents: 'none',
          }} />
        ))}

        {/* ── Midground: subtle haze vignette ── */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'radial-gradient(ellipse 90% 60% at 50% 55%, transparent 30%, rgba(2,10,18,0.55) 100%)',
          pointerEvents: 'none',
        }} />

        {/* ══ GIANT ORCA WORDMARK (background typography) ══ */}
        <div
          style={{
            position: 'absolute',
            top: '50%', left: '50%',
            transform: 'translate(-50%, -50%)',
            fontSize: 'clamp(14vw, 20vw, 22vw)',
            fontFamily: "'Inter', sans-serif",
            fontWeight: 900,
            letterSpacing: '0.22em',
            color: '#0e3548',
            userSelect: 'none',
            pointerEvents: 'none',
            whiteSpace: 'nowrap',
            opacity: phase >= 1 ? 0.55 : 0,
            filter: phase >= 1 ? 'blur(0.5px)' : 'blur(6px)',
            transition: 'opacity 2000ms ease-out, filter 2000ms ease-out',
            animation: phase >= 1 ? 'orcaWordPulse 5s ease-in-out infinite' : 'none',
          }}
        >
          ORCA
        </div>

        {/* ══ WHALE (foreground subject) ══
            mix-blend-mode: screen makes the near-black photo background
            vanish while preserving the bright whale body pixels.
            The container moves horizontally (swim-in keyframe).
            The inner image bobs vertically (orcaBob keyframe).
        */}
        <div
          style={{
            position: 'absolute',
            /* Vertical center: whale body sits slightly below center */
            top: '50%',
            /* Horizontal anchor: whale rests at ~42% from left when settled */
            left: '50%',
            width: 'clamp(340px, 48vw, 760px)',
            height: 'clamp(180px, 26vw, 400px)',
            marginTop: 'clamp(-90px, -13vw, -200px)',
            marginLeft: 'clamp(-170px, -24vw, -380px)',
            /* Swim-in: starts off-screen left */
            animation: phase >= 2
              ? (exiting
                  ? 'orcaExitDrift 900ms cubic-bezier(0.4,0,0.6,1) forwards'
                  : 'orcaSwimIn 1500ms cubic-bezier(0.22,0.58,0.32,1) forwards')
              : 'none',
            /* Pre-swim: stay off-screen */
            transform: phase >= 2 ? undefined : 'translateX(-55vw)',
            pointerEvents: 'none',
          }}
        >
          {/* Inner: continuous bob (separate element so swim + bob compose) */}
          <div
            style={{
              width: '100%', height: '100%',
              animation: phase >= 2 && !exiting
                ? 'orcaBob 7s ease-in-out 1.4s infinite'
                : 'none',
            }}
          >
            <Image
              src="/whale.png"
              alt="Whale swimming through the ocean"
              fill
              priority
              sizes="(max-width: 768px) 90vw, 48vw"
              style={{
                objectFit: 'contain',
                /* KEY: screen blend erases the black background */
                mixBlendMode: 'screen',
                /* Slight brightness boost so the whale pops against the dark scene */
                filter: 'brightness(1.15) contrast(1.05)',
              }}
            />
          </div>
        </div>

        {/* ══ ORCA BRANDING (mid-level) ══ */}
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translateX(-50%)',
          marginTop: 'clamp(80px, 14vw, 180px)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 6,
          opacity: phase >= 1 ? 1 : 0,
          transition: 'opacity 1200ms ease-out',
          pointerEvents: 'none',
        }}>
          <div style={{
            fontSize: 'clamp(10px, 1vw, 13px)',
            fontWeight: 800,
            letterSpacing: '0.55em',
            textTransform: 'uppercase',
            color: '#18D5D0',
            fontFamily: "'Inter', sans-serif",
          }}>
            ORCA
          </div>
          <div style={{
            width: 32, height: 1,
            background: 'linear-gradient(to right, transparent, #18D5D0, transparent)',
          }} />
        </div>

        {/* ══ MARINE ECOSYSTEM INTELLIGENCE ══ */}
        <div style={{
          position: 'absolute',
          bottom: 'clamp(80px, 10vh, 130px)',
          left: '50%',
          transform: 'translateX(-50%)',
          opacity: phase >= 3 ? 1 : 0,
          transition: 'opacity 800ms ease-out, transform 800ms ease-out',
          textAlign: 'center',
          pointerEvents: 'none',
          whiteSpace: 'nowrap',
        }}>
          <div style={{
            fontSize: 'clamp(11px, 1.1vw, 14px)',
            fontWeight: 700,
            letterSpacing: '0.4em',
            textTransform: 'uppercase',
            color: '#819CA8',
            fontFamily: "'Inter', sans-serif",
          }}>
            Marine Ecosystem Intelligence
          </div>
        </div>

        {/* ══ SYSTEM ONLINE ══ */}
        <div style={{
          position: 'absolute',
          bottom: 'clamp(44px, 5.5vh, 72px)',
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          opacity: phase >= 4 ? 1 : 0,
          transition: 'opacity 500ms ease-out',
          pointerEvents: 'none',
          whiteSpace: 'nowrap',
        }}>
          <span style={{
            display: 'inline-block',
            width: 7, height: 7,
            borderRadius: '50%',
            background: '#19D98A',
            boxShadow: '0 0 8px rgba(25,217,138,0.8)',
            animation: 'particleDrift 2s ease-in-out infinite', // subtle pulse reuse
          }} />
          <span style={{
            fontSize: 10,
            fontWeight: 700,
            letterSpacing: '0.3em',
            textTransform: 'uppercase',
            color: '#19D98A',
            fontFamily: "'Inter', sans-serif",
          }}>
            System Online
          </span>
        </div>

      </div>
    </>
  );
}
