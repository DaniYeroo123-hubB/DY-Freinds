import React, { useState, useRef, useEffect } from 'react';
import { MemoryItem } from '../types';
import { Disc3, StickyNote, Ticket, Sparkles, Image as ImageIcon, RotateCw, Trophy, Award, Medal, MapPin } from 'lucide-react';
import { soundEngine } from '../utils/audio';

interface MemoryArtifactProps {
  memory?: MemoryItem;
  item?: MemoryItem;
  cameraZ: number;
}

export const MemoryArtifact: React.FC<MemoryArtifactProps> = ({ memory: propMemory, item, cameraZ }) => {
  const activeItem = propMemory || item;
  const [flipped, setFlipped] = useState(false);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const frameId = requestAnimationFrame(() => setIsMounted(true));
    return () => cancelAnimationFrame(frameId);
  }, []);

  if (!activeItem || !activeItem.pos) {
    return null;
  }
  const memory = activeItem;

  const relativeZ = memory.pos.z + cameraZ;

  // Frustum boundaries for smooth entrance & exit sequences
  const FAR_CULL = -1700;
  const FAR_ENTRY_START = -1600;
  const FAR_ENTRY_SETTLED = -700;
  const NEAR_EXIT_START = 70;
  const NEAR_EXIT_END = 175;
  const NEAR_CULL = 185;

  if (relativeZ < FAR_CULL || relativeZ > NEAR_CULL) {
    return null;
  }

  // Frustum Entrance Progress (0 = far entry plane, 1 = focal zone)
  const entryT = Math.min(1, Math.max(0, (relativeZ - FAR_ENTRY_START) / (FAR_ENTRY_SETTLED - FAR_ENTRY_START)));
  // High-order smooth cubic ease-out for cushioned deceleration into view
  const easedEntry = 1 - Math.pow(1 - entryT, 2.5);

  // Near exit factor (as camera glides past the artifact)
  let exitFactor = 1;
  let exitScaleBonus = 0;
  if (relativeZ > NEAR_EXIT_START) {
    const exitT = Math.min(1, Math.max(0, (relativeZ - NEAR_EXIT_START) / (NEAR_EXIT_END - NEAR_EXIT_START)));
    exitFactor = Math.max(0, 1 - exitT);
    exitScaleBonus = exitT * 0.1;
  }

  // Smooth scale-up sequence: scales up from 0.65 to 1.0 as it enters the camera view frustum
  const targetScale = (0.65 + 0.35 * easedEntry) + exitScaleBonus;
  const activeScale = isMounted ? targetScale : 0.6;

  // Smooth fade-in sequence: hermite s-curve ensures no sudden pop-in
  const entryOpacity = entryT * entryT * (3 - 2 * entryT);
  const targetOpacity = Math.min(1, Math.max(0, entryOpacity * exitFactor));
  const activeOpacity = isMounted ? targetOpacity : 0;

  if (activeOpacity < 0.01) {
    return null;
  }

  // Subtle floating elevation during frustum entrance
  const entryElevationY = (1 - easedEntry) * 16;

  // Distance softening filter: ultra-subtle per requirements
  const farDist = Math.max(0, -relativeZ - 550);
  const blurPx = Math.min(1.5, farDist * 0.0025);
  const filter = blurPx >= 0.7 ? `blur(${blurPx.toFixed(1)}px)` : 'none';

  // Interaction pointer events (active only when comfortably in front of camera)
  const pointerEvents: 'auto' | 'none' =
    relativeZ >= -550 && relativeZ <= 90 && activeOpacity > 0.5 ? 'auto' : 'none';

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const tiltX = -((y - rect.height / 2) / (rect.height / 2)) * 14;
    const tiltY = ((x - rect.width / 2) / (rect.width / 2)) * 14;
    setTilt({ x: tiltX, y: tiltY });
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setTilt({ x: 0, y: 0 });
  };

  const handleToggleFlip = () => {
    setFlipped((prev) => !prev);
    soundEngine.playChime(659.25, 0.4);
  };

  const baseTransform = `translate3d(${memory.pos.x}px, ${memory.pos.y}px, ${memory.pos.z}px) rotateY(${
    memory.pos.rotY || 0
  }deg) rotateZ(${memory.pos.rotZ || 0}deg)`;

  return (
    <div
      id={`memory-artifact-${memory.id}`}
      className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transition-opacity duration-300 select-none"
      style={{
        transform: baseTransform,
        opacity: activeOpacity,
        filter,
        pointerEvents,
        transformStyle: 'preserve-3d',
        willChange: 'transform, opacity, filter',
      }}
    >
      {/* Frustum Entrance Scale-Up & Floating Wrapper */}
      <div
        className="transition-transform duration-200 ease-out animate-float-subtle"
        style={{
          transformStyle: 'preserve-3d',
          transform: `scale(${activeScale.toFixed(3)}) translateY(${entryElevationY.toFixed(1)}px)`,
          willChange: 'transform',
        }}
      >
        <div
          ref={containerRef}
          data-cursor="artifact"
          data-cursor-label="Flip & Inspect"
          onMouseEnter={() => setIsHovered(true)}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          onClick={handleToggleFlip}
          title="Click to inspect & flip in 3D"
          className="cursor-pointer group select-none transition-transform duration-150 ease-out"
          style={{
            transformStyle: 'preserve-3d',
            transform: isHovered
              ? `rotateX(${tilt.x.toFixed(2)}deg) rotateY(${tilt.y.toFixed(2)}deg) translateZ(35px) scale(1.05)`
              : 'rotateX(0deg) rotateY(0deg) translateZ(0px) scale(1)',
          }}
        >
        {/* Render artifact based on type */}
        {memory.type === 'polaroid' ? (
          <div
            className="w-64 sm:w-72 bg-white text-zinc-900 p-3 pb-5 rounded-xl shadow-2xl transition-transform duration-500 relative border border-white/30"
            style={{
              transformStyle: 'preserve-3d',
              transform: flipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
              boxShadow: '0 25px 50px rgba(0, 0, 0, 0.7), 0 0 25px rgba(56, 189, 248, 0.2)',
            }}
          >
            {/* FRONT OF POLAROID */}
            <div
              className="backface-hidden"
              style={{
                display: flipped ? 'none' : 'block',
              }}
            >
              <div className="relative aspect-[3/4] bg-zinc-950 rounded-lg overflow-hidden border border-zinc-300">
                <img
                  src={memory.image || '/founder-image-wrap.jpg'}
                  alt={memory.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover object-top filter contrast-105"
                />
                <div className="absolute bottom-2 left-2 right-2 bg-black/70 backdrop-blur-sm rounded-lg px-2.5 py-1 text-white text-[11px] font-mono flex items-center justify-between">
                  <span>Daniel & Yerosen</span>
                  <span className="text-amber-400 font-bold">😭 🔥</span>
                </div>
              </div>

              <div className="mt-3 flex items-center justify-between">
                <div>
                  <h4 className="font-serif font-bold text-sm text-zinc-900 leading-tight">
                    {memory.title}
                  </h4>
                  <p className="text-[11px] text-zinc-500 font-medium">{memory.date}</p>
                </div>
                <div className="p-1.5 rounded-full bg-zinc-100 text-zinc-600 group-hover:text-blue-600 transition-colors">
                  <RotateCw className="w-3.5 h-3.5" />
                </div>
              </div>
            </div>

            {/* BACK OF POLAROID (HANDWRITTEN NOTE) */}
            <div
              className="backface-hidden p-3 min-h-[300px] flex flex-col justify-between"
              style={{
                display: flipped ? 'flex' : 'none',
                transform: 'rotateY(180deg)',
              }}
            >
              <div>
                <div className="flex items-center justify-between border-b pb-2 mb-3 text-zinc-500 text-xs">
                  <span className="font-mono text-[10px]">MEMORANDUM</span>
                  <span className="text-blue-600 font-bold text-[10px]">BROTHERHOOD</span>
                </div>
                <p className="font-serif italic text-zinc-800 text-sm leading-relaxed">
                  {memory.details || memory.content}
                </p>
                <div className="mt-4 p-2 bg-amber-50 rounded border border-amber-200 text-[11px] text-amber-900 font-mono">
                  &ldquo;Two brothers moving together through every chapter of life.&rdquo;
                </div>
              </div>
              <div className="text-[10px] text-zinc-400 font-mono text-center pt-2">
                Click to flip photo back
              </div>
            </div>
          </div>
        ) : memory.type === 'cassette' ? (
          /* 3D VINTAGE CASSETTE / MIXTAPE */
          <div
            className="w-64 sm:w-72 bg-gradient-to-br from-zinc-900 to-black p-4 rounded-2xl border border-zinc-700 shadow-2xl text-zinc-200"
            style={{
              boxShadow: '0 20px 40px rgba(0,0,0,0.8), 0 0 20px rgba(245, 158, 11, 0.2)',
            }}
          >
            <div className="flex items-center justify-between border-b border-zinc-800 pb-2 mb-3">
              <span className="text-[10px] font-mono tracking-wider text-amber-400 uppercase">
                Mixtape • Hype Anthem
              </span>
              <Disc3 className="w-4 h-4 text-amber-400 animate-spin" style={{ animationDuration: '6s' }} />
            </div>
            <div className="bg-zinc-950 p-2.5 rounded-xl border border-zinc-800 mb-3 flex items-center justify-center gap-4">
              <div className="w-10 h-10 rounded-full border-4 border-dashed border-zinc-600 animate-spin" style={{ animationDuration: '4s' }} />
              <div className="h-6 w-16 bg-zinc-800 rounded flex items-center justify-center text-[10px] text-zinc-400 font-mono">
                BROTHERS
              </div>
              <div className="w-10 h-10 rounded-full border-4 border-dashed border-zinc-600 animate-spin" style={{ animationDuration: '4s' }} />
            </div>
            <h4 className="font-bold text-xs text-white mb-1">{memory.title}</h4>
            <p className="text-[11px] text-zinc-400 leading-snug">{memory.content}</p>
          </div>
        ) : memory.type === 'bracelet' ? (
          /* 3D GOLDEN ACADEMIC MEDAL & ETHIOPIAN RIBBON */
          <div
            className="w-64 sm:w-72 bg-gradient-to-b from-[#181510] via-[#100e0b] to-[#0a0907] p-4 rounded-2xl border border-amber-500/40 shadow-2xl text-zinc-100 relative overflow-hidden"
            style={{
              boxShadow: '0 25px 50px rgba(0,0,0,0.85), 0 0 25px rgba(245, 158, 11, 0.25)',
            }}
          >
            {/* Ethiopian Tricolor Ribbon Accent Bar (Green, Yellow, Red) */}
            <div className="absolute top-0 left-0 right-0 h-1.5 flex">
              <div className="w-1/3 bg-emerald-500" />
              <div className="w-1/3 bg-amber-400" />
              <div className="w-1/3 bg-red-500" />
            </div>

            <div className="flex items-center justify-between border-b border-amber-500/20 pb-2.5 mb-3 mt-1">
              <div className="flex items-center gap-1.5 text-[10px] font-mono uppercase text-amber-400 font-bold">
                <Medal className="w-3.5 h-3.5 text-amber-400" />
                <span>Academic Championship</span>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-500/20 border border-amber-400/30 text-amber-300">
                Gold
              </span>
            </div>

            {/* Medallion Display */}
            <div className="flex items-center gap-3.5 mb-3 bg-amber-950/20 p-2.5 rounded-xl border border-amber-500/20">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-300 via-amber-500 to-amber-700 flex items-center justify-center shadow-lg shrink-0 border border-amber-200">
                <Trophy className="w-6 h-6 text-zinc-950 fill-zinc-950" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-amber-200 leading-snug">{memory.title}</h4>
                <p className="text-[10px] text-amber-400/80 font-mono mt-0.5">{memory.date}</p>
              </div>
            </div>

            <p className="text-xs text-zinc-300 leading-relaxed">{memory.content}</p>

            {memory.details && (
              <div className="mt-3 pt-2 border-t border-amber-500/20 text-[11px] text-amber-300 font-serif italic">
                {memory.details}
              </div>
            )}
          </div>
        ) : memory.type === 'ticket' ? (
          /* 3D COMPETITION ENTRY PASS & STAGE BADGE */
          <div
            className="w-64 sm:w-72 bg-gradient-to-br from-zinc-900 to-zinc-950 p-4 rounded-2xl border border-cyan-500/30 shadow-2xl text-zinc-100 relative overflow-hidden"
            style={{
              boxShadow: '0 20px 40px rgba(0,0,0,0.8), 0 0 20px rgba(6, 182, 212, 0.2)',
            }}
          >
            {/* Lanyard Clip Hole */}
            <div className="absolute top-2 left-1/2 -translate-x-1/2 w-8 h-2 rounded-full bg-zinc-950 border border-white/20" />

            <div className="flex items-center justify-between border-b border-white/10 pb-2 mb-3 mt-2">
              <div className="flex items-center gap-1 text-[10px] font-mono text-cyan-400 font-semibold tracking-wider">
                <Ticket className="w-3.5 h-3.5 text-cyan-400" />
                <span>OFFICIAL BADGE</span>
              </div>
              <span className="text-[10px] text-zinc-400 font-mono flex items-center gap-1">
                <MapPin className="w-3 h-3 text-red-400" /> Ethiopia
              </span>
            </div>

            <h4 className="font-bold text-sm text-white mb-1">{memory.title}</h4>
            <div className="text-[10px] text-cyan-300 font-mono mb-2">{memory.date}</div>
            <p className="text-xs text-zinc-300 leading-relaxed mb-3">{memory.content}</p>

            {memory.details && (
              <div className="p-2 rounded-lg bg-white/5 border border-white/10 text-[11px] text-zinc-300 font-mono">
                {memory.details}
              </div>
            )}

            {/* Ticket Perforation Barcode */}
            <div className="mt-3 pt-2 border-t border-dashed border-white/20 flex items-center justify-between text-[9px] font-mono text-zinc-500">
              <span>||||||| | |||| | ||||||</span>
              <span>STAGE PASS #2016-17</span>
            </div>
          </div>
        ) : (
          /* 3D FLOATING NOTE OR PACT */
          <div
            className="w-60 sm:w-68 bg-[#121110] p-4 rounded-2xl border border-amber-400/25 shadow-2xl text-zinc-200"
            style={{
              boxShadow: '0 20px 40px rgba(0,0,0,0.8), 0 0 20px rgba(245, 158, 11, 0.15)',
            }}
          >
            <div className="flex items-center gap-2 mb-2">
              <StickyNote className="w-4 h-4 text-amber-400" />
              <span className="text-[10px] uppercase font-bold tracking-wider text-amber-300">
                {memory.date}
              </span>
            </div>
            <h4 className="font-bold text-sm text-white mb-1 font-serif">{memory.title}</h4>
            <p className="text-xs text-zinc-300 leading-relaxed font-sans">{memory.content}</p>
            {memory.details && (
              <p className="text-[11px] text-amber-300/90 mt-2 italic border-t border-white/10 pt-1.5 font-serif">
                {memory.details}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  </div>
  );
};
