import React, { useEffect, useRef } from 'react';
import { FriendshipEcho } from '../types';
import { Sparkles, MessageSquareQuote, Volume2, Compass } from 'lucide-react';
import { soundEngine } from '../utils/audio';

interface FriendshipEchoesProps {
  echoes: FriendshipEcho[];
  cameraZ: number;
}

export const FriendshipEchoes: React.FC<FriendshipEchoesProps> = ({ echoes, cameraZ }) => {
  // Track triggered chimes so each echo only chimes once per crossing
  const triggeredEchoesRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    echoes.forEach((echo) => {
      const relativeZ = echo.pos.z + cameraZ;
      // Trigger subtle chime when crossing the focal center of the echo
      if (Math.abs(relativeZ) < 65) {
        if (!triggeredEchoesRef.current.has(echo.id)) {
          triggeredEchoesRef.current.add(echo.id);
          soundEngine.playEchoChime();
        }
      } else if (Math.abs(relativeZ) > 350) {
        // Reset when moving away so it can trigger again on return
        triggeredEchoesRef.current.delete(echo.id);
      }
    });
  }, [cameraZ, echoes]);

  return (
    <>
      {echoes.map((echo) => {
        const relativeZ = echo.pos.z + cameraZ;

        // Frustum culling: only render when approaching or within the viewing corridor
        if (relativeZ < -850 || relativeZ > 160) {
          return null;
        }

        // Calculate smooth fade-in and fade-out based on distance to camera
        let opacity = 0;
        let scale = 0.85;

        if (relativeZ >= -850 && relativeZ < -350) {
          // Approaching fade in
          const t = (relativeZ + 850) / 500;
          opacity = Math.max(0, Math.min(1, t * t * (3 - 2 * t) * 0.95));
          scale = 0.82 + t * 0.18;
        } else if (relativeZ >= -350 && relativeZ <= 40) {
          // Peak focal reading zone
          opacity = 0.95;
          scale = 1.0;
        } else if (relativeZ > 40 && relativeZ <= 160) {
          // Passing by fade out
          const t = (relativeZ - 40) / 120;
          opacity = Math.max(0, (1 - t) * 0.95);
          scale = 1.0 + t * 0.08;
        }

        if (opacity < 0.02) return null;

        // Subtle distance blur
        const farDist = Math.max(0, -relativeZ - 400);
        const blurPx = Math.min(1.5, farDist * 0.002);
        const filter = blurPx >= 0.7 ? `blur(${blurPx.toFixed(1)}px)` : 'none';

        const transform = `translate3d(${echo.pos.x}px, ${echo.pos.y}px, ${echo.pos.z}px) rotateX(${echo.pos.rotX || 0}deg) rotateY(${echo.pos.rotY || 0}deg) rotateZ(${echo.pos.rotZ || 0}deg) scale(${scale.toFixed(3)})`;

        return (
          <div
            key={echo.id}
            id={`friendship-echo-${echo.id}`}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-auto transition-opacity duration-300 select-none z-0"
            style={{
              transform,
              opacity,
              filter,
              transformStyle: 'preserve-3d',
              willChange: 'transform, opacity',
            }}
          >
            {/* Ethereal background aura */}
            <div
              data-cursor="echo"
              data-cursor-label="Memory Echo"
              className="relative group w-[340px] sm:w-[380px] rounded-2xl p-5 bg-[#0b0d14]/85 backdrop-blur-md border border-amber-500/25 shadow-[0_0_35px_rgba(245,158,11,0.08)] hover:border-amber-400/45 transition-all duration-300"
            >
              {/* Subtle ambient corner gradient glow */}
              <div
                className="absolute -inset-0.5 rounded-2xl bg-gradient-to-br from-amber-500/15 via-transparent to-sky-500/10 opacity-75 blur-sm pointer-events-none group-hover:opacity-100 transition-opacity"
                aria-hidden="true"
              />

              {/* Header: Title & Boarding School / Era Badge */}
              <div className="relative flex items-center justify-between gap-2 mb-3 pb-2.5 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-amber-500/15 flex items-center justify-center text-amber-300 animate-pulse">
                    <Sparkles className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] font-semibold tracking-wider uppercase text-amber-300">
                        Friendship Echo
                      </span>
                      <span className="w-1 h-1 rounded-full bg-amber-400/60" />
                      <span className="text-[10px] text-zinc-400 font-mono">{echo.era}</span>
                    </div>
                    <h4 className="text-xs font-medium text-zinc-200 tracking-wide">{echo.title}</h4>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => soundEngine.playEchoChime()}
                  className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-amber-300 transition-colors"
                  title="Listen to memory chime"
                  aria-label="Play echo chime"
                >
                  <Volume2 className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Location & Setting Tag */}
              <div className="relative flex items-center gap-1.5 text-[11px] text-amber-200/70 font-mono mb-3.5 bg-amber-950/30 px-2.5 py-1 rounded-md border border-amber-500/15 w-fit">
                <Compass className="w-3 h-3 text-amber-400" />
                <span>{echo.location}</span>
              </div>

              {/* Conversation Dialogue Snippet */}
              <div className="relative space-y-2.5">
                {echo.lines.map((line, idx) => {
                  const isDaniel = line.speaker.includes('Daniel');
                  const speakerColor = isDaniel ? 'text-amber-300' : 'text-sky-300';
                  const avatarBg = isDaniel
                    ? 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                    : 'bg-sky-500/20 text-sky-300 border-sky-500/30';

                  return (
                    <div
                      key={idx}
                      className="flex items-start gap-2.5 text-xs sm:text-[13px] leading-relaxed text-zinc-300 group/line"
                    >
                      <div
                        className={`mt-0.5 shrink-0 w-5 h-5 rounded-full border flex items-center justify-center text-[10px] font-bold ${avatarBg}`}
                      >
                        {line.speaker[0]}
                      </div>
                      <div className="flex-1">
                        <span className={`font-semibold ${speakerColor} mr-1.5 text-[11px] tracking-wide`}>
                          {line.speaker}:
                        </span>
                        <span className="italic font-serif text-zinc-200/90 group-hover/line:text-white transition-colors">
                          “{line.text}”
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Footer subtle watermark */}
              <div className="relative mt-3 pt-2 flex items-center justify-between text-[10px] text-zinc-500 font-mono">
                <span className="flex items-center gap-1">
                  <MessageSquareQuote className="w-3 h-3 text-amber-400/60" />
                  Past Conversation Echo
                </span>
                <span className="text-zinc-600">Scroll to explore</span>
              </div>
            </div>
          </div>
        );
      })}
    </>
  );
};
