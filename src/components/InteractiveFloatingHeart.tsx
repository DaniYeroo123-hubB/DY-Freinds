import React, { useState, useRef, useCallback, useEffect } from 'react';
import { Heart } from 'lucide-react';
import { soundEngine } from '../utils/audio';
import { Tooltip } from './Tooltip';

interface Particle {
  id: number;
  dx: number;
  dy: number;
  rot: number;
  scale: number;
  color: string;
  size: number;
  delay: number;
  duration: number;
}

interface InteractiveFloatingHeartProps {
  id?: string;
  label?: string;
  tooltipText?: string;
  enableParticleBurst?: boolean;
  isActivated?: boolean;
  onActivate?: () => void;
  onClick?: (e: React.MouseEvent<HTMLElement>) => void;
  relativeZ?: number;
}

const AMBIENT_SPARKLE_STARS = [
  { id: 's1', top: '-6px', left: '-8px', size: 6, delay: '0s', duration: '2.4s', color: '#fde047' }, // amber-300
  { id: 's2', top: '-9px', right: '-7px', size: 7, delay: '0.8s', duration: '2.8s', color: '#ffffff' }, // diamond white
  { id: 's3', bottom: '-6px', left: '-9px', size: 5, delay: '1.5s', duration: '2.2s', color: '#fb7185' }, // rose-400
  { id: 's4', bottom: '-7px', right: '-9px', size: 6, delay: '0.4s', duration: '2.6s', color: '#fef08a' }, // soft gold
  { id: 's5', top: '12px', right: '-12px', size: 5, delay: '1.9s', duration: '2.5s', color: '#fda4af' }, // rose-300
  { id: 's6', top: '10px', left: '-12px', size: 6, delay: '1.2s', duration: '2.3s', color: '#fbbf24' }, // warm amber
];

const HEART_TRAIL_PARTICLES = [
  { id: 'tr1', swayX: -9, rot: -14, size: 7, delay: '0s', duration: '2.5s', color: '#fb7185' },
  { id: 'tr2', swayX: 8, rot: 12, size: 8, delay: '0.36s', duration: '2.8s', color: '#f43f5e' },
  { id: 'tr3', swayX: -7, rot: -8, size: 6, delay: '0.72s', duration: '2.4s', color: '#fde047' },
  { id: 'tr4', swayX: 9, rot: 16, size: 7, delay: '1.08s', duration: '2.7s', color: '#f472b6' },
  { id: 'tr5', swayX: -8, rot: -16, size: 8, delay: '1.44s', duration: '2.6s', color: '#fda4af' },
  { id: 'tr6', swayX: 8, rot: 10, size: 6, delay: '1.80s', duration: '2.9s', color: '#fbbf24' },
  { id: 'tr7', swayX: -6, rot: -6, size: 7, delay: '2.16s', duration: '2.5s', color: '#ffe4e6' },
];

const PARTICLE_COLORS = [
  '#fb7185', // rose-400
  '#f43f5e', // rose-500
  '#fda4af', // rose-300
  '#fbbf24', // amber-400
  '#f472b6', // pink-400
  '#ffe4e6', // rose-100
];

const GOLD_PARTICLE_COLORS = [
  '#fde047', // yellow-300
  '#facc15', // yellow-400
  '#fbbf24', // amber-400
  '#f59e0b', // amber-500
  '#fef08a', // yellow-200
  '#fffbeb', // amber-50
];

export const InteractiveFloatingHeart: React.FC<InteractiveFloatingHeartProps> = ({
  id = 'floating-heart',
  label = 'Brotherhood bond',
  tooltipText = 'Brotherhood Bond',
  enableParticleBurst = true,
  isActivated,
  onActivate,
  onClick,
  relativeZ,
}) => {
  const [particles, setParticles] = useState<Particle[]>([]);
  const [isHovered, setIsHovered] = useState(false);
  const [isHeartRingActive, setIsHeartRingActive] = useState(false);
  const [localActivated, setLocalActivated] = useState(false);
  const [isViewportBreathe, setIsViewportBreathe] = useState(false);

  // Track if this specific floating heart is activated (clicked)
  const isHeartActivated = isActivated !== undefined ? isActivated : localActivated;

  const nextParticleIdRef = useRef(0);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const ringTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const breatheTimerRef = useRef<NodeJS.Timeout | null>(null);
  const wasInViewRef = useRef(false);
  const heartRef = useRef<HTMLElement | null>(null);

  const triggerBreatheAnimation = useCallback(() => {
    setIsViewportBreathe(true);
    if (breatheTimerRef.current) clearTimeout(breatheTimerRef.current);
    breatheTimerRef.current = setTimeout(() => {
      setIsViewportBreathe(false);
    }, 1600);
  }, []);

  // 1. React effect: Trigger temporary 'breathe' scaling animation as heart enters viewport during 3D scroll
  useEffect(() => {
    if (relativeZ === undefined) return;
    // When the card/heart enters the visible 3D viewing corridor during camera scroll
    const isEnteringViewport = relativeZ > -950 && relativeZ < 120;
    if (isEnteringViewport && !wasInViewRef.current) {
      wasInViewRef.current = true;
      triggerBreatheAnimation();
    } else if (!isEnteringViewport && (relativeZ <= -1050 || relativeZ >= 180)) {
      wasInViewRef.current = false;
    }
  }, [relativeZ, triggerBreatheAnimation]);

  // 2. React effect: Trigger temporary 'breathe' scaling animation when DOM element intersects viewport
  useEffect(() => {
    const el = heartRef.current;
    if (!el) return;

    if (typeof IntersectionObserver === 'undefined') {
      triggerBreatheAnimation();
      return;
    }

    let isObsIntersecting = false;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !isObsIntersecting) {
            isObsIntersecting = true;
            triggerBreatheAnimation();
          } else if (!entry.isIntersecting) {
            isObsIntersecting = false;
          }
        });
      },
      {
        threshold: 0.15,
      }
    );

    observer.observe(el);

    return () => {
      observer.disconnect();
    };
  }, [triggerBreatheAnimation]);

  // 3. React effect: Trigger temporary 'breathe' scaling animation on component mount as it enters during 3D scroll
  useEffect(() => {
    triggerBreatheAnimation();
    return () => {
      if (breatheTimerRef.current) clearTimeout(breatheTimerRef.current);
    };
  }, [triggerBreatheAnimation]);

  const triggerHeartRing = useCallback(() => {
    setIsHeartRingActive(false);
    requestAnimationFrame(() => {
      setIsHeartRingActive(true);
      if (ringTimeoutRef.current) clearTimeout(ringTimeoutRef.current);
      ringTimeoutRef.current = setTimeout(() => {
        setIsHeartRingActive(false);
      }, 650);
    });
  }, []);

  const triggerBurst = useCallback((isClick = false) => {
    if (!enableParticleBurst) return;

    if (isClick) {
      // Explicit click: trigger subtle pleasant pop & chime audio effect via soundEngine
      soundEngine.playHeartPop(true);
    } else {
      // Subtle soft warm chime on hover
      soundEngine.playChime(659.25, 0.4);
    }

    // Generate burst particles radiating outward with upward drift
    const count = isClick ? 14 : 10;
    const newParticles: Particle[] = [];
    const baseId = nextParticleIdRef.current;
    nextParticleIdRef.current += count;

    const colors = (isHeartActivated || isClick) ? GOLD_PARTICLE_COLORS : PARTICLE_COLORS;

    for (let i = 0; i < count; i++) {
      // Golden ratio angle distribution for even magical spread
      const angle = (i / count) * 2 * Math.PI + (Math.random() * 0.4 - 0.2);
      const distance = (isClick ? 32 : 28) + Math.random() * (isClick ? 38 : 32);
      // Slight upward bias for floating feel
      const dx = Math.cos(angle) * distance;
      const dy = Math.sin(angle) * distance - (16 + Math.random() * 18);
      const rot = (Math.random() - 0.5) * 60;
      const scale = (isClick ? 0.75 : 0.65) + Math.random() * 0.45;
      const color = colors[Math.floor(Math.random() * colors.length)];
      const size = (isClick ? 10 : 9) + Math.random() * 5;
      const delay = Math.random() * 80;
      const duration = 750 + Math.random() * 300;

      newParticles.push({
        id: baseId + i,
        dx,
        dy,
        rot,
        scale,
        color,
        size,
        delay,
        duration,
      });
    }

    setParticles((prev) => [...prev.slice(-14), ...newParticles]);

    // Clear completed particles after animation completes
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      setParticles([]);
    }, 1200);
  }, [enableParticleBurst, isHeartActivated]);

  const handleMouseEnter = () => {
    setIsHovered(true);
    triggerBurst(false);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  const handleClick = (e: React.MouseEvent<HTMLElement>) => {
    e.stopPropagation();
    // React state transition: mark this specific heart as activated (acknowledged brotherhood bond)
    setLocalActivated(true);
    onActivate?.();

    // Play a short chime via soundEngine.playChime
    soundEngine.playChime(659.25, 0.6, true);
    triggerBurst(true);
    triggerHeartRing();
    onClick?.(e);
  };

  return (
    <aside
      id={id}
      aria-label={label}
      data-activated={isHeartActivated ? 'true' : 'false'}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
      className={`floating-card-heart sinusoidal-sway absolute -top-4 sm:-top-5 left-1/2 -translate-x-1/2 z-30 pointer-events-auto flex items-center justify-center animate-float-heart cursor-pointer ${
        isHeartRingActive ? 'animate-heart-ring' : ''
      } ${isHeartActivated ? 'is-activated active-brotherhood-bond' : ''}`}
      style={{
        transform: isHovered
          ? 'translateZ(82px) translateX(-50%) translateY(-2px)'
          : 'translateZ(60px) translateX(-50%)',
        transformStyle: 'preserve-3d',
      }}
    >
      {/* Hidden SVG defining the glowing gold gradient for the activated heart icon */}
      <svg width="0" height="0" className="absolute pointer-events-none opacity-0" aria-hidden="true">
        <defs>
          <linearGradient id={`gold-gradient-${id}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fffbeb" />
            <stop offset="25%" stopColor="#fef08a" />
            <stop offset="55%" stopColor="#facc15" />
            <stop offset="85%" stopColor="#eab308" />
            <stop offset="100%" stopColor="#ca8a04" />
          </linearGradient>
          <linearGradient id="gold-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fffbeb" />
            <stop offset="25%" stopColor="#fef08a" />
            <stop offset="55%" stopColor="#facc15" />
            <stop offset="85%" stopColor="#eab308" />
            <stop offset="100%" stopColor="#ca8a04" />
          </linearGradient>
        </defs>
      </svg>

      <div className="sinusoidal-sway animate-sinusoidal-sway relative flex items-center justify-center">
        {/* Soft ambient pulse glow - transforms to rich golden halo when activated */}
        <div
          className={`absolute w-8 h-8 rounded-full transition-all duration-500 ${
            isHeartActivated
              ? 'bg-gradient-to-tr from-amber-500/55 via-yellow-400/45 to-amber-200/55 blur-md shadow-[0_0_25px_rgba(245,158,11,0.65)] animate-heart-breathe'
              : isHovered
              ? 'bg-rose-500/50 scale-125 blur-lg'
              : 'bg-rose-500/30 blur-md animate-heart-breathe'
          }`}
        />

        {/* Continuous trail of tiny fading heart particles spawning behind the swaying heart */}
        <div className="absolute inset-0 pointer-events-none z-10 overflow-visible flex items-center justify-center">
          {HEART_TRAIL_PARTICLES.map((tr) => (
            <span
              key={tr.id}
              className="absolute pointer-events-none animate-heart-trail"
              style={
                {
                  '--trail-sway-x': `${tr.swayX}px`,
                  '--trail-rot': `${tr.rot}deg`,
                  '--trail-duration': tr.duration,
                  '--trail-delay': tr.delay,
                  color: tr.color,
                } as React.CSSProperties
              }
            >
              <Heart
                style={{
                  width: `${tr.size}px`,
                  height: `${tr.size}px`,
                  fill: tr.color,
                  color: tr.color,
                }}
              />
            </span>
          ))}
        </div>

        {/* Continuous subtle star sparkle particles orbiting the heart */}
        <div className="absolute -inset-3.5 pointer-events-none z-20">
          {AMBIENT_SPARKLE_STARS.map((star) => (
            <span
              key={star.id}
              className="absolute pointer-events-none animate-star-sparkle star-polygon"
              style={
                {
                  top: star.top,
                  bottom: star.bottom,
                  left: star.left,
                  right: star.right,
                  width: `${star.size}px`,
                  height: `${star.size}px`,
                  backgroundColor: star.color,
                  color: star.color,
                  animationDelay: star.delay,
                  '--star-duration': star.duration,
                } as React.CSSProperties
              }
            />
          ))}
        </div>

        {/* Quick scale-and-fade heart-ring pulse animation on click */}
        {isHeartRingActive && (
          <div
            className={`heart-ring absolute w-8 h-8 rounded-full border pointer-events-none animate-heart-ring ${
              isHeartActivated
                ? 'border-amber-400/90 shadow-[0_0_24px_rgba(250,204,21,0.85)]'
                : 'border-rose-400/80'
            }`}
          />
        )}

        {/* Wrap the floating heart icon in custom styled tooltip component */}
        <Tooltip
          id={`${id}-tooltip`}
          content={
            isHeartActivated
              ? (tooltipText === 'Brotherhood Bond' ? 'Brotherhood Bond Acknowledged ✨' : `${tooltipText} (Acknowledged ✨)`)
              : tooltipText
          }
          position="top"
        >
          <button
            type="button"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onClick={handleClick}
            aria-label={label}
            aria-describedby={`${id}-tooltip`}
            className={`group relative flex items-center justify-center w-8 h-8 rounded-full bg-zinc-950/95 border backdrop-blur-md transition-all duration-300 hover:scale-115 active:scale-95 cursor-pointer focus:outline-none ${
              isHeartActivated
                ? 'border-amber-400/90 shadow-[0_0_24px_rgba(245,158,11,0.7)] hover:border-amber-300 hover:shadow-[0_0_32px_rgba(250,204,21,0.95)] focus:ring-2 focus:ring-amber-400/50'
                : 'border-rose-400/50 hover:border-rose-400 shadow-[0_0_20px_rgba(244,63,94,0.45)] hover:shadow-[0_0_28px_rgba(244,63,94,0.7)] focus:ring-2 focus:ring-rose-400/50'
            }`}
          >
            <Heart
              className={`w-4 h-4 transition-all duration-300 ${
                isHeartActivated
                  ? 'scale-110 drop-shadow-[0_0_12px_rgba(250,204,21,0.9)] animate-heart-breathe'
                  : isHovered
                  ? 'scale-115 fill-rose-500 text-rose-300'
                  : 'text-rose-400 fill-rose-500/60 animate-heart-breathe'
              }`}
              style={
                isHeartActivated
                  ? {
                      fill: `url(#gold-gradient-${id})`,
                      stroke: '#fef08a',
                      filter:
                        'drop-shadow(0 0 6px rgba(250, 204, 21, 0.95)) drop-shadow(0 0 14px rgba(234, 179, 8, 0.75))',
                    }
                  : undefined
              }
            />
          </button>
        </Tooltip>

        {/* Burst of small fading heart particles */}
        {particles.map((p) => (
          <span
            key={p.id}
            className="absolute pointer-events-none animate-heart-particle"
            style={
              {
                '--dx': `${p.dx}px`,
                '--dy': `${p.dy}px`,
                '--rot': `${p.rot}deg`,
                '--scale': p.scale,
                '--duration': `${p.duration}ms`,
                animationDelay: `${p.delay}ms`,
                zIndex: 40,
              } as React.CSSProperties
            }
          >
            <Heart
              style={{
                width: `${p.size}px`,
                height: `${p.size}px`,
                color: p.color,
                fill: p.color,
                filter: `drop-shadow(0 0 6px ${p.color})`,
              }}
            />
          </span>
        ))}
      </div>
    </aside>
  );
};
